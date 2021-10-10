import _ from '../consts'
import commands from '../commands'
import { client, db, lavalink } from '..'

import { cyan, green, yellow } from 'chalk'
import { ApplicationCommandData } from 'discord.js'

export default async function onReady () {
  if (!client.user) return

  client.user.setActivity(_.ACTIVITY)
  console.log(green('Ready'), '-', client.user.tag)

  await lavalink.connect()
  console.log(green('Ready'), '-', 'lavalink')

  if (process.env.TEST_REFRESH_COMMANDS !== 'true') return

  const commandMetas = Object.values(commands)
    .reduce((prev, curr) => [...prev, curr.meta], [] as ApplicationCommandData[])

  if (!process.env.TEST_GUILD_ID) await client.application?.commands.set(commandMetas)
  else await client.application?.commands.set(commandMetas, process.env.TEST_GUILD_ID)

  console.log(cyan('Registed'), '-', commandMetas.length, 'commands')

  lavalink.on('ready', replayCrashedTracks)
  replayCrashedTracks()
}

async function replayCrashedTracks () {
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
