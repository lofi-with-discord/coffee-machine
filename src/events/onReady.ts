import _ from '../consts'
import commands from '../commands'

import { cyan, green, yellow } from 'chalk'
import BotClient from 'classes/BotClient'
import { ApplicationCommandData } from 'discord.js'
import DatabaseClient from 'classes/DatabaseClient'
import LavalinkClient from '../classes/LavalinkClient'

export default async function onReady (client: BotClient, lavalink: LavalinkClient, db: DatabaseClient) {
  if (!client.user) return

  client.user.setActivity(_.ACTIVITY)
  console.log(green('Ready'), '-', client.user.tag)

  await lavalink.connect()
  console.log(green('Ready'), '-', 'lavalink')

  lavalink.on('ready', replayCrashedTracks(client, lavalink, db))
  replayCrashedTracks(client, lavalink, db)()
  
  if (process.env.TEST_REFRESH_COMMANDS !== 'true') return

  const commandMetas = Object.values(commands)
    .reduce((prev, curr) => [...prev, curr.meta], [] as ApplicationCommandData[])

  if (!process.env.TEST_GUILD_ID) await client.application?.commands.set(commandMetas)
  else await client.application?.commands.set(commandMetas, process.env.TEST_GUILD_ID)

  console.log(cyan('Registed'), '-', commandMetas.length, 'commands')
}

function replayCrashedTracks (client: BotClient, lavalink: LavalinkClient, db: DatabaseClient) {
  return async function () {
    const guilds = client.guilds.cache.filter((g) => !!g.me?.voice)

    for (const [, guild] of guilds) {
      const voiceChannel = guild.me?.voice.channel

      if (!voiceChannel) continue
      const membersIn = voiceChannel.members.filter((m) => !m.user.bot).size

      if (membersIn < 1) {
        await lavalink.stop(voiceChannel)
        continue
      }

      const brewing = db.getBrew(voiceChannel.guild.id)
      if (!brewing || brewing.channelId !== voiceChannel.id) continue

      const track = await lavalink.getTrack(brewing.videoURL)
      if (!track) continue

      console.log(yellow('\tReplaying'), guild.id)
      lavalink.play(voiceChannel, track)
    }
  }
}
