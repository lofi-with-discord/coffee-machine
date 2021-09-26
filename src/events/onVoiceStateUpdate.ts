import { yellow } from 'chalk'
import { VoiceState } from 'discord.js'
import DatabaseClient from '../classes/DatabaseClient'
import LavalinkClient from '../classes/LavalinkClient'

export default async function onVoiceStateUpdate (oldState: VoiceState, newState: VoiceState, lavalink: LavalinkClient, db: DatabaseClient) {
  if (oldState.member?.user.bot) return
  if (newState.member?.user.bot) return

  if (oldState.channel && !newState.channel) {
    console.log(yellow('\tLeaving'), oldState.channelId)
    const members = oldState.channel.members
    const isHere = oldState.guild.me?.voice.channel === oldState.channel
    const many = members.filter((member) => !member.user.bot).size

    if (!isHere) return
    if (many > 0) return

    return await lavalink.stop(oldState.channel)
  }

  if (!oldState.channel && newState.channel) {
    console.log(yellow('\tJoining'), newState.channelId)
    const brewing = db.getBrew(newState.guild.id)
    if (!brewing || brewing.channelId !== newState.channelId) return

    const isHere = newState.guild.me?.voice.channel === newState.channel
    if (isHere) return

    const track = await lavalink.getTrack(brewing.videoURL)
    if (!track) return

    lavalink.play(newState.channel, track)
    return
  }

  if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
    console.log(yellow('\tMoving'), oldState.channelId, '->', newState.channelId)

    const members = oldState.channel.members
    const isHere = oldState.guild.me?.voice.channel === oldState.channel

    const many = members.filter((member) => !member.user.bot).size

    if (many < 1 && isHere) lavalink.stop(oldState.channel)

    const brewing = db.getBrew(newState.guild.id)
    if (!brewing || brewing.channelId === oldState.channelId) return

    const isHere2 = newState.guild.me?.voice.channel === newState.channel
    if (isHere2) return

    const track = await lavalink.getTrack(brewing.videoURL)
    if (!track) return

    lavalink.play(newState.channel, track)
  }
}
