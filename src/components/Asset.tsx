import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Paper,
  IconButton,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { centerTableTheme } from "../utils/MuiTheme";
import { convertNaNAndInf } from "../utils/processNumber";
import UserInfo from "../interfaces/UserInfo";
import StatObj from "../interfaces/StatObj";

interface AssetProps {
  apiInfo: { [key: string]: { [key: string]: number } };
  tickers: string[];
  userInfo: UserInfo;
  statistics: StatObj;
}

const Asset = ({ tickers, apiInfo, userInfo, statistics }: AssetProps) => {
  const displayMap: { [key: string]: (arg: string) => string } = {
    通貨: (ticker: string) => ticker,
    資産額: (ticker: string) =>
      convertNaNAndInf(apiInfo[ticker].assetValue, 3, "￥"),
    最新価格: (ticker: string) =>
      convertNaNAndInf(apiInfo[ticker].latestPrice, 5, "￥"),
    残平均購入額: (ticker: string) =>
      convertNaNAndInf(apiInfo[ticker].remainAverage, 5, "￥"),
    平均購入額: (ticker: string) =>
      convertNaNAndInf(apiInfo[ticker].buyAverage, 5, "￥"),
    平均売却額: (ticker: string) =>
      convertNaNAndInf(apiInfo[ticker].sellAverage, 5, "￥"),
    利益額: (ticker: string) =>
      convertNaNAndInf(apiInfo[ticker].total_balance, 5, "￥"),
    利益率: (ticker: string) =>
      convertNaNAndInf(apiInfo[ticker].ReturnsOnInvestment, 3, "", "%"),
  };

  return (
    <>
      <div>
        <h3>暗号通貨資産</h3>
        <ThemeProvider theme={centerTableTheme}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#B0D7D5" }}>
                <TableRow>
                  {Object.keys(displayMap).map((item, id) => (
                    <TableCell key={id}>{item}</TableCell>
                  ))}
                  <TableCell>詳細</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickers.map(
                  (ticker, id) =>
                    ticker !== "jpy" && (
                      <TableRow key={id}>
                        {Object.values(displayMap).map((value_func, id) => (
                          <TableCell key={id}>
                            {apiInfo[ticker] && value_func(ticker)}
                          </TableCell>
                        ))}
                        <TableCell>
                          <Link
                            to={"/detail"}
                            state={{
                              ticker,
                              apiInfo: apiInfo[ticker],
                              userInfo,
                              statistics: statistics[ticker],
                            }}
                          >
                            <IconButton>
                              <InfoOutlined />
                            </IconButton>
                          </Link>
                        </TableCell>
                      </TableRow>
                    )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </ThemeProvider>
      </div>
    </>
  );
};

export default Asset;
