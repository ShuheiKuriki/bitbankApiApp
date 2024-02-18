import "../../App.css";
import { Typography, Button, Stack, Dialog } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
// ユーティリティ
import {
  dbNames,
  addDbDocument,
  updDbDocument,
} from "../../utils/firebase/database";
import { auth } from "../../utils/firebase/authentication";
import { storage } from "../../utils/firebase/initialize";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  getTickerInfo,
  orderAndGetResult,
  getApiInfo,
} from "../../utils/bitbank";
import { calcAllStat, getUpdStat } from "../../utils/processCurrencyInfo";
import { convertNaNAndInf } from "../../utils/processNumber";
// コンポーネント
import Header from "../Header";
import DetailAsset from "./DetailAsset";
import TransactForm from "./TransactForm";
import TransactComplete from "./TransactComplete";
// インターフェース
import UserInfo from "../../interfaces/UserInfo";

interface DetailState {
  ticker: string;
  apiInfo: { [key: string]: number };
  userInfo: UserInfo;
  statistics: { [key: string]: any };
}

const Detail = () => {
  const location = useLocation();
  const { ticker, apiInfo, userInfo, statistics }: DetailState = location.state;
  const pair = ticker + "_jpy";
  const [isOpen, setIsOpen] = useState(false);
  const [tickerInfo, setTickerInfo] = useState(apiInfo);
  const [action, setAction] = useState<"buy" | "sell">("buy");
  const [transDetail, setTransDetail] = useState<{
    [key: string]: any;
  } | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [iconUrl, setIconUrl] = useState<string | undefined>(statistics.icon);
  const navigate = useNavigate();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/login");
    });
    // onAuthStateChangedからunSubscribe(クリーンアップ)用の関数が返ってくる
    return () => unSub();
  }, [navigate]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleTransaction = async (
    sellOrBuy: "buy" | "sell",
    tradeMoney: number,
    tradePrice: number
  ) => {
    const tradeAmount = tradeMoney / tradePrice;
    console.log("取引量:", tradeAmount);
    // 注文して約定情報を取得する
    const response = await orderAndGetResult(
      ticker,
      tradeAmount,
      sellOrBuy,
      userInfo
    );
    console.log(response);
    if (response === undefined) return;
    // transData：DB登録用、transDetail：画面表示用
    const { transData, transDetail } = response;
    await addDbDocument(dbNames.cryptoTransaction, transData);
    setTransDetail(transDetail);
    // 統計情報DB更新
    console.log("preStat:", statistics);
    const updStat = getUpdStat(statistics, transData, sellOrBuy);
    console.log("updStat:", updStat);
    await updDbDocument(dbNames.currencyStatistics, updStat);
    // apiInfoを取得
    const apiInfos = await getApiInfo(userInfo);
    calcAllStat([updStat], apiInfos);
    setTickerInfo(apiInfos[ticker]);
    console.log("取引後のtickerInfo:", apiInfos[ticker]);
  };

  const handleOpenPopup = async (action: "sell" | "buy") => {
    const response = await getTickerInfo(pair);
    console.log("ティッカー情報：", response.data.data);
    setTickerInfo({
      ...tickerInfo,
      latest: response.data.data.last,
      buyPrice: response.data.data.sell,
      sellPrice: response.data.data.buy,
    });
    setIsOpen(true);
    setAction(action);
  };

  const handleClosePopup = () => {
    setTransDetail(null);
    setIsOpen(false);
  };

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      console.log("画像", e.target.files?.[0]);
      setImage(e.target.files?.[0]);
    }
  };

  const updIcon = async () => {
    // 処理を記述していきます🤗
    if (image) {
      // 画像 + テキストの処理
      // firebaseの仕様で同じファイル名の画像を複数回アップしてしまうと元のファイルが削除される
      // そのためにファイル名をランダムに作成する必要があるのでランダムな文字列を作成
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; //ランダムな文字列を作るための候補62文字
      const N = 16;

      // 乱数を生成してくれるもので0からランダムな数字が16個選ばれる
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");

      const fileName = randomChar + "_" + image.name;
      console.log("fileName", fileName);
      const uploadImage = uploadBytesResumable(
        ref(storage, `images/${fileName}`),
        image
      );

      // 画像とテキストをfirestoreの方に送る記述
      uploadImage.on(
        "state_changed",
        () => {},
        (err) => {
          alert(err.message);
        },
        async () => {
          await getDownloadURL(ref(storage, `images/${fileName}`)).then(
            async (url) => {
              setIconUrl(url);
              updDbDocument(dbNames.currencyStatistics, {
                id: statistics.statId,
                data: {
                  userUid: userInfo.data.userUid,
                  ticker,
                  buyAmount: statistics.buyAmount,
                  buyMoney: statistics.buyMoney,
                  sellAmount: statistics.sellAmount,
                  sellMoney: statistics.sellMoney,
                  iconUrl: url,
                },
              });
            }
          );
        }
      );
    } else {
      alert("ファイルが選択されていません");
    }
  };

  return (
    <div className="main">
      <Header loggedIn={true} navigate={navigate} />
      <Stack
        spacing={5}
        style={{
          alignContent: "center",
          flexWrap: "wrap",
          margin: "50px 0",
        }}
      >
        <Typography variant="h3" style={{ display: "inline-block" }}>
          通貨：
          {iconUrl && (
            <img
              src={iconUrl}
              style={{
                height: "60px",
                objectFit: "cover",
                verticalAlign: "middle",
              }}
              alt="icon"
            />
          )}
          {ticker}
        </Typography>
        <Typography variant="h4">
          利益率：
          {convertNaNAndInf(tickerInfo.ReturnsOnInvestment, 5, "", "%")}
        </Typography>
        <DetailAsset tickerInfo={tickerInfo} />
        <Stack spacing={2} direction="row" justifyContent="center">
          <Button variant="contained" onClick={() => handleOpenPopup("buy")}>
            購入
          </Button>
          <Button variant="contained" onClick={() => handleOpenPopup("sell")}>
            売却
          </Button>
          <Button variant="contained" onClick={handleGoBack}>
            戻る
          </Button>
        </Stack>
        {/* iconアップロード */}
        <Stack spacing={2} direction="row" justifyContent="center">
          <input type="file" onChange={onChangeImageHandler} />
          <Button variant="contained" onClick={updIcon}>
            送信
          </Button>
        </Stack>
        {/* ポップアップ */}
        <Dialog open={isOpen} onClose={handleClosePopup}>
          {transDetail === null && (
            <TransactForm
              tradePrice={
                action === "buy" ? tickerInfo.buyPrice : tickerInfo.sellPrice
              }
              action={action}
              ticker={ticker}
              assetValue={tickerInfo.assetValue}
              handleClosePopup={handleClosePopup}
              handleTransaction={handleTransaction}
            />
          )}
          {transDetail !== null && (
            <TransactComplete
              action={action}
              transDetail={transDetail}
              handleClosePopup={handleClosePopup}
            />
          )}
        </Dialog>
      </Stack>
    </div>
  );
};

export default Detail;
