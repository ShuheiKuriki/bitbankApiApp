import "./App.css";
import Success from "./components/Success";
import Login from "./components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Detail from "./components/detail/Detail";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Success />} />
          <Route path="/login" element={<Login />} />
          <Route path="/detail" element={<Detail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
