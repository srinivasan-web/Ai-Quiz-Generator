import { useEffect, useState } from "react";
import { getHistory } from "../api";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import "./index.css";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);

  const [loaderType, setLoaderType] = useState("pacman");
  useEffect(() => {
    getHistory().then(setHistory).catch(console.error);
  }, []);

  return (
    <div className="history-container">
      <Navbar />

      <h1 className="history-title">📜 Quiz History</h1>

      {history.length === 0 ? (
        <Loader
          message="Scraping Wikipedia and Generating Quiz Using AI... "
          time="This may take 10-30 seconds"
          type={loaderType}
        />
      ) : (
        <div className="table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>URL</th>
                <th>Date Generated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="table-row">
                  <td>{item.id}</td>
                  <td className="quiz-link">{item.title}</td>
                  <td className="url-cell">{item.url}</td>
                  <td>{new Date(item.date_generated).toLocaleString()}</td>
                  <td>
                    <Link to={`/quiz/${item.id}`} className="view-btn">
                      View Quiz
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
