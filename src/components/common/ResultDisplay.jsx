import React from "react";

function ResultDisplay({ html }) {
  return <div className="result" dangerouslySetInnerHTML={{ __html: html }} />;
}

export default ResultDisplay;
