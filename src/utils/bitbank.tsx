// import axios from "axios";
import { HmacSHA256, enc } from "crypto-js";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import dayjs from "dayjs";
import UserInfo from "../interfaces/UserInfo";

const PUBLIC_URL = "https://public.bitbank.cc";
const PRIVATE_URL = "https://api.bitbank.cc";

export const getHeaders = (msg: string, userInfo: UserInfo) => {
  // UNIXタイムスタンプからナンスを作成
  const date = new Date();
  const nonce = Math.floor(date.getTime() / 1000).toString();
  // 著名を作成
  const concatStr = nonce + msg;
  const accessSecret = userInfo.data.accessSecret;
  const signature = HmacSHA256(concatStr, accessSecret).toString(enc.Hex);
  // ヘッダー情報を設定
  const headers = {
    "Content-Type": "application/json",
    "ACCESS-KEY": userInfo.data.accessKey,
    "ACCESS-NONCE": nonce,
    "ACCESS-SIGNATURE": signature,
  };
  return headers;
};

/**
 * 暗号通貨のTicker情報を取得します。
 *
 * @param pair - 取得するTicker情報の対象となるペア。例: "BTC/ETH"
 * @returns Ticker情報のレスポンスデータ
 */
export const getTickerInfo = async (pair: string) => {
  return await axios.get(`${PUBLIC_URL}/${pair}/ticker`);
};

/**
 * 指定したティッカーリストのチャート情報を全て取得します。
 * @param tickers 取得するチャート情報のティッカーの配列
 * @returns ティッカーごとの通貨と最新取引価格のオブジェクトの配列
 */
const getCharts = async (tickers: string[]) => {
  const promises = tickers.map(async (ticker: string) => {
    let latestPrice = 1;
    let sellPrice = 1;
    let buyPrice = 1;
    if (ticker !== "jpy") {
      const pair = ticker + "_jpy";
      // ティッカー情報取得
      const response = await getTickerInfo(pair);
      // 最新取引価格取得
      latestPrice = Number(response.data.data.last);
      sellPrice = Number(response.data.data.buy);
      buyPrice = Number(response.data.data.sell);
    }
    return { ticker, latestPrice, sellPrice, buyPrice };
  });
  return await Promise.all(promises);
};

/**
 * 指定されたユーザーの資産情報を取得します。
 * @param userInfo ユーザー情報オブジェクト
 * @returns 資産情報
 */
const getMyAsset = async (userInfo: UserInfo) => {
  const path = "/v1/user/assets";
  // オプションを設定
  const options = {
    headers: getHeaders(path, userInfo),
  };
  // 資産情報取得
  const response: AxiosResponse<any> = await axios
    .get(PRIVATE_URL + path, options)
    .catch((error) => {
      console.log(error);
      throw error;
    });
  if (response.data.success === 0) {
    throw new Error("認証エラー:" + response.data.data.code);
  }
  const my_assets = response.data.data.assets;
  return my_assets;
};

/**
 * 指定されたユーザーの資産情報とチャートの情報を合体して返します
 * @param userInfo ユーザー情報オブジェクト
 * @returns APIから取得した総情報
 */
export const getApiInfo = async (userInfo: UserInfo) => {
  const apiInfo: { [key: string]: { [key: string]: number } } = {};
  await getMyAsset(userInfo).then((detailAssets) => {
    return (
      detailAssets &&
      detailAssets.forEach((detail: { [key: string]: any }) => {
        apiInfo[detail.asset] = { amount: Number(detail.onhand_amount) };
      })
    );
  });
  const currencies = Object.keys(apiInfo);
  await getCharts(currencies)
    .then((charts) =>
      charts.forEach(({ ticker, latestPrice, sellPrice, buyPrice }) => {
        apiInfo[ticker] = {
          ...apiInfo[ticker],
          latestPrice,
          sellPrice,
          buyPrice,
          assetValue: latestPrice * apiInfo[ticker].amount,
        };
      })
    )
    .catch((error) => {
      console.error(error);
    });
  return apiInfo;
};

/**
 * 指定されたペアで売買注文をします。
 * @param pair トレードするペア（例: 'btc_jpy'）
 * @param amount 注文数量
 * @param side 注文サイド（"buy"または"sell"）
 * @param userInfo ユーザー情報オブジェクト
 * @returns 注文情報のレスポンス
 */
export const placeOrder = async (
  pair: string,
  amount: number,
  side: "buy" | "sell",
  userInfo: UserInfo
) => {
  try {
    const path = "/v1/user/spot/order";
    const method = "POST";
    const type = "market";
    const body = { pair, amount, side, type };
    const config: AxiosRequestConfig = {
      method,
      url: PRIVATE_URL + path,
      headers: getHeaders(JSON.stringify(body), userInfo),
      data: body,
    };
    const response = await axios(config);
    console.log("注文情報:", response.data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

/**
 * 指定された注文IDの約定履歴を取得します。
 * @param pair トレードしたペア（例: 'btc_jpy'）
 * @param orderId 注文ID
 * @returns 約定履歴のレスポンス
 */
export const getTradeHistory = async (
  pair: string,
  orderId: number,
  userInfo: UserInfo
) => {
  try {
    const path = `/v1/user/spot/trade_history?pair=${pair}&order_id=${orderId}`;
    const method = "GET";
    const config: AxiosRequestConfig = {
      method,
      url: PRIVATE_URL + path,
      headers: getHeaders(path, userInfo),
    };
    const response = await axios(config);
    console.log("約定情報:", response.data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const orderAndGetResult = async (
  ticker: string,
  tradeAmount: number,
  sellOrBuy: "buy" | "sell",
  userInfo: UserInfo
) => {
  const pair = ticker + "_jpy";
  const orderRes = await placeOrder(pair, tradeAmount, sellOrBuy, userInfo);
  if (!orderRes) return;
  const { order_id } = orderRes.data.data;
  const tradeRes: AxiosResponse<any, any> | undefined = await new Promise(
    (resolve) => {
      setTimeout(async () => {
        const result = await getTradeHistory(pair, order_id, userInfo);
        resolve(result);
      }, 2000);
    }
  );
  const { executed_at, fee_amount_quote, price } =
    tradeRes?.data.data.trades[0];
  const transData = {
    userUid: userInfo.data.userUid,
    orderId: order_id,
    currency: ticker,
    sellOrBuy,
    amount: tradeAmount,
    price,
    money: Number(price) * tradeAmount + Number(fee_amount_quote),
    date: dayjs(executed_at).format("YYYY/MM/DD HH:mm:ss"),
  };
  const transDetail = {
    ...transData,
    money: Number(price) * tradeAmount,
    fee: Number(fee_amount_quote),
  };
  return { transData, transDetail };
};
