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

interface OrderBuyReturn {
    code: Number,
    msg: string,
    data: {
        orderId: number,
        createTime: number
    },
    timestamp: Number
}

export {OrderTypes, OrderSide, OrderBuyReturn}