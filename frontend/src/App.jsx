/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Scale, Ruler, Activity, CheckCircle2, Loader2 } from "lucide-react";

function App() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
    });

  const handleSubmit = async () => {
    if (!image || !height || !weight) return;
    setLoading(true);
    setResult("");

    try {
      const imageBase64 = await toBase64(image);
      const res = await fetch("http://localhost:5000/api/foodTextAnalysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, height, weight }),
      });
      const data = await res.json();
      setResult(data.result || "No response");
    } catch (err) {
      setResult("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/30 font-sans">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            FitVision AI
          </h1>
          <p className="text-slate-400 text-lg">Snap your meal, track your goals instantly.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          {/* Stats Inputs */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="relative">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1 mb-2 block">Height (cm)</label>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <input
                  type="number"
                  placeholder="175"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-white"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
            </div>
            <div className="relative">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1 mb-2 block">Weight (kg)</label>
              <div className="relative">
                <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500" />
                <input
                  type="number"
                  placeholder="70"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-white"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Image Upload Area */}
          <div className="mb-8">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1 mb-2 block">Food Photo</label>
            <label className="relative group cursor-pointer block">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <div className={`w-full aspect-video rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden
                ${preview ? 'border-emerald-500/50' : 'border-white/10 hover:border-emerald-500/30 bg-white/5'}`}>
                
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="bg-emerald-500/10 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-emerald-500" />
                    </div>
                    <p className="text-slate-300 font-medium">Click to upload photo</p>
                    <p className="text-slate-500 text-sm mt-1">PNG, JPG up to 10MB</p>
                  </>
                )}
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading || !image}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-3
              ${loading ? 'bg-slate-800 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-white'}`}
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Analyzing Nutrition...
              </>
            ) : (
              <>
                <Activity className="w-6 h-6" />
                Analyze My Meal
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 backdrop-blur-md"
            >
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <h3 className="text-xl font-bold text-emerald-400">Analysis Complete</h3>
              </div>
              <div className="text-slate-200 leading-relaxed whitespace-pre-wrap font-medium">
                {result}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;