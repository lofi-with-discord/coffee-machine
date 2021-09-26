import { cyan } from 'chalk'
import commands from '../commands'
import { CommandInteraction, Interaction } from 'discord.js'

export default async function onInteractionCreate (interaction: Interaction) {
  if (!(interaction instanceof CommandInteraction)) return

  console.log(cyan('Command'), '-', interaction.commandName, interaction.id)

  await interaction.deferReply({ ephemeral: true })
  commands[interaction.commandName].default(interaction)
}
