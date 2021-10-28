import { client } from '..'
import { magenta, yellow } from 'chalk'
import { get } from 'superagent'
import { Manager } from '@lavacord/discord.js'
import { StageChannel, VoiceChannel } from 'discord.js'

export default class LavalinkClient extends Manager {
  private trackCache: { [search: string]: string }

  constructor () {
    const nodeConfig = {
      id: 'main',
      host: process.env.LAVALINK_HOST || 'localhost',
      port: process.env.LAVALINK_PORT,
      password: process.env.LAVALINK_PASSWORD
    }

    super(client, [nodeConfig])

    this.trackCache = {}
  }

  public async getTrack (search: string) {
    if (this.trackCache[search]) return this.trackCache[search]

    const node = this.idealNodes[0]
    const url = new URL(`http://${node.host}:${node.port}/loadtracks`)
    url.searchParams.append('identifier', search)

    const res = await get(url.toString())
      .set('Authorization', node.password)

    const trackData = res.body.tracks?.[0]?.track
    if (!trackData) return ''

    this.trackCache[search] = trackData

    return trackData
  }

  public async play (channel: VoiceChannel | StageChannel, track: string) {
    await this.stop(channel)
    setTimeout(async () => {
      console.log(magenta('\t\tPlaying'), channel.id)

      const player = await this.join({ guild: channel.guild.id, channel: channel.id, node: 'main' })
      await player.play(track)

      player.once('end', (data) => data.reason === 'FINISHED' && (console.log(yellow('\tReplaying'), channel.id)! || this.play(channel, track)))
    }, 1000)
  }

  public stop (channel: VoiceChannel | StageChannel) {
    console.log(magenta('\t\tStopping'), channel.id)
    return this.leave(channel.guild.id)
  }
}
