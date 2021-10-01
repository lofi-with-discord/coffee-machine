import dotenv from 'dotenv'

import BotClient from './classes/BotClient'
import RestServer from './classes/RestServer'
import DatabaseClient from './classes/DatabaseClient'
import LavalinkClient from './classes/LavalinkClient'

import onReady from './events/onReady'
import onVoiceStateUpdate from './events/onVoiceStateUpdate'
import onInteractionCreate from './events/onInteractionCreate'

dotenv.config()

const db = new DatabaseClient()
const client = new BotClient()
const lavalink = new LavalinkClient(client)

// eslint-disable-next-line no-new
new RestServer(client)

client.onEvent('ready', onReady, lavalink, db)
client.onEvent('interactionCreate', onInteractionCreate)
client.onEvent('voiceStateUpdate', onVoiceStateUpdate, lavalink, db)
