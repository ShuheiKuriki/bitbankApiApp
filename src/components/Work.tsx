import { useState, useEffect } from "react";
import {
  dbNames,
  addDbDocument,
  // delDbDocument,
  onCryptoTransactionChanged,
} from "../utils/firebase/database";
import { getStatObjFromHistory } from "../utils/processCurrencyInfo";
import CryptoTransaction from "../interfaces/CryptoTransaction";
import CurrencyStat from "../interfaces/CurrencyStat";

interface WorkProps {
  userUid: string;
  tickers: string[];
  currentStatObj: { [key: string]: { [key: string]: any } };
  statArray: CurrencyStat[];
}

const Work = ({ userUid, tickers, currentStatObj, statArray }: WorkProps) => {
  const [cryptoTransaction, setCryptoTransaction] = useState<
    CryptoTransaction[]
  >([]);

  // firebaseDBからcryptoTransactionのデータをリアルタイム反映
  useEffect(() => {
    if (userUid) {
      const unSubscribe = onCryptoTransactionChanged(
        setCryptoTransaction,
        userUid
      );
      return () => unSubscribe();
    }
  }, [userUid]);
  console.log("履歴件数:", cryptoTransaction.length);

  // 統計情報の削除
  useEffect(() => {
    statArray?.forEach((trans) => {
      console.log(trans.data);
      // delDbDocument(dbNames.currencyStatistics, trans.id);
    });
  }, [statArray]);

  // 統計情報を履歴から再計算して更新
  useEffect(() => {
    // 統計情報オブジェクトを取引履歴を元に集計する
    const newStatObj = getStatObjFromHistory(tickers, cryptoTransaction);
    console.log(newStatObj);
    if (userUid) {
      tickers.forEach((ticker) => {
        // 統計情報がDBにないティッカーについて、取引履歴から計算した統計情報をDBに登録する
        if (currentStatObj[ticker].length == 0) {
          addDbDocument(dbNames.currencyStatistics, {
            userUid,
            ticker,
            buyAmount: newStatObj[ticker].buyAmount,
            buyMoney: newStatObj[ticker].buyMoney,
            sellAmount: newStatObj[ticker].sellAmount,
            sellMoney: newStatObj[ticker].sellMoney,
          });
        }
      });
    }
  }, [tickers]);

  return <></>;
};

export default Work;
