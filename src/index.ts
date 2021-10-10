import dotenv from 'dotenv'

import BotClient from './classes/BotClient'
import RestServer from './classes/RestServer'
import DatabaseClient from './classes/DatabaseClient'
import LavalinkClient from './classes/LavalinkClient'

import onReady from './events/onReady'
import onVoiceStateUpdate from './events/onVoiceStateUpdate'
import onInteractionCreate from './events/onInteractionCreate'

dotenv.config()

export const db = new DatabaseClient()
export const client = new BotClient()
export const lavalink = new LavalinkClient()

// eslint-disable-next-line no-new
new RestServer()

client.onEvent('ready', onReady)
client.onEvent('interactionCreate', onInteractionCreate)
client.onEvent('voiceStateUpdate', onVoiceStateUpdate)
