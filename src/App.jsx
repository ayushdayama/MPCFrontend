import { useState } from 'react';
import './App.css';

const apiBase = 'https://web-production-4106c.up.railway.app';

function App() {
  // Navigation state
  const [view, setView] = useState('main');
  // Prediction states
  const [result, setResult] = useState('');
  const [month, setMonth] = useState('');
  const [monthResult, setMonthResult] = useState('');
  // Feedback states
  const [predictedDate, setPredictedDate] = useState('');
  const [actualDate, setActualDate] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackResult, setFeedbackResult] = useState('');
  // Train state
  const [trainResult, setTrainResult] = useState('');

  // Navigation
  const showView = (v) => setView(v);

  // Predict next cycle
  const handlePredict = async () => {
    setResult('Loading...');
    try {
      const cycleRes = await fetch(`${apiBase}/cycle_data`);
      const cycleData = await cycleRes.json();
      const allDates = cycleData.dates;
      const lastDate = allDates.length ? allDates[allDates.length-1] : null;
      const res = await fetch(`${apiBase}/predict`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      let html = '';
      if (lastDate) {
        html += `<b>Last recorded cycle date:</b> ${lastDate}<br>`;
      }
      if (data.top_dates && data.top_dates.length > 0) {
        html += `<b>Most confident prediction:</b> ${data.top_dates[0]}<br>`;
        if (data.top_dates.length > 1) {
          html += `<span style='color:orange'><b>Other possible dates (less likely):</b><br>${data.top_dates.slice(1).join('<br>')}</span>`;
        }
      } else {
        html += 'No prediction available.';
      }
      setResult(<span dangerouslySetInnerHTML={{ __html: html }} />);
    } catch (e) {
      setResult('Failed to fetch prediction.');
    }
  };

  // Predict for selected month
  const handlePredictMonth = async () => {
    if (!month) {
      setMonthResult('Please select a month.');
      return;
    }
    setMonthResult('Loading...');
    try {
      const cycleRes = await fetch(`${apiBase}/cycle_data`);
      const cycleData = await cycleRes.json();
      const allDates = cycleData.dates;
      const lastDate = allDates.length ? allDates[allDates.length-1] : null;
      const res = await fetch(`${apiBase}/predict`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      let html = '';
      if (lastDate) {
        html += `<b>Last recorded cycle date:</b> ${lastDate}<br>`;
      }
      if (data.top_dates && data.top_dates.length > 0) {
        const lastDateObj = new Date(lastDate);
        const intervals = data.top_dates.map(d => (new Date(d) - lastDateObj) / (1000*60*60*24));
        let predictions = [[], [], []];
        for (let i = 0; i < 24; ++i) {
          for (let j = 0; j < intervals.length; ++j) {
            let next = new Date(lastDateObj.getTime() + intervals[j]*24*60*60*1000*(i+1));
            const y = next.getFullYear();
            const m = (next.getMonth()+1).toString().padStart(2,'0');
            if (`${y}-${m}` === month) {
              predictions[j].push(next.toISOString().slice(0,10));
            }
          }
        }
        predictions = predictions.map(group => group.sort());
        if (predictions[0].length) {
          html += `<b>Most confident prediction(s) for ${month}:</b><br>${predictions[0].join('<br>')}<br>`;
        }
        if (predictions[1].length || predictions[2].length) {
          html += `<span style='color:orange'><b>Other possible dates (less likely):</b><br>${[...predictions[1], ...predictions[2]].sort().join('<br>')}</span>`;
        }
      } else {
        html += 'No prediction available.';
      }
      setMonthResult(<span dangerouslySetInnerHTML={{ __html: html }} />);
    } catch (e) {
      setMonthResult('Failed to predict for month.');
    }
  };

  // Feedback
  const handleFeedback = async () => {
    if (!predictedDate || !actualDate) {
      setFeedbackResult('Please enter both predicted and actual dates.');
      return;
    }
    setFeedbackResult('Submitting...');
    try {
      const res = await fetch(`${apiBase}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ predicted_date: predictedDate, actual_date: actualDate, comment: feedback })
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setFeedbackResult(data.message);
      setFeedback('');
      setPredictedDate('');
      setActualDate('');
    } catch (e) {
      setFeedbackResult('Failed to submit feedback.');
    }
  };

  // Train
  const handleTrain = async () => {
    setTrainResult('Training model...');
    try {
      const res = await fetch(`${apiBase}/train`, { method: 'POST' });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setTrainResult(data.message);
    } catch (e) {
      setTrainResult('Failed to train model.');
    }
  };

  return (
    <div className="container">
      <h1>Cycle Predictor</h1>
      <div className="nav">
        <button onClick={() => showView('main')}>Prediction</button>
        <button onClick={() => showView('feedback')}>Feedback</button>
        <button onClick={() => showView('train')}>Train Model</button>
      </div>
      <div className={`view${view === 'main' ? ' active' : ''}`}>
        <button id="predictBtn" onClick={handlePredict}>Get Next Cycle Date</button>
        <div className="result" id="result">{result}</div>
        <label htmlFor="monthPicker">Predict cycles for month:</label>
        <input type="month" id="monthPicker" value={month} onChange={e => setMonth(e.target.value)} />
        <button id="predictMonthBtn" onClick={handlePredictMonth}>Predict for Month</button>
        <div className="result" id="monthResult">{monthResult}</div>
      </div>
      <div className={`view${view === 'feedback' ? ' active' : ''}`}>
        <label htmlFor="predicted_date">Predicted Date:</label>
        <input type="date" id="predicted_date" value={predictedDate} onChange={e => setPredictedDate(e.target.value)} />
        <label htmlFor="actual_date">Actual Date:</label>
        <input type="date" id="actual_date" value={actualDate} onChange={e => setActualDate(e.target.value)} />
        <label htmlFor="feedback">Comment (optional):</label>
        <textarea id="feedback" placeholder="Enter your feedback here..." value={feedback} onChange={e => setFeedback(e.target.value)} />
        <button id="feedbackBtn" onClick={handleFeedback}>Submit Feedback</button>
        <div className="feedback-result" id="feedbackResult">{feedbackResult}</div>
      </div>
      <div className={`view${view === 'train' ? ' active' : ''}`}>
        <button id="trainBtn" onClick={handleTrain}>Train Model</button>
        <div className="result" id="trainResult">{trainResult}</div>
      </div>
    </div>
  );
}

export default App;
