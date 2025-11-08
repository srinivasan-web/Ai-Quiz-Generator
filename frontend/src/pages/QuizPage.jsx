import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { data, useLocation, useNavigate, useParams } from "react-router-dom";
import QuizList from "../components/QuizList";

import { getQuizById } from "../api";
import Loader from "../components/Loader"; // ✅ Import loader
import Navbar from "../components/Navbar";

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loaderType, setLoaderType] = useState("pacman");
  const [quizData, setQuizData] = useState(location.state?.quiz || null);
  const [loading, setLoading] = useState(false);
  console.log(quizData);

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
    ); // ✅

  if (!quizData) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-600">Quiz not loaded. Go back and try again.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          ⬅ Back
        </button>
      </div>
    );
  }

  return (
    <div className="nav">
      <Navbar />
      <h2 className="heading1 text-center mb-4">
        🧠 {quizData.title || "Generated Quiz"}
      </h2>
      <p className="summary text-center mb-8">
        <strong>📖 Summary:</strong>
        <br />
      </p>
      <p className="para-summary">
        {quizData.summary || "Explore the quiz below!"}
      </p>

      <div>
        {quizData.key_entities.map((each) => (
          <h4 key={each.id}>{each}</h4>
        ))}
      </div>
      <div>
        {quizData.related_topics.map((each) => (
          <h1 key={each.id}>{each}</h1>
        ))}
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
