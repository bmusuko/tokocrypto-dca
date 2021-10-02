enum OrderTypes {
    LIMIT = "1",
    MARKET = "2",
    STOP_LOSS = "3",
    STOP_LOSS_LIMIT = "4",
    TAKE_PROFIT = "5",
    TAKE_PROFIT_LIMIT = "6",
    LIMIT_MAKER = "7"
}

enum OrderSide {
    BUY = "0",
    SELL = "1" 
}

enum OrderHistoryTypes {
    OPEN = "1",
    HISTORY = "2",
    ALL = "-1" 
}

enum OrderHistoryDirectionTypes {
    PREVIOUS = "prev",
    NEXT = "next",
}

interface OrderBuyReturn {
    code: number,
    msg: string,
    data: {
        orderId: number,
        createTime: number
    },
    timestamp: number
}

interface GetBalanceReturn {
    code: number,
    msg: string,
    data: {
        asset: string,
        free: number,
        locked: number
    }
}

interface TickerPriceReturn {
    symbol: string,
    price: number
}

interface OrderGetReturn {
    code: number,
    msg: string,
    data: {
        list: OrderGetListItem[]
    },
    timestamp: number
}

interface OrderGetListItem {
    orderId: number,
    symbol: string,
    symbolType: number,
    side: number,
    type: number,
    price: number,
    origQty: number,
    origQuoteQty: number,
    executedQty: number,
    executedPrice: number,
    executedQuoteQty: number,
    timeInForce: number,
    stopPrice: number,
    icebergQty: number,
    status: number,
    createTime: number,
    clientId: string
}

export {
    OrderTypes, OrderSide, OrderBuyReturn, 
    GetBalanceReturn, TickerPriceReturn, OrderHistoryTypes, 
    OrderHistoryDirectionTypes, OrderGetReturn, OrderGetListItem
}