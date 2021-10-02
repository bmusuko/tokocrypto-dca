import axios from "axios"
import dotenv from "dotenv";
import crypto from "crypto"
import {
    GetBalanceReturn, OrderBuyReturn, OrderSide, 
    OrderTypes, TickerPriceReturn, OrderHistoryTypes, 
    OrderHistoryDirectionTypes, OrderGetReturn
} from "../types/TokocryptoTypes";

dotenv.config()

const TOKOCRYPTO_API_BASE_URL = "https://www.tokocrypto.com"
const BINANCE_API_BASE_URL = "https://api.binance.me"
const receiveWindow = "5000"

axios.defaults.headers = {
    "X-MBX-APIKEY": process.env.API_KEY as string,
    "Content-Type": "application/x-www-form-urlencoded"
}

const accountAssetInformation = async (coin: string): Promise<GetBalanceReturn | null> => {

    const API_URL = `${TOKOCRYPTO_API_BASE_URL}/open/v1/account/spot/asset`
    const params = new URLSearchParams({
        asset: coin,
        timestamp: (new Date().getTime()).toString(),
        recvWindow: receiveWindow
    }).toString()

    const signature = crypto.createHmac("sha256", process.env.PRIVATE_KEY as string).update(params).digest("hex")

    try {
        const res = await axios.get(`${API_URL}?${params.toString()}&signature=${signature}`)
        return res.data as GetBalanceReturn
    } catch (e) {
        console.log(e.message)
        return null
    }
}

const tickerPrice = async (symbol: String): Promise<TickerPriceReturn | null> => {
    const API_URL = `${BINANCE_API_BASE_URL}/api/v3/ticker/price?symbol=${symbol}`

    try {
        const res = await axios.get(`${API_URL}`)
        return res.data as TickerPriceReturn
    } catch (e) {
        console.log(e.message)
        return null
    }
}


const newOrderBuy  = async (symbol: string, quantity: number): Promise<OrderBuyReturn | null> => {
    const API_URL = `${TOKOCRYPTO_API_BASE_URL}/open/v1/orders`
    const params = new URLSearchParams({
        symbol: symbol,
        side: OrderSide.BUY,
        type: OrderTypes.MARKET,
        quoteOrderQty: quantity.toString(),
        timestamp: (new Date().getTime()).toString(),
        recvWindow: receiveWindow
    }).toString()

    const signature = crypto.createHmac("sha256", process.env.PRIVATE_KEY as string).update(params).digest("hex")
    const querystring = `${params.toString()}&signature=${signature}`

    try {
        const res = await axios.post(`${API_URL}?${querystring}`)
        return res.data as OrderBuyReturn
    } catch (e) {
        console.log(e.message)
        return null
    }
}

const getOrderBuy  = async (symbol: string, orderId: number) => {
    const API_URL = `${TOKOCRYPTO_API_BASE_URL}/open/v1/orders`
    const params = new URLSearchParams({
        symbol: symbol,
        timestamp: (new Date().getTime()).toString(),
        type: OrderHistoryTypes.HISTORY,
        fromId: `${orderId}`,
        direct: OrderHistoryDirectionTypes.PREVIOUS,
        recvWindow: receiveWindow
    }).toString()

    const signature = crypto.createHmac("sha256", process.env.PRIVATE_KEY as string).update(params).digest("hex")
    const querystring = `${params.toString()}&signature=${signature}`

    try {
        const res = await axios.get(`${API_URL}?${querystring}`)
        const data = res.data as OrderGetReturn
        const listitem = data.data.list.filter(order => {return order.symbol == symbol && order.orderId == orderId})
        if (listitem.length == 1) {
            return listitem[0]
        } else {
            return null
        }
    } catch (e) {
        console.log(e.message)
        return null
    }
}

export {
    accountAssetInformation,
    newOrderBuy,
    getOrderBuy,
    tickerPrice
}