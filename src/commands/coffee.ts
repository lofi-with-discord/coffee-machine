import _ from '../consts'

import { ApplicationCommandData, CommandInteraction, MessageButton, MessageEmbed } from 'discord.js'

export default function CoffeeCommand (interaction: CommandInteraction) {
  const embed = new MessageEmbed()
    .setImage(_.COFFEE_IMAGE)
    .setColor(_.DEFAULT_COLOR)

  const embed2 = new MessageEmbed()
    .setColor(_.DEFAULT_COLOR)
    .setDescription(_.HOW_TO_USE)

  const dashBtn = new MessageButton()
    .setStyle('LINK')
    .setURL(_.DASHBOARD_URL(interaction.guild!))
    .setEmoji(_.COFFEE_EMOJI)
    .setLabel(_.DASHBOARD_LABEL)

  const tosButton = new MessageButton()
    .setStyle('LINK')
    .setURL(_.TOS_URL)
    .setEmoji(_.TOS_EMOJI)
    .setLabel(_.TOS_LABEL)

  interaction.editReply({ embeds: [embed, embed2], components: [_.COMPONENT_ROW([dashBtn, tosButton])] })
}

export const meta: ApplicationCommandData = {
  name: 'coffee',
  description: 'Open coffee machine dashboard'
}
