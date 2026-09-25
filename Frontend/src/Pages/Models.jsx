import React, { useState, useEffect, useCallback } from "react";
import RetroWindow from "../components/RetroWindow";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import FeatureSlider from "../components/demos/FeatureSlider";
import PopularityDemo from "../components/demos/PopularityDemo";
import MoodDemo from "../components/demos/MoodDemo";
import GenreDemo from "../components/demos/GenreDemo";
import ClusterDemo from "../components/demos/ClusterDemo";
import PcaDemo from "../components/demos/PcaDemo";
import MoodExplore from "./MoodExplore";

// Feature lists per model (from model_manifest.json)
const POPULARITY_FEATURES = [
  "danceability", "energy", "key", "loudness", "mode",
  "speechiness", "acousticness", "instrumentalness",
  "liveness", "valence", "tempo", "duration_ms", "time_signature",
];
const MOOD_FEATURES = [
  "danceability", "key", "loudness", "mode",
  "speechiness", "acousticness", "instrumentalness",
  "liveness", "tempo", "duration_ms", "time_signature",
];
const GENRE_FEATURES = POPULARITY_FEATURES;
const CLUSTER_FEATURES = [
  "danceability", "energy", "loudness", "speechiness",
  "acousticness", "instrumentalness", "liveness",
  "valence", "tempo", "duration_ms",
];
const PCA_FEATURES = CLUSTER_FEATURES;

const DEFAULTS = {
  danceability: 0.68,
  energy: 0.74,
  key: 5,
  loudness: -6.2,
  mode: 1,
  speechiness: 0.06,
  acousticness: 0.18,
  instrumentalness: 0.01,
  liveness: 0.14,
  valence: 0.57,
  tempo: 124.5,
  duration_ms: 213000,
  time_signature: 4,
};

const MODELS = [
  {
    id: "m1",
    name: "Popularity Predictor",
    features: POPULARITY_FEATURES,
    endpoint: "/predictions/popularity",
    Demo: PopularityDemo,
  },
  {
    id: "m2",
    name: "Mood Detector",
    features: MOOD_FEATURES,
    endpoint: "/predictions/mood",
    Demo: MoodDemo,
  },
  {
    id: "m3",
    name: "Genre Classifier",
    features: GENRE_FEATURES,
    endpoint: "/predictions/genre",
    Demo: GenreDemo,
  },
  {
    id: "m4",
    name: "Emotion Grouping",
    features: CLUSTER_FEATURES,
    endpoint: "/predictions/cluster",
    Demo: ClusterDemo,
  },
  {
    id: "m5",
    name: "Emotion Map",
    features: PCA_FEATURES,
    endpoint: "/predictions/pca",
    Demo: PcaDemo,
  },
  {
    id: "m6",
    name: "Find Similar Songs ",
    Demo: null,
  },
];

export default function Models() {
  const [openId, setOpenId] = useState(null);

  const [modelValues, setModelValues] = useState(() => {
    const init = {};
    MODELS.forEach((m) => {
      if (m.features) {
        init[m.id] = {};
        m.features.forEach((f) => {
          init[m.id][f] = DEFAULTS[f];
        });
      }
    });
    return init;
  });

  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  const [clusters, setClusters] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/predictions/clusters");
        setClusters(data);
      } catch (err) {
        console.error("Cluster fetch error:", err);
      }
    })();
  }, []);

  const handleModelChange = (modelId, feature, value) => {
    setModelValues((prev) => ({
      ...prev,
      [modelId]: { ...prev[modelId], [feature]: value },
    }));
  };


  const { isAuthenticated } = useAuth();
  
  const runModel = useCallback(
    async (model) => {
      setLoading((prev) => ({ ...prev, [model.id]: true }));
      setErrors((prev) => ({ ...prev, [model.id]: "" }));
      try {
        const { data } = await api.post(
          model.endpoint,
          modelValues[model.id]
        );
        setResults((prev) => ({ ...prev, [model.id]: data }));
  
        // Auto-save to history if logged in
        if (isAuthenticated) {
          const modelTypeMap = {
            m1: "popularity",
            m2: "mood",
            m3: "genre",
            m4: "cluster",
            m5: "pca",
          };
          const modelType = modelTypeMap[model.id];
          if (modelType) {
            try {
              await api.post("/predictions", {
                modelType,
                inputFeatures: modelValues[model.id],
                output: data,
              });
            } catch (saveErr) {
              console.warn("Auto-save failed:", saveErr.message);
            }
          }
        }
      } catch (err) {
        setErrors((prev) => ({
          ...prev,
          [model.id]:
            err.response?.data?.message ||
            "Failed. Is the ML service running?",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, [model.id]: false }));
      }
    },
    [modelValues, isAuthenticated]
  );

  const runAll = async () => {
    for (const m of MODELS) {
      if (m.features) {
        await runModel(m);
      }
    }
  };

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <RetroWindow title="MODELS">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <h1 className="retro-h1 mb-0"> Models</h1>
      
      </div>

   
      <div className="space-y-3">
        {MODELS.map((model) => {
          const isOpen = openId === model.id;
          const result = results[model.id];
          const isLoading = loading[model.id];
          const error = errors[model.id];

          return (
            <div
              key={model.id}
              className={`retro-accordion ${isOpen ? "retro-accordion-open" : ""}`}
            >
              <button
                className="retro-accordion-header"
                onClick={() => toggle(model.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-slate-900 text-sm font-bold shrink-0">
                    {isOpen ? "▾" : "▸"}
                  </span>
                  <span className="font-bold text-sm truncate">
                    {model.name}
                  </span>
                </div>
                {model.isLive && (
                  <span
                    className="retro-pill shrink-0"
                    style={{ background: "#6bcf7f", fontSize: 10 }}
                  >
                    LIVE
                  </span>
                )}
              </button>

              {isOpen && (
                <div className="retro-accordion-body">
                  {model.id === "m6" ? (
                    <MoodExplore />
                  ) : (
                    <>
                      {model.features && (
                        <div className="bg-white border-2 border-slate-900 rounded p-4 mb-4">
                          <div className="text-xs font-bold text-purple-700 mb-3">
                            Inputs ({model.features.length} features)
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {model.features.map((f) => (
                              <FeatureSlider
                                key={f}
                                feature={f}
                                value={modelValues[model.id][f]}
                                onChange={(feat, val) =>
                                  handleModelChange(model.id, feat, val)
                                }
                                compact
                              />
                            ))}
                          </div>
                          <button
                            onClick={() => runModel(model)}
                            disabled={isLoading}
                            className="retro-btn retro-btn-primary w-full mt-4 disabled:opacity-50"
                          >
                            {isLoading ? "⏳ Running..." : "▶ Predict"}
                          </button>
                          {error && (
                            <div className="mt-3 text-xs bg-red-200 border border-red-700 text-red-900 rounded p-2">
                              {error}
                            </div>
                          )}
                        </div>
                      )}

                      {result && model.Demo && (
                        <model.Demo result={result} clusters={clusters} />
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

    
    </RetroWindow>
  );
}