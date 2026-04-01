import React, { useState } from "react";
import { Cpu, RefreshCw } from "lucide-react";
import { apiBase, apiFetch } from "../utils/api";

function TrainModelView() {
  const [status, setStatus] = useState("idle");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error'|'info', text: string }

  const fetchStatus = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const data = await apiFetch(`${apiBase}/train-status`);
      setStatus(data.state || "unknown");
      setDetails(`last_run: ${data.last_run || "n/a"}, last_mae: ${data.last_mae || "n/a"}, last_error: ${data.last_error || "n/a"}`);
      setMessage({ type: 'success', text: 'Status updated successfully.' });
    } catch (error) {
      setStatus("error");
      setDetails("Could not fetch status. Is backend reachable?");
      setMessage({ type: 'error', text: 'Failed to fetch status.' });
    }
    setLoading(false);
  };

  const triggerTraining = async () => {
    setLoading(true);
    setMessage(null);
    setStatus("queued");
    setDetails("Starting training; please wait and refresh status.");
    try {
      const result = await apiFetch(`${apiBase}/train-model`, { method: "POST" });
      setDetails(result.message || "Training started.");
      setMessage({ type: 'success', text: result.message || 'Training started.' });
      await fetchStatus();
    } catch (err) {
      setStatus("error");
      setDetails("Training request failed.");
      setMessage({ type: 'error', text: 'Failed to start training.' });
    }
    setLoading(false);
  };

  return (
    <div className="view card active">
      <h2>
        <Cpu color="#e75480" size={22} style={{ marginRight: 6 }} />
        Train ML Model
      </h2>
      <p>
        Use this button to retrain the cycle interval model using the latest data in Firestore.
        Training runs in the background on the server.
      </p>
      <div className="train-btn-group">
        <button className="primary-btn" onClick={triggerTraining} disabled={loading}>
          <RefreshCw size={16} style={{ marginRight: 4 }} /> Trigger Training
        </button>
        <button
          className="secondary-btn"
          onClick={fetchStatus}
          disabled={loading}
        >
          Refresh Status
        </button>
      </div>
      {message && (
        <div style={{
          padding: '8px 12px',
          marginBottom: 12,
          borderRadius: 4,
          color: message.type === 'error' ? '#d32f2f' : message.type === 'success' ? '#2e7d32' : '#1976d2',
          backgroundColor: message.type === 'error' ? '#ffebee' : message.type === 'success' ? '#e8f5e8' : '#e3f2fd',
          border: `1px solid ${message.type === 'error' ? '#d32f2f' : message.type === 'success' ? '#2e7d32' : '#1976d2'}`,
          textAlign: 'center'
        }}>
          {message.text}
        </div>
      )}

      <div style={{ marginTop: 14, minHeight: 48 }}>
        <strong>Status:</strong> {status}
        <br />
        {details}
      </div>
    </div>
  );
}

export default TrainModelView;
