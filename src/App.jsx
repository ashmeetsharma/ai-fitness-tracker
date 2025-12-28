import { useState } from "react";
import "./index.css";

function App() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);

  const [preview, setPreview] = useState(null);
  const [foodImage, setFoodImage] = useState(null);
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);

  const calculateBMI = () => {
    if (!height || !weight) return;
    const h = height / 100;
    setBmi((weight / (h * h)).toFixed(2));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFoodImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const analyzeFood = async () => {
    if (!foodImage) {
      alert("Please upload a food image first");
      return;
    }

    setLoading(true);

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const base64 = reader.result.split(",")[1];

        const response = await fetch("/api/foodTextAnalysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64 }),
        });

        const data = await response.json();
        setAiResult(data.result);
      } catch (err) {
        console.error("FETCH ERROR:", err);
        alert("Food analysis failed");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(foodImage);
  };

  return (
    <div className="app">
      <video className="bg-video" autoPlay loop muted playsInline>
        <source src="/gym.mp4" type="video/mp4" />
      </video>
      <div className="overlay"></div>

      <div className="layout">
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
              <h3>Food Tracker (Image AI)</h3>

              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e)} />

              {preview && <img src={preview} alt="preview" className="food-preview" />}

              <button onClick={analyzeFood} disabled={loading}>
                {loading ? "Analyzing..." : "Get Calories"}
              </button>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="card">
            <h3>Workout Plan</h3>
            <p>🏃 Cardio: 20–30 min</p>
            <p>🏋️ Strength: Pushups, Squats</p>
            <p>🧠 Tip: Sleep & hydrate well</p>

            {aiResult && (
              <div className="ai-stats">
                <pre style={{ whiteSpace: "pre-wrap" }}>{aiResult}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
