import { Guild, IntentsString, MessageActionRowComponentResolvable } from 'discord.js'

export default class _ {
  public static readonly INTENT_LIST
    = ['GUILDS', 'GUILD_VOICE_STATES'] as IntentsString[]

  public static readonly ACTIVITY
    = '/coffee | Brewing Coffee'

  public static readonly COMPONENT_ROW
    = (components: MessageActionRowComponentResolvable[]) =>
      ({ components, type: 1 })

  public static readonly COFFEE_IMAGE
    = 'https://cdn.discordapp.com/attachments/840213437003071488/891213291098103828/2e081ee00be98dbfc615fa5d5dc249b1.png'

  public static readonly COFFEE_EMOJI
    = '☕'

  public static readonly DASHBOARD_LABEL
    = 'Go to Dashboard'

  public static readonly DASHBOARD_URL
    = (guild: Guild) => `https://coffee.pmh.codes/dash/${guild.id}`

  public static readonly TOS_URL
    = 'https://lofi.pmh.codes/'

  public static readonly TOS_EMOJI
    = '📝'

  public static readonly TOS_LABEL
    = 'ToS & Privacy Policy'

  public static readonly BREW_TIMEOUT
    = 1000 * 30

  public static readonly DEFAULT_COLOR
    = 0x2f3136

  public static readonly HOW_TO_USE
    = 'Play YouTube videos without commands\n```md\nHow to use Coffee Machine:\njust click *Go to Dashboard* below```'
}
