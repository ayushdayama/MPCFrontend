export function useApi(apiBase) {
  // Add API call helpers here as needed
  const fetchCycleData = async (username) => {
    const res = await fetch(`${apiBase}/cycle_data/${username}`);
    return res.json();
  };
  const fetchPrediction = async (username) => {
    const res = await fetch(`${apiBase}/predict/${username}`);
    return res.json();
  };
}
