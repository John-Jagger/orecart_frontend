import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import News from "./pages/News";

function App() {
  return (
    <Router>
      <nav>
        {/* Simple nav bar */}
        <Link to="/">Home</Link> |{" "}
        <Link to="/news">News</Link> |{" "}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
      </Routes>
    </Router>
  );
}

export default App;