import {
  getFirestore,
  collection,
  addDoc,
  query,
  onSnapshot,
  QueryDocumentSnapshot,
  DocumentData,
  where,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { firebaseApp } from "./initialize";

export enum dbNames {
  cryptoTransaction = "cryptoTransaction",
  currencyStatistics = "currencyStatistics",
  userInfo = "userInfo",
}

const db = getFirestore(firebaseApp);

// --- Databaseに対するCRUD処理 ------------------------------------
export const addDbDocument = async (
  dbName: string,
  addData: { [key: string]: any }
) => {
  await addDoc(collection(db, dbName), { ...addData });
};

export const updDbDocument = async (
  dbName: string,
  {
    id: updId,
    data: updData,
  }: {
    id: string;
    data: { [key: string]: any };
  }
) => {
  await setDoc(doc(collection(db, dbName), updId), updData, { merge: true });
};

export const delDbDocument = async (dbName: string, delId: string) => {
  await deleteDoc(doc(collection(db, dbName), delId));
};

// ---- snapshotの変化を検知して状態を更新する処理 --------------------
import CryptoTransaction from "../../interfaces/CryptoTransaction";
import CurrencyStat from "../../interfaces/CurrencyStat";
import UserInfo from "../../interfaces/UserInfo";

export const onCryptoTransactionChanged = (
  setCryptoTransaction: (
    value: React.SetStateAction<CryptoTransaction[]>
  ) => void,
  userUid: string
) => {
  const q = query(
    collection(db, dbNames.cryptoTransaction),
    where("userUid", "==", userUid)
  );
  return onSnapshot(q, (snap) => {
    setCryptoTransaction(
      snap.docs.map(
        (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => ({
          id: doc.id,
          data: {
            userUid: doc.data().userUid,
            orderId: doc.data().orderId,
            currency: doc.data().currency,
            sellOrBuy: doc.data().sellOrBuy,
            amount: doc.data().amount,
            price: doc.data().price,
            money: doc.data().money,
            date: doc.data().date,
          },
        })
      )
    );
  });
};

export const onCurrencyStatChanged = (
  setCurrencyStat: (value: React.SetStateAction<CurrencyStat[] | null>) => void,
  userUid: string
) => {
  const q = query(
    collection(db, dbNames.currencyStatistics),
    where("userUid", "==", userUid)
  );
  return onSnapshot(q, (snap) => {
    setCurrencyStat(
      snap.docs.map(
        (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => ({
          id: doc.id,
          data: {
            userUid: doc.data().userUid,
            ticker: doc.data().ticker,
            buyAmount: doc.data().buyAmount,
            sellAmount: doc.data().sellAmount,
            buyMoney: doc.data().buyMoney,
            sellMoney: doc.data().sellMoney,
            iconUrl: doc.data().iconUrl,
          },
        })
      )
    );
  });
};

export const onUserInfoChanged = (
  setUserInfo: (value: React.SetStateAction<UserInfo | null>) => void,
  userUid: string
) => {
  const q = query(
    collection(db, dbNames.userInfo),
    where("userUid", "==", userUid)
  );
  return onSnapshot(q, (snap) => {
    if (snap.docs.length === 0) return;
    const doc = snap.docs[0];
    setUserInfo({
      id: doc.id,
      data: {
        userUid: doc.data().userUid,
        accessKey: doc.data().accessKey,
        accessSecret: doc.data().accessSecret,
      },
    });
  });
};
