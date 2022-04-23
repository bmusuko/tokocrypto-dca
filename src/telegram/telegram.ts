import { Telegraf } from 'telegraf'

export class Telegram {
    private static connection: Telegraf
    private static telegramUserId: string

    private constructor() { }

    public static async init() {
        if (!this.connection) {
            try {
                this.connection = new Telegraf(process.env.TELEGRAM_SECRET_TOKEN as string)
                this.telegramUserId = process.env.TELEGRAM_USER_ID as string

                this.connection.on('text', (ctx) =>  {
                    ctx.reply('Hello World')
                })
                this.connection.launch()


            } catch (error) {
                console.log('Error starting Telegram Connection', error)
            }
        }
    }

    public static get conn() {
        if (!this.connection) {
            throw Error('Init Telegram first')
        }
        return this.connection
    }

    public static async sendMessage(message: string) {
        this.connection.telegram.sendMessage(this.telegramUserId, message)
    }

}
