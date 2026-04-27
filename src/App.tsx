import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OCR from "./pages/OCR";
import Nav from "./components/Navbar";
import Footer from "./components/Footer"; 
import Contact from "./pages/Contact"
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ocr" element={<OCR />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
