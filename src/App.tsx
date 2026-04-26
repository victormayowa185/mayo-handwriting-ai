import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OCR from "./pages/OCR";
import Nav from "./components/Navbar"; // adjust path if yours is different
import Footer from "./components/Footer"; // adjust path if yours is different
import "./App.css"; // your global styles (Mulish, colors, etc.)

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
