import {
  getAuth,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { NavigateFunction } from "react-router-dom";
import { firebaseApp } from "./initialize";

export const auth = getAuth(firebaseApp);

export const googleLogIn = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("ログイン成功result：", result);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const googleLogOut = async (navigate: NavigateFunction) => {
  try {
    await signOut(auth);
    navigate("/login");
  } catch (error: any) {
    alert(error.message);
  }
};
