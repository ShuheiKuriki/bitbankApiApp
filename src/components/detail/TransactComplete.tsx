import {
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import { convertNaNAndInf } from "../../utils/processNumber";

interface TransactCompleteProps {
  action: "sell" | "buy";
  transDetail: {
    [key: string]: any;
  };
  handleClosePopup: () => void;
}
const TransactComplete = ({
  action,
  transDetail,
  handleClosePopup,
}: TransactCompleteProps) => {
  const dispAct = { buy: "購入", sell: "売却" }[action];
  const { currency, orderId, amount, price, money, fee, date } = transDetail;
  const displayArray = [
    `注文ID：${orderId}`,
    `${dispAct}量：${convertNaNAndInf(amount, 5)}`,
    `${dispAct}価格：${convertNaNAndInf(price, 7, "￥")} / ${currency}`,
    `${dispAct}額：${convertNaNAndInf(money, 5, "￥")}`,
    `${dispAct}手数料：${convertNaNAndInf(fee, 5, "￥")}`,
    `${dispAct}日時：${date}`,
  ];
  return (
    <>
      <DialogTitle sx={{ fontSize: "24px", fontWeight: "bold" }}>
        {dispAct}が完了しました
      </DialogTitle>
      <DialogContent>
        <List>
          <List>
            {displayArray.map((text, index) => (
              <ListItem key={index}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClosePopup}>戻る</Button>
      </DialogActions>
    </>
  );
};

export default TransactComplete;
