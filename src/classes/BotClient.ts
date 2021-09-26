import _ from '../consts'

import { Client as DiscordClient, ClientEvents } from 'discord.js'

export default class BotClient extends DiscordClient {
  constructor () {
    super({ intents: _.INTENT_LIST })
    this.login(process.env.DISCORD_TOKEN)
  }

  public onEvent = (event: keyof ClientEvents, func: Function, ...extra: any[]) =>
    this.on(event, (...args) => func(...args, ...extra))
}
