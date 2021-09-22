import axios from "axios"
import dotenv from "dotenv";
import crypto from "crypto"

dotenv.config()

const TOKOCRYPTO_API_BASE_URL = "https://www.tokocrypto.com"
// const BINANCE_API_BASE_URL = "https://api.binance.me"

axios.defaults.headers = {
    "X-MBX-APIKEY": process.env.API_KEY as string,
    "Content-Type": "application/x-www-form-urlencoded"
}

const accountAssetInformation = async () => {

    const API_URL = `${TOKOCRYPTO_API_BASE_URL}/open/v1/account/spot/asset`
    const params = new URLSearchParams({
        asset: 'ETH', //gave the values directly for testing
        timestamp: (new Date().getTime()).toString(),
        recvWindow: '5000'
    }).toString()

    const signature = crypto.createHmac("sha256", process.env.PRIVATE_KEY as string).update(params).digest("hex")

    try {
        const res = await axios.get(`${API_URL}?${params.toString()}&signature=${signature}`)
        console.log(res.data)
    } catch (e) {
        console.log(e.message)
    }
}

export {
    accountAssetInformation
}