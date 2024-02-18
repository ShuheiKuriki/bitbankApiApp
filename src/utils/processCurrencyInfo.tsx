import CurrencyStat from "../interfaces/CurrencyStat";
import StatObj from "../interfaces/StatObj";
import CryptoTransaction from "../interfaces/CryptoTransaction";

/**
 * ソートされたtickerを取得する関数
 * @param _apiInfo - APIから取得したticker情報
 * @returns ソートされたtickerの配列
 */
export const getSortedTickers = (_apiInfo: {
  [key: string]: { [key: string]: number };
}) => {
  return Object.keys(_apiInfo).sort((a: string, b: string) => {
    const a_v = _apiInfo[a] && _apiInfo[a].assetValue;
    const b_v = _apiInfo[b] && _apiInfo[b].assetValue;
    return a_v === b_v ? 0 : a_v < b_v ? 1 : -1;
  });
};

/**
 * DBから取得した統計情報の配列をオブジェクトに変換する関数
 * @param statArray - CurrencyStatの配列
 * @returns StatObj
 */
export const getStatObjFromStatArray = (statArray: CurrencyStat[]): StatObj => {
  const statObject: StatObj = {};
  statArray.forEach((stat) => {
    statObject[stat.data.ticker] = {
      statId: stat.id,
      buyAmount: stat.data.buyAmount,
      buyMoney: stat.data.buyMoney,
      sellAmount: stat.data.sellAmount,
      sellMoney: stat.data.sellMoney,
      iconUrl: stat.data.iconUrl,
    };
  });
  return statObject;
};

/**
 * 取引履歴からStatObjを計算する関数
 * @param tickers - tickerの配列
 * @param cryptoTransaction - 取引履歴の配列
 * @returns StatObj
 */
export const getStatObjFromHistory = (
  tickers: string[],
  cryptoTransaction: CryptoTransaction[]
) => {
  // statObjを初期化する
  const statObj: { [key: string]: { [key: string]: any } } = {};
  tickers.forEach((ticker) => {
    statObj[ticker] = {
      buyAmount: 0,
      buyMoney: 0,
      sellAmount: 0,
      sellMoney: 0,
    };
  });
  // 取引履歴を元に統計情報を集計する
  cryptoTransaction.forEach((trans) => {
    const { currency: ticker, sellOrBuy, amount, money } = trans.data;
    if (sellOrBuy === "buy") {
      statObj[ticker].buyAmount += Number(amount);
      statObj[ticker].buyMoney += Number(money);
    } else {
      statObj[ticker].sellAmount += Number(amount);
      statObj[ticker].sellMoney += Number(money);
    }
  });
  return statObj;
};

/**
 * StatArrayと_apiInfoから全ての統計情報を計算する関数です。
 * @param statArray - DBから取得したCurrencyStatの配列
 * @param _apiInfo - APIから取得した情報
 */
export const calcAllStat = (
  statArray: CurrencyStat[],
  _apiInfo: {
    [key: string]: { [key: string]: number };
  }
) => {
  statArray.forEach((stat) => {
    const { ticker, buyAmount, buyMoney, sellAmount, sellMoney } = stat.data;
    _apiInfo[ticker] = {
      ..._apiInfo[ticker],
      buyAmount,
      buyMoney,
      sellAmount,
      sellMoney,
      remainAmount: buyAmount - sellAmount,
      totalInputMoney: buyMoney - sellMoney,
      buyAverage: buyMoney / buyAmount,
      sellAverage: sellMoney / sellAmount,
    };
    const { remainAmount, totalInputMoney, assetValue } = _apiInfo[ticker];
    _apiInfo[ticker].remainAverage =
      Number(remainAmount.toFixed(5)) !== 0
        ? totalInputMoney / remainAmount
        : 0;
    _apiInfo[ticker].total_balance = assetValue - totalInputMoney;
    _apiInfo[ticker].ReturnsOnInvestment =
      ((assetValue - totalInputMoney) / buyMoney) * 100;
  });
};

export const getUpdStat = (
  preStat: { [key: string]: any },
  transData: CryptoTransaction["data"],
  sellOrBuy: "sell" | "buy"
) => {
  const updStat = {
    id: preStat.statId,
    data: {
      userUid: transData.userUid,
      ticker: transData.currency,
      buyAmount: preStat.buyAmount,
      buyMoney: preStat.buyMoney,
      sellAmount: preStat.sellAmount,
      sellMoney: preStat.sellMoney,
      iconUrl: preStat.iconUrl ? preStat.iconUrl : null,
    },
  };
  if (sellOrBuy === "buy") {
    updStat.data.buyAmount += transData.amount;
    updStat.data.buyMoney += transData.money;
  } else {
    updStat.data.sellAmount += transData.amount;
    updStat.data.sellMoney += transData.money;
  }
  return updStat;
};
