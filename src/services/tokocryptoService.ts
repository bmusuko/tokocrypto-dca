import axios from "axios"
import dotenv from "dotenv";
import crypto from "crypto"
import { OrderSide, OrderTypes } from "../types/TokocryptoTypes";

dotenv.config()

const TOKOCRYPTO_API_BASE_URL = "https://www.tokocrypto.com"
// const BINANCE_API_BASE_URL = "https://api.binance.me"
const receiveWindow = "5000"

axios.defaults.headers = {
    "X-MBX-APIKEY": process.env.API_KEY as string,
    "Content-Type": "application/x-www-form-urlencoded"
}

const accountAssetInformation = async () => {

    const API_URL = `${TOKOCRYPTO_API_BASE_URL}/open/v1/account/spot/asset`
    const params = new URLSearchParams({
        asset: 'ETH', //gave the values directly for testing
        timestamp: (new Date().getTime()).toString(),
        recvWindow: receiveWindow
    }).toString()

    const signature = crypto.createHmac("sha256", process.env.PRIVATE_KEY as string).update(params).digest("hex")

    try {
        const res = await axios.get(`${API_URL}?${params.toString()}&signature=${signature}`)
        console.log(res.data)
    } catch (e) {
        console.log(e.message)
    }
}

const newOrderBuy  = async (symbol: string, quantity: number) => {
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
        console.log(res.data)
        /** return example
        {
            code: 0,
            msg: 'Success',
            data: { orderId: 45114802, createTime: 1632405772814 },
            timestamp: 1632405772955
        }
         */
    } catch (e) {
        console.log(e.message)
    }

}

export {
    accountAssetInformation,
    newOrderBuy
}