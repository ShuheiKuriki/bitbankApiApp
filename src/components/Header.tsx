import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { NavigateFunction } from "react-router-dom";
import { googleLogIn, googleLogOut } from "../utils/firebase/authentication";

interface HeaderProps {
  loggedIn: boolean;
  navigate?: NavigateFunction;
}

const Header = ({ loggedIn, navigate }: HeaderProps) => {
  // ログインしている場合はログアウトボタン、そうでなければログインボタンを表示
  const onClick =
    loggedIn && navigate ? () => googleLogOut(navigate) : googleLogIn;
  const buttonName = loggedIn && navigate ? "ログアウト" : "ログイン";
  return (
    <AppBar position="static" sx={{ backgroundColor: "#2A5772" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Bitbank補助ツール</Typography>
        <Button color="inherit" onClick={onClick}>
          <Typography variant="h6">{buttonName}</Typography>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
