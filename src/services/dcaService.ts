import dotenv from "dotenv";
dotenv.config()

import { newOrderBuy } from "./tokocryptoService"

const buyCoinJob = async () => {
    const coins = (process.env.COINS as string).split(",")
    const amount = parseInt(process.env.DAILY_AMOUNT as string)
    const stableCoin = process.env.STABLE_COIN as string

    for (const coin of coins) {
        const amountToBuy = Math.floor(amount * (1 / coins.length))
        const symbol = `${coin}_${stableCoin}`
        console.log("buy",symbol,"with amount:", amountToBuy)
        await newOrderBuy(symbol, amountToBuy)
    }
}

export {
    buyCoinJob
}