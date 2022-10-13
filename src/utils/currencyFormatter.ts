import dotenv from "dotenv";
dotenv.config()

const formatCurrency = (num: number): string => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: process.env.CURRENCY as string,
      });

    return formatter.format(num)
}

export { formatCurrency }