import dotenv from "dotenv";
dotenv.config()

import {accountAssetInformation, newOrderBuy} from "./tokocryptoService"
import { DBConnection } from '../db/prisma'
import { Telegram } from "../telegram/telegram";

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
            await Telegram.sendMessage(`Buy ${symbol} with ${amountToBuy} ${stableCoin}`)
        } catch (error) {
            console.log(error)
        }

    }
}

const balanceReminder = async () => {
    const stableCoin = process.env.STABLE_COIN as string

    const thresholdAmount = parseInt(process.env.THRESHOLD_BALANCE as string)
    const stableCoinAmount = await accountAssetInformation(stableCoin)
    if (stableCoinAmount == null) {
        console.log("can't get coin amount")
        return
    }

    if (stableCoinAmount.data.free < thresholdAmount) {
        await Telegram.sendMessage(`You need to top up ${stableCoin}, current balance: ${stableCoinAmount.data.free}`)
    }
}

export {
    buyCoinJob,
    balanceReminder
}
