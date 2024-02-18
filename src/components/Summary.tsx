import { Paper, Typography, Grid } from "@mui/material";
import { convertNaNAndInf } from "../utils/processNumber";

interface SummaryProps {
  apiInfo: { [key: string]: { [key: string]: number } };
}

const Summary = ({ apiInfo }: SummaryProps) => {
  const total = Object.values(apiInfo).reduce(
    (acc, data) => acc + (data ? data.assetValue : 0),
    0
  );
  const fiat = apiInfo["jpy"] && apiInfo["jpy"].assetValue;
  const fiat_num = 1;
  const crypto = total - fiat;
  const crypto_num = Object.keys(apiInfo).length - fiat_num;
  const total_buyMoney = Object.values(apiInfo).reduce(
    (acc, value) => acc + value.buyMoney,
    0
  );
  const totalInputMoney = Object.values(apiInfo).reduce(
    (acc, value) => acc + value.totalInputMoney,
    0
  );
  const total_balance = crypto - totalInputMoney;
  const ReturnsOnInvestment = (total_balance / total_buyMoney) * 100;
  return (
    <>
      <Paper
        sx={{
          maxWidth: "1000px",
          padding: "20px",
          border: "1px solid #B0D7D5",
        }}
      >
        <Typography variant="h5">残高</Typography>
        <Typography variant="h4" gutterBottom>
          ¥{total.toFixed(0)}
        </Typography>
        <Grid container>
          <Grid item xs={3} sm={3}>
            <Typography>法定通貨({fiat_num}種)</Typography>
          </Grid>
          <Grid item xs={3} sm={3}>
            <Typography>暗号通貨({crypto_num}種)</Typography>
          </Grid>
          <Grid item xs={3} sm={3}>
            <Typography>利益額</Typography>
          </Grid>
          <Grid item xs={3} sm={3}>
            <Typography>利益率</Typography>
          </Grid>
          <Grid item xs={3} sm={3}>
            <Typography>¥{fiat?.toFixed(0)}</Typography>
          </Grid>
          <Grid item xs={3} sm={3}>
            <Typography>¥{crypto?.toFixed(0)}</Typography>
          </Grid>
          <Grid item xs={3} sm={3}>
            <Typography>{convertNaNAndInf(total_balance, 3, "￥")}</Typography>
          </Grid>
          <Grid item xs={3} sm={3}>
            <Typography>
              {convertNaNAndInf(ReturnsOnInvestment, 4, "", "%")}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default Summary;
