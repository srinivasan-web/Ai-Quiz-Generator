import { useState } from "react";
import { toast } from "react-toastify";
import {
  FaCircleNotch,
  FaHeartbeat,
  FaTh,
  FaCompactDisc,
  FaSun,
} from "react-icons/fa";
import { generateQuiz } from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import "./index.css";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaderType, setLoaderType] = useState("pacman"); 

  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!url) return toast.warning("Please check your input!");
    setLoading(true);
    try {
      const data = await generateQuiz(url);
      navigate(`/quiz/${data.id}`, { state: { quiz: data } });
    } catch (err) {
      console.log("error")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      {loading && (
        <Loader
          message="Scraping Wikipedia and Generating Quiz Using AI... "
          time="This may take 10-30 seconds"
          type={loaderType}
        />
      )}
      <div className="home-container">
        <h1 className="heading ">AI Wikipedia Quiz Generator 🧠</h1>
        <p className="para">
          Transform any Wikipedia article into an engaging educational quiz
        </p>
        <div className="input-group">
          <span>Example:</span>
          <code className="mb-6 text-gray-900 font-bold ">
            https://en.wikipedia.org/wiki/Deep_learning
          </code>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter a Wikipedia URL to generate a custom quiz using AI!"
            className="input-ai"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg btn-ai"
          >
            Generate Quiz
          </button>
        </div>

        {/* Example: Allow changing spinner style */}
        <h1 className="loader-header">Choose any loader type</h1>
        <div className="flex gap-2 mt-6  btn-container">
          <button
            onClick={() => setLoaderType("ring")}
            className={loaderType === "ring" ? "ring btn" : "btn"}
          >
            Ring <FaCircleNotch className="loader-icon ring" />
          </button>
          <button
            onClick={() => setLoaderType("pacman")}
            className={loaderType === "pacman" ? "pacman btn" : "btn"}
          >
            Pacman <FaCompactDisc className="loader-icon pacman" />
          </button>
          <button
            onClick={() => setLoaderType("pulse")}
            className={loaderType === "pulse" ? "pulse btn" : "btn"}
          >
            Pulse <FaSun className="loader-icon pulse" />
          </button>
          <button
            onClick={() => setLoaderType("hash")}
            className={loaderType === "hash" ? "hash btn" : "btn"}
          >
            Hash <FaTh className="loader-icon hash" />
          </button>
          <button
            onClick={() => setLoaderType("beat")}
            className={loaderType === "beat" ? "btn beat" : "btn"}
          >
            Beat <FaHeartbeat className="loader-icon beat" />
          </button>
        </div>
      </div>
    </div>
  );
}
