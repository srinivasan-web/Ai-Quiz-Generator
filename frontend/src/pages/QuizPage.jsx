import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import QuizList from "../components/QuizList";
import { getQuizById } from "../api";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import "./index.css";

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loaderType, setLoaderType] = useState("pacman");
  const [quizData, setQuizData] = useState(location.state?.quiz || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!quizData && id) {
      setLoading(true);
      getQuizById(id)
        .then((data) => setQuizData(data))
        .catch((err) => {
          console.error("Error fetching quiz:", err);
          toast.error("Something went wrong ❌");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading)
    return (
      <Loader
        message="Scraping Wikipedia and Generating Quiz Using AI... "
        time="This may take 10-30 seconds"
        type={loaderType}
      />
    );

  if (!quizData) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-600">Quiz not loaded. Go back and try again.</p>
        <button onClick={() => navigate("/")} className="generate-new">
          ⬅ Back
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <Navbar />
      <h2 className="heading1 animate-fadeIn">
        🧠 {quizData.title || "Generated Quiz"}
      </h2>
      <p className="quiz-para">Generate Quiz, Related Topics , Key Entities based on the your wikipedia url </p>
      <div className="summary-card animate-slideUp">
        <h3 className="head"> 📖 Summary</h3>
        <p className="summary">
          {quizData.summary || "Explore the quiz below!"}
        </p>
      </div>

      <div className="topics-related">
        <div className="entities animate-fadeIn">
          <h3>🔑 Key Entities</h3>
          <ul className="inner">
            {quizData.key_entities?.map((each, i) => (
              <li key={i}>{each}</li>
            ))}
          </ul>
        </div>

        <div className="topics animate-fadeIn related">
          <h3>📚 Related Topics</h3>
          <ul className="inner">
            {quizData.related_topics?.map((each, i) => (
              <li key={i}>{each}</li>
            ))}
          </ul>
        </div>
      </div>
      <QuizList quiz={quizData.quiz || []} />
      <div className="text-center mt-6">
        <button onClick={() => navigate("/")} className="generate-new">
          🔄 Generate New Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizPage;
