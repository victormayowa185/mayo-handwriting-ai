import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OCR from "./pages/OCR";
import Nav from "./components/Navbar";
import Footer from "./components/Footer"; 
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ocr" element={<OCR />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
