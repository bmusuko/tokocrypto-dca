import dotenv from "dotenv";
dotenv.config()

import { Agenda } from "agenda";
import { buyCoinJob } from "./services/dcaService"
import { DBConnection } from './db/prisma'

const mongoConnectionString = process.env.MONGODB_URL as string;
const BUY_COIN_JOB = "buy coin everyday"
const agenda = new Agenda(
    {
        db: { address: mongoConnectionString, collection: "Agenda" }
    }
);
agenda.define(BUY_COIN_JOB,
    async (_: any) => {
    console.log("execute buying");
    await buyCoinJob();
});

const main = async() => {
    await DBConnection.init()
    await agenda.start();
    await agenda.every('0 */6 * * *', BUY_COIN_JOB);
}

main().then(() => console.log("start service"))
