import { PrismaClient } from '@prisma/client'


export class DBConnection {
    private static connection: PrismaClient

    private constructor() { }

    public static async init() {
        if (!this.connection) {
            try {
                this.connection = new PrismaClient()
                await this.connection.$connect()
            } catch (error) {
                console.log('Error starting DB Connection', error)
            }
        }
    }

    public static get conn() {
        if (!this.connection) {
            throw Error('Init DB Connection first')
        }
        return this.connection
    }
}
