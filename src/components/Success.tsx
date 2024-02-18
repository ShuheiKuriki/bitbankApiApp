import "../App.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
// ユーティリティ
import { getApiInfo } from "../utils/bitbank";
import {
  onCurrencyStatChanged,
  onUserInfoChanged,
  addDbDocument,
  dbNames,
} from "../utils/firebase/database";
import { auth } from "../utils/firebase/authentication";
import {
  getSortedTickers,
  getStatObjFromStatArray,
  calcAllStat,
} from "../utils/processCurrencyInfo";
// インターフェース
import CurrencyStat from "../interfaces/CurrencyStat";
import UserInfo from "../interfaces/UserInfo";
import StatObj from "../interfaces/StatObj";
// コンポーネント
import Header from "./Header";
import Summary from "./Summary";
import Asset from "./Asset";
// import AddHistory from "./AddHistory";
// import Work from "./Work";

const Success = () => {
  // APIから取得する資産情報とチャート情報
  const [apiInfo, setApiInfo] = useState<{
    [key: string]: { [key: string]: number };
  } | null>(null);
  const [tickers, setTickers] = useState<string[]>([]);
  // DBから取得する統計情報配列で、取得完了判定のため初期値をnullとする
  const [statArray, setStatArray] = useState<CurrencyStat[] | null>(null);
  // DB取得値から再構成した統計情報オブジェクト
  const [statObj, setStatObj] = useState<StatObj>({});
  // ユーザ情報
  const [userUid, setUserUid] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  // 認証エラーを検知
  const [isError, setIsError] = useState<boolean>(false);

  const navigate = useNavigate();

  // ログイン制御 & userUid設定
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/login");
      setUserUid(user ? user.uid : null);
    });
    return () => unSub(); // onAuthStateChangedの返り値として、unSubscribe用の関数が返る
  }, [navigate]);

  // currencyStatistics(firebaseDB)のデータをstatArrayにリアルタイム反映
  useEffect(() => {
    if (userUid) {
      const unSub = onCurrencyStatChanged(setStatArray, userUid);
      return () => unSub();
    }
  }, [userUid]);

  // userInfo(firebaseDB)のデータをuserInfoにリアルタイム反映
  useEffect(() => {
    if (userUid) {
      const unSub = onUserInfoChanged(setUserInfo, userUid);
      return () => unSub();
    }
  }, [userUid]);

  // DBから取得したstatArrayとAPIから取得した情報を総合し、tickers・apiInfo・statObjを取得
  useEffect(() => {
    const fetchInfos = async () => {
      if (userInfo && userUid && statArray !== null) {
        try {
          // apiInfoを取得
          const _apiInfo = await getApiInfo(userInfo);
          // apiInfoからticker配列を取得
          const tickers = getSortedTickers(_apiInfo);
          setTickers(tickers);
          console.log("tickers:", tickers);
          // statArrayをObjectに変換して取得
          const statObject = getStatObjFromStatArray(statArray);
          console.log("statObject:", statObject);
          setStatObj(statObject);
          // _apiInfoに統計情報を追加する
          calcAllStat(statArray, _apiInfo);
          console.log("apiInfo:", _apiInfo);
          setApiInfo(_apiInfo);
          // 統計情報がないtickerがあれば、初期化する
          tickers.forEach((ticker) => {
            if (statObject[ticker] === undefined) {
              addDbDocument(dbNames.currencyStatistics, {
                userUid,
                ticker,
                buyAmount: 0,
                buyMoney: 0,
                sellAmount: 0,
                sellMoney: 0,
              });
            }
          });
        } catch (error) {
          console.error(error);
          setIsError(true);
        }
      }
    };
    fetchInfos();
  }, [userInfo, statArray]);

  return (
    <div className="main">
      <Header loggedIn={true} navigate={navigate} />
      {userUid && userInfo && apiInfo && statArray && !isError && (
        <div className="container">
          <Summary apiInfo={apiInfo} />
          <Asset
            tickers={tickers}
            apiInfo={apiInfo}
            userInfo={userInfo}
            statistics={statObj}
          />
          {/* <AddHistory userUid={userUid} currentData={cryptoTransaction} /> */}
          {/* <Work
            userUid={userUid}
            tickers={tickers}
            currentStatObj={statObj}
            statArray={statArray}
          /> */}
        </div>
      )}
      {isError && (
        <h2>API通信エラーが発生しました。再読み込みしてください。</h2>
      )}
    </div>
  );
};

export default Success;
