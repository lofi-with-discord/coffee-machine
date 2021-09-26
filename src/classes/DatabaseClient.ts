import _ from '../consts'
import { green } from 'chalk'
import knex, { Knex } from 'knex'
import { BrewData } from '../types'

export default class DatabaseClient {
  private db: Knex
  private brewCache: Map<string, BrewData>

  constructor () {
    this.db = knex({
      client: 'mysql',
      connection: {
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '3306'),
        database: process.env.DATABASE_SCHEMA || 'coffee',
        user: process.env.DATABASE_USER || 'coffee',
        password: process.env.DATABASE_PASSWORD
      }
    })

    this.brewCache = new Map()
    this.db.raw('SELECT 1').then(this.onReady.bind(this))

    setInterval(this.cacheBrews.bind(this), _.BREW_TIMEOUT)
  }

  private onReady () {
    console.log(green('Ready'), '- database')
    this.cacheBrews()
  }

  private async cacheBrews () {
    const brews = await this.db.select('*').from('brews')
    brews.forEach(brew => this.brewCache.set(brew.guildId, brew))
  }

  public getBrew = (guildId: string) =>
    this.brewCache.get(guildId)
}
