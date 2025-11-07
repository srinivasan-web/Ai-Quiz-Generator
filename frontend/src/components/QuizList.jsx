// src/components/QuizList.jsx
import React from "react";
import QuizCard from "./QuizCard";
import "./index.css";

const QuizList = ({ quiz }) => {
  if (!quiz || quiz.length === 0) {
    return <p className="no-quiz">No quiz available.</p>;
  }

  return (
    <div className="quiz-list">
      {quiz.map((q, idx) => (
        <QuizCard key={idx} question={q} index={idx} />
      ))}
    </div>
  );
};

export default QuizList;
