interface StatObj {
  [ticker: string]: {
    statId: string;
    buyAmount: number;
    sellAmount: number;
    buyMoney: number;
    sellMoney: number;
    iconUrl: string | null;
  };
}

export default StatObj;
