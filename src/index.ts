import dotenv from "dotenv";
import {accountAssetInformation} from './services/tokocryptoService'

const main = async() => {
    dotenv.config()
    accountAssetInformation()
}

main()