import dotenv from "dotenv";
dotenv.config()

import { Agenda } from "agenda";
import { balanceReminder, buyCoinJob } from "./services/dcaService"
import { DBConnection } from './db/prisma'
import { Telegram } from "./telegram/telegram";

const mongoConnectionString = process.env.MONGODB_URL as string;
const BUY_COIN_JOB = "buy coin everyday"
const CHECK_BALANCE = "check balance"
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

agenda.define(CHECK_BALANCE,
    async (_: any) => {
        await balanceReminder();
    })

const main = async () => {
    await DBConnection.init();
    await Telegram.init();
    await agenda.start();
    await agenda.every(process.env.BUY_COIN_CRON as string, BUY_COIN_JOB);
    await agenda.every(process.env.CHECK_BALANCE_CRON as string, CHECK_BALANCE);
}

main().then(() => console.log("start service"))
