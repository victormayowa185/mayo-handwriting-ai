import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>MAYO Handwriting AI</h1>
      <p>Convert your handwriting to digital text instantly.</p>
      <Link to="/ocr">Try it now →</Link>
    </div>
  );
};

export default Home;
