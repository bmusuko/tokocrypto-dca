import dotenv from "dotenv";
dotenv.config()

import {newOrderBuy} from "./tokocryptoService"
import { DBConnection } from '../db/prisma'

const buyCoinJob = async () => {
    const coins = (process.env.COINS as string).split(",")
    const amount = parseInt(process.env.DAILY_AMOUNT as string)
    const stableCoin = process.env.STABLE_COIN as string

    for (const coin of coins) {
        const amountToBuy = Math.floor(amount * (1 / coins.length))
        const symbol = `${coin}_${stableCoin}`
        console.log("buy",symbol,"with amount:", amountToBuy)
        const order = await newOrderBuy(symbol, amountToBuy)
        if (order == null) {
            console.log("can't put the order")
            continue
        }
        try {
            await DBConnection.conn.transaction.create({
                data: {
                    msg: order.msg,
                    symbol: symbol,
                    amount: amountToBuy,
                    orderId: order.data.orderId
                }
            })
        } catch (error) {
            console.log(error)
        }

    }
}

export {
    buyCoinJob
}
