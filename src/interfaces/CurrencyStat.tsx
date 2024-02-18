interface CurrencyStat {
  id: string;
  data: {
    userUid: string;
    ticker: string;
    buyAmount: number;
    sellAmount: number;
    buyMoney: number;
    sellMoney: number;
    iconUrl: string | null;
  };
}

export default CurrencyStat;
