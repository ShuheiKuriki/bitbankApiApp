import { useState, ChangeEvent } from "react";
import { Button } from "@mui/material";
import { processCSV } from "../utils/processCSV";
import CryptoTransaction from "../interfaces/CryptoTransaction";

interface AddHistoryProps {
  userUid: string;
  currentData: CryptoTransaction[];
}

const AddHistory = ({ userUid, currentData }: AddHistoryProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleImport = () => {
    if (selectedFile) {
      // 選択されたファイルを処理する関数を呼び出すなど、インポートの処理を行う
      console.log("ファイルをインポート:", selectedFile);
      const reader = new FileReader();
      reader.onload = async (event) => {
        await processCSV(event, userUid, currentData);
      };
      reader.readAsText(selectedFile);
    } else {
      alert("ファイルが選択されていません");
    }
  };

  return (
    <div>
      <h3>売買履歴CSVインポート</h3>
      <input type="file" onChange={handleFileSelect} />
      <Button onClick={handleImport} variant="contained">
        インポート
      </Button>
    </div>
  );
};

export default AddHistory;
