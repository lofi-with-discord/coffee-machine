import { ApplicationCommandData } from 'discord.js'

type Command = { default: Function, meta: ApplicationCommandData }
type CommandMap = { [key: string]: Command }

export default <CommandMap> {
  coffee: require('./coffee')
}
