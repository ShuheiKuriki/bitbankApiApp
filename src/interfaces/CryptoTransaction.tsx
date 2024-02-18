interface CryptoTransaction {
  id: string;
  data: {
    userUid: string;
    orderId: number;
    currency: string;
    sellOrBuy: string;
    amount: number;
    price: number;
    money: number;
    date: string;
  };
}

export default CryptoTransaction;
