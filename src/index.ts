import dotenv from 'dotenv'

import BotClient from './classes/BotClient'
import DatabaseClient from './classes/DatabaseClient'
import LavalinkClient from './classes/LavalinkClient'

import onReady from './events/onReady'
import onVoiceStateUpdate from './events/onVoiceStateUpdate'
import onInteractionCreate from './events/onInteractionCreate'

dotenv.config()

const db = new DatabaseClient()
const client = new BotClient()
const lavalink = new LavalinkClient(client)

client.onEvent('ready', onReady, lavalink, db)
client.onEvent('interactionCreate', onInteractionCreate)
client.onEvent('voiceStateUpdate', onVoiceStateUpdate, lavalink, db)
