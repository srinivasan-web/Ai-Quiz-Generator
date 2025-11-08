import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import { ToastContainer } from "react-toastify";
import HistoryPage from "./pages/HistoryPage";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz/:id" element={<QuizPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <ToastContainer
          position="top-right"
          autoClose={3000} // closes after 3 seconds
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
