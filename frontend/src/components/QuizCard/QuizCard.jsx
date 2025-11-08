import React, { useState } from "react";
import "./quiz.css";

const QuizCard = ({ question, index }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);

  const handleOptionClick = (option) => {
    if (!answered) {
      setSelectedOption(option);
      setAnswered(true);
    }
  };

  // ✅ Inline dynamic color style logic
  const getOptionStyle = (option) => {
    if (!answered) {
      return {
        backgroundColor: "#f8fafc",
        border: "2px solid #7b2ff7",
        color: "#6b21a8",
        cursor: "pointer",
        transition: "all 0.3s ease",
      };
    }

    const isCorrect = option === question.answer;
    const isSelected = option === selectedOption;

    // ✅ Correct selected (green)
    if (isSelected && isCorrect) {
      return {
        backgroundColor: "#22c55e",
        border: "2px solid #16a34a",
        color: "white",
        boxShadow: "0 0 10px #16a34a",
        transition: "all 0.3s ease",
      };
    }

    // ❌ Wrong selected (red)
    if (isSelected && !isCorrect) {
      return {
        backgroundColor: "#ef4444",
        border: "2px solid #dc2626",
        color: "white",
        animation: "shake 0.3s ease",
        transition: "all 0.3s ease",
      };
    }

    // ✅ Highlight correct option (if wrong clicked)
    if (!isSelected && isCorrect) {
      return {
        backgroundColor: "#bbf7d0",
        border: "2px solid #16a34a",
        color: "#166534",
        transition: "all 0.3s ease",
      };
    }

    // 🚫 Disable others
    return {
      backgroundColor: "#f1f5f9",
      border: "2px solid #cbd5e1",
      color: "#94a3b8",
      opacity: 0.6,
      cursor: "not-allowed",
      transition: "all 0.3s ease",
    };
  };

  return (
    <div className="quiz-card">
      <h3 className="question-title">
        {index + 1}. {question.question}
      </h3>

      <div className="options">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleOptionClick(option)}
            disabled={answered}
            style={getOptionStyle(option)} // ✅ dynamic inline style
            className="option-btn"
          >
            {String.fromCharCode(65 + i)}. {option}
          </button>
        ))}
      </div>

      {answered && (
        <div className="answer-section fade-in">
          <p className="answer">✅ Correct Answer: {question.answer}</p>
          <p className="explanation">💡 {question.explanation}</p>
          <p className="difficulty">🔹 Difficulty: {question.difficulty}</p>
        </div>
      )}
    </div>
  );
};

export default QuizCard;
