import { Agenda } from "agenda";
import { buyCoinJob } from "./services/dcaService"

const mongoConnectionString = `mongodb://mongodb.local/agenda`;
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
    await agenda.start();
    await agenda.every('0 8 * * *', BUY_COIN_JOB);
}

main().then(() => console.log("start service"))
