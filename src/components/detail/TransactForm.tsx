import { useState } from "react";
import {
  Typography,
  Button,
  Stack,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
} from "@mui/material";
import { convertNaNAndInf } from "../../utils/processNumber";

interface TransactFormProps {
  tradePrice: number;
  action: "buy" | "sell";
  ticker: string;
  assetValue: number;
  handleClosePopup: () => void;
  handleTransaction: (
    buyOrSell: "buy" | "sell",
    tradeMoney: number,
    tradePrice: number
  ) => void;
}

const TransactForm = ({
  tradePrice,
  action,
  ticker,
  assetValue,
  handleClosePopup,
  handleTransaction,
}: TransactFormProps) => {
  const [tradeMoney, setTradeMoney] = useState(1000);
  const handleMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value);
    if (isNaN(v) || v < 0 || v > assetValue) return;
    setTradeMoney(v);
  };
  const dispAct = { buy: "購入", sell: "売却" }[action];
  return (
    <>
      <DialogTitle sx={{ fontSize: "24px", fontWeight: "bold" }}>
        {dispAct}フォーム
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography>
            {dispAct}価格：{convertNaNAndInf(tradePrice, 7, "￥")} / {ticker}
          </Typography>
          <TextField
            label={`${dispAct}金額`}
            type="number"
            value={tradeMoney}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">¥</InputAdornment>
              ),
            }}
            onChange={handleMoneyChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClosePopup}>キャンセル</Button>
        <Button
          onClick={() => handleTransaction(action, tradeMoney, tradePrice)}
        >
          {dispAct}
        </Button>
      </DialogActions>
    </>
  );
};

export default TransactForm;
