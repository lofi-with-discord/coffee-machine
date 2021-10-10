import { client, db, lavalink } from '..'
import { Client, VoiceChannel } from 'discord.js'
import express, { Application, Request, Response } from 'express'
import { green } from 'chalk'

export default class RestServer {
  private app?: Application

  constructor () {
    if (client.shard && client.shard.ids[0] > 0) return

    const port =
      process.env.RESTAPI_PORT || 3000

    this.app = express()

    this.app.listen(port)
    this.app.get('/guild/:id',
      this.listChannels.bind(this))

    this.app.post('/guild/:id',
      this.refreshGuild.bind(this))

    console.log(green('Ready'), '- restapi', port)
  }

  private _listChannelsOfGuild (client: Client, id: string) {
    return client
      .guilds.cache.get(id)?.channels.cache
      .filter((c) => c.type === 'GUILD_VOICE')
      .map((c) => ({ id: c.id, name: c.name })) || []
  }

  private async listChannels (req: Request, res: Response) {
    const { id } = req.params

    const result = !client?.shard
      ? this._listChannelsOfGuild(client!, id)
      : (await client.shard.broadcastEval((client) =>
          this._listChannelsOfGuild(client, id))).flat()

    res.send(result)
  }

  private async refreshGuild (req: Request, res: Response) {
    await db.cacheBrews()
    const brewing = db.getBrew(req.params.id)

    res.send({ success: true })
    if (!brewing) return await lavalink.leave(req.params.id)

    const channel = client.guilds.resolve(req.params.id!)?.channels.resolve(brewing.channelId) as VoiceChannel
    if (!channel) return

    const many = channel.members.filter((member) => !member.user.bot).size || 0

    if (many > 0) {
      const track = await lavalink.getTrack(brewing.videoURL)
      if (!track) return

      await lavalink.play(channel, track)
    }
  }
}
