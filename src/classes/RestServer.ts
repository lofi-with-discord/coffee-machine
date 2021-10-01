import { Client } from 'discord.js'
import BotClient from './BotClient'
import express, { Application, Request, Response } from 'express'
import { green } from 'chalk'

export default class RestServer {
  private client?: BotClient
  private app?: Application

  constructor (client: BotClient) {
    if (client.shard && client.shard.ids[0] > 0) return

    const port =
      process.env.RESTAPI_PORT || 3000

    this.app = express()
    this.client = client

    this.app.listen(port)
    this.app.get('/guild/:id',
      this.listChannels.bind(this))

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

    const result = !this.client?.shard
      ? this._listChannelsOfGuild(this.client!, id)
      : (await this.client.shard.broadcastEval((client) =>
          this._listChannelsOfGuild(client, id))).flat()

    res.send(result)
  }
}
