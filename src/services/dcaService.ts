import dotenv from "dotenv";
dotenv.config()

import { accountAssetInformation, getOrderBuy, newOrderBuy, tickerPrice } from "./tokocryptoService"
import { DBConnection } from '../db/prisma'
import { Telegram } from "../telegram/telegram";
import { formatCurrency } from "../utils/currencyFormatter";

const buyCoinJob = async () => {
    const coins = (process.env.COINS as string).split(",")
    const amount = parseInt(process.env.DAILY_AMOUNT as string)
    const stableCoin = process.env.STABLE_COIN as string
    const minimumAmount = 20000 // BIDR minimum to buy

    const mapCoinAmountToBuy = new Map<string, number>();

    const firstCoin = await accountAssetInformation(coins[0])
    const secondCoin = await accountAssetInformation(coins[1])

    if (firstCoin == null || secondCoin == null) {
        console.log("can't get coin amount")
        return
    }

    const firstCoinPrice = await tickerPrice(`${coins[0]}${stableCoin}`)
    const secondCoinPrice = await tickerPrice(`${coins[1]}${stableCoin}`)

    if (firstCoinPrice == null || secondCoinPrice == null) {
        console.log("can't get ticker price")
        return
    }

    const firstCoinAmount = firstCoin.data.free * firstCoinPrice.price
    const secondCoinAmount = secondCoin.data.free * secondCoinPrice.price


    if (firstCoinAmount < secondCoinAmount) {
        mapCoinAmountToBuy.set(coins[0], amount - minimumAmount)
        mapCoinAmountToBuy.set(coins[1], minimumAmount)
    } else {
        mapCoinAmountToBuy.set(coins[0], minimumAmount)
        mapCoinAmountToBuy.set(coins[1], amount - minimumAmount)
    }

    for (const coin of coins) {
        let amountToBuy = mapCoinAmountToBuy.get(coin)
        if (amountToBuy == undefined) {
            amountToBuy = minimumAmount
        }
        const symbol = `${coin}_${stableCoin}`
        console.log("buy", symbol, "with amount:", amountToBuy)
        if (amountToBuy == 0) {
            continue
        }
        const order = await newOrderBuy(symbol, amountToBuy)
        if (order == null) {
            console.log("can't put the order")
            continue
        }
        const orderDetail = await getOrderBuy(symbol, order.data.orderId)
        if (orderDetail == null) {
            console.log("can't get the order")
            continue
        }
        try {
            await DBConnection.conn.transaction.create({
                data: {
                    msg: order.msg,
                    symbol: symbol,
                    amount: amountToBuy,
                    orderId: order.data.orderId,
                    amountSpent: parseFloat(orderDetail.executedQuoteQty),
                    coinGet: parseFloat(orderDetail.executedQty),
                    executedPrice: parseFloat(orderDetail.executedPrice)

                }
            })
            await Telegram.sendMessage(`Buy ${symbol} with ${formatCurrency(parseInt(orderDetail.executedQuoteQty))} ${stableCoin}`)
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
        await Telegram.sendMessage(`You need to top up ${stableCoin}, current balance: ${formatCurrency(stableCoinAmount.data.free)}`)
    }
}

export {
    buyCoinJob,
    balanceReminder
}
