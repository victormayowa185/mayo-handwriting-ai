import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OCR from "./pages/OCR";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ocr" element={<OCR />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
