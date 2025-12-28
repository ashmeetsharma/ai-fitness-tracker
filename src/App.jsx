import { useState } from "react";
import "./index.css";

function App() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);

  const [preview, setPreview] = useState(null);
  const [foodName, setFoodName] = useState("");
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateBMI = () => {
    if (!height || !weight) return;
    const h = height / 100;
    setBmi((weight / (h * h)).toFixed(2));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const analyzeFood = async () => {
    if (!foodName) {
      alert("Enter food name first");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://ai-fitness-tracker-seven.vercel.app/api/foodTextAnalysis",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ foodName })
        }
      );

      const data = await response.json();
      console.log("AI RESPONSE:", data);

      setAiData(data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      alert("Request failed – check console");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <video className="bg-video" autoPlay loop muted playsInline>
        <source src="/gym.mp4" type="video/mp4" />
      </video>
      <div className="overlay"></div>

      <div className="layout">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="card">
            <h1>AI Fitness Tracker</h1>

            <div className="section">
              <input
                type="number"
                placeholder="Height (cm)"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
              <input
                type="number"
                placeholder="Weight (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <button onClick={calculateBMI}>Calculate BMI</button>
              {bmi && <p className="bmi-badge">BMI: {bmi}</p>}
            </div>

            <hr />

            <div className="section">
              <h3>Food Tracker (Text AI)</h3>

              <input type="file" accept="image/*" onChange={handleImageChange} />

              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="food-preview"
                />
              )}

              <input
                type="text"
                placeholder="Enter food name (e.g. Banana, Boiled Egg)"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
              />

              <button onClick={analyzeFood} disabled={loading}>
                {loading ? "Analyzing..." : "Get Calories"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="card">
            <h3>Workout Plan</h3>
            <p>🏃 Cardio: 20–30 min</p>
            <p>🏋️ Strength: Pushups, Squats</p>
            <p>🧠 Tip: Sleep & hydrate well</p>

            {aiData && (
              <div className="ai-stats">
                <h4>{aiData.food}</h4>
                <div className="stats-grid">
                  <span>🔥 {aiData.calories} kcal</span>
                  <span>💪 {aiData.protein}</span>
                </div>
                <p>{aiData.advice}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
