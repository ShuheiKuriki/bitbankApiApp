import "../../App.css";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  Box,
} from "@mui/material";
import { convertNaNAndInf } from "../../utils/processNumber";

interface DetailAssetProps {
  tickerInfo: { [key: string]: any };
}

const DetailAsset = ({ tickerInfo }: DetailAssetProps) => {
  const displayMaps: { [key: string]: string }[] = [
    {
      最新取引価格: convertNaNAndInf(tickerInfo.latestPrice, 7, "￥"),
      残平均購入額: convertNaNAndInf(tickerInfo.remainAverage, 5, "￥"),
      平均購入額: convertNaNAndInf(tickerInfo.buyAverage, 5, "￥"),
      平均売却額: convertNaNAndInf(tickerInfo.sellAverage, 5, "￥"),
    },
    {
      購入額: convertNaNAndInf(tickerInfo.buyMoney, 5, "￥"),
      売却額: convertNaNAndInf(tickerInfo.sellMoney, 5, "￥"),
      資産額: convertNaNAndInf(tickerInfo.assetValue, 5, "￥"),
      利益額: convertNaNAndInf(tickerInfo.total_balance, 5, "￥"),
    },
    {
      購入数量: convertNaNAndInf(tickerInfo.buyAmount, 5),
      売却数量: convertNaNAndInf(tickerInfo.sellAmount, 5),
      保有数量: convertNaNAndInf(tickerInfo.amount, 5),
      誤差数量: convertNaNAndInf(
        tickerInfo.amount - (tickerInfo.buyAmount - tickerInfo.sellAmount),
        5
      ),
    },
  ];

  return (
    <>
      {displayMaps.map((displayMap, index) => (
        <Box key={index} sx={{ maxWidth: "700px" }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead style={{ backgroundColor: "lightblue" }}>
                <TableRow>
                  {Object.keys(displayMap).map((key, index) => (
                    <TableCell key={index} align="center">
                      {key}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {Object.values(displayMap).map((value, index) => (
                    <TableCell key={index} align="center">
                      {value}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </>
  );
};

export default DetailAsset;
