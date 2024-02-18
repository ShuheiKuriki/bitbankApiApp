import { dbNames, addDbDocument } from "./firebase/database";
import CryptoTransaction from "../interfaces/CryptoTransaction";

export const processCSV = async (
  event: ProgressEvent<FileReader>,
  userUid: string,
  currentData: CryptoTransaction[]
) => {
  const text = event.target?.result as string;
  const rows = text.split(/\r?\n/);
  const headers = rows[0].split(",");
  console.log(headers);
  let import_cnt = 0;
  let exist_cnt = 0;
  let invalid_cnt = 0;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].split(",");
    // TODO：もっと厳密なvalidation
    if (row.length < headers.length) {
      invalid_cnt++;
      continue;
    }
    console.log(row);
    let orderId = 0;
    let currency = "";
    let sellOrBuy = "";
    let amount = 0;
    let price = 0;
    let date = "";

    for (let j = 0; j < headers.length; j++) {
      switch (headers[j]) {
        case "注文ID":
          orderId = Number(row[j]);
          break;
        case "通貨":
          currency = row[j];
          break;
        case "売/買":
          sellOrBuy = row[j];
          break;
        case "数量":
          amount = Number(row[j]);
          break;
        case "指値価格":
          price = Number(row[j]);
          break;
        case "売買日時":
          date = row[j];
          break;
      }
    }
    if (
      currentData
        .map((data: CryptoTransaction) => data.data.orderId)
        .includes(orderId)
    ) {
      exist_cnt++;
      continue;
    }
    import_cnt++;
    await addDbDocument(dbNames.cryptoTransaction, {
      userUid,
      orderId,
      currency,
      sellOrBuy,
      amount,
      price,
      money: amount * price,
      date,
    });
  }
  alert(
    `インポートが完了しました。\n\nインポートデータ：${import_cnt}件\n重複データ：${exist_cnt}件\n不正データ：${invalid_cnt}件`
  );
};
