import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase/authentication";
import Header from "./Header";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/");
    });
    return () => unSub();
  }, [navigate]);

  return (
    <div>
      <Header loggedIn={false} />
    </div>
  );
};

export default Login;
