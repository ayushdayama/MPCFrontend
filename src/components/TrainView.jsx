import React, { useState } from "react";
import { Brain, Sparkles } from "lucide-react";
import { apiBase, apiFetch } from "../utils/api";

function TrainView({ username }) {
  const [trainResult, setTrainResult] = useState("");

  const handleTrain = async () => {
    setTrainResult("Training model...");
    try {
      const data = await apiFetch(`${apiBase}/train/${username}`, { method: "POST" });
      setTrainResult(data.message);
    } catch (e) {
      setTrainResult("Failed to train model.");
    }
  };

  return (
    <div className="view card active">
      <h2><Brain color="#f67280" size={22} style={{ marginRight: 6 }} /> Train Model</h2>
      <button className="secondary-btn" onClick={handleTrain}>
        <Sparkles size={16} style={{ marginRight: 4 }} /> Train Model
      </button>
      <div className="result" id="trainResult">{trainResult}</div>
    </div>
  );
}

export default TrainView;
