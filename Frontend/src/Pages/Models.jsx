import { useCallback, useEffect, useMemo, useState } from "react";
import RetroWindow from "../components/RetroWindow";
import ModelMenuBar from "../components/ModelMenuBar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import FeatureSlider from "../components/demos/FeatureSlider";
import PopularityDemo from "../components/demos/PopularityDemo";
import MoodDemo from "../components/demos/MoodDemo";
import GenreDemo from "../components/demos/GenreDemo";
import ClusterDemo from "../components/demos/ClusterDemo";
import PcaDemo from "../components/demos/PcaDemo";
import MoodExplore from "./MoodExplore";

const POPULARITY_FEATURES = [
  "danceability",
  "energy",
  "key",
  "loudness",
  "mode",
  "speechiness",
  "acousticness",
  "instrumentalness",
  "liveness",
  "valence",
  "tempo",
  "duration_ms",
  "time_signature",
];

const MOOD_FEATURES = [
  "danceability",
  "key",
  "loudness",
  "mode",
  "speechiness",
  "acousticness",
  "instrumentalness",
  "liveness",
  "tempo",
  "duration_ms",
  "time_signature",
];

const GENRE_FEATURES = POPULARITY_FEATURES;

const CLUSTER_FEATURES = [
  "danceability",
  "energy",
  "loudness",
  "speechiness",
  "acousticness",
  "instrumentalness",
  "liveness",
  "valence",
  "tempo",
  "duration_ms",
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
    menuLabel: "Popularity Predictor",
    description: "Estimate the popularity score of a track from its audio features.",
    features: POPULARITY_FEATURES,
    endpoint: "/predictions/popularity",
    Demo: PopularityDemo,
  },
  {
    id: "m2",
    name: "Mood Detector",
    menuLabel: "Mood Detector",
    description: "Classify the track into the learned MoodWave mood categories.",
    features: MOOD_FEATURES,
    endpoint: "/predictions/mood",
    Demo: MoodDemo,
  },
  {
    id: "m3",
    name: "Genre Classifier",
    menuLabel: "Genre Classifier",
    description: "Predict the most likely genre categories from the audio profile.",
    features: GENRE_FEATURES,
    endpoint: "/predictions/genre",
    Demo: GenreDemo,
  },
  {
    id: "m4",
    name: "Emotion Grouping",
    menuLabel: "Emotion Grouping",
    description: "Assign the track to one of the learned emotion-oriented clusters.",
    features: CLUSTER_FEATURES,
    endpoint: "/predictions/cluster",
    Demo: ClusterDemo,
  },
  {
    id: "m5",
    name: "Emotion Map",
    menuLabel: "Emotion Map",
    description: "Project the track into the PCA emotion space used by the clustering model.",
    features: PCA_FEATURES,
    endpoint: "/predictions/pca",
    Demo: PcaDemo,
  },
  {
    id: "m6",
    name: "Find Similar Songs",
    menuLabel: "Find Similar Songs",
    description: "Choose an energy and valence position and retrieve nearby tracks.",
    Demo: null,
  },
];

function makeInitialValues() {
  const initial = {};
  MODELS.forEach((model) => {
    if (!model.features) return;
    initial[model.id] = {};
    model.features.forEach((feature) => {
      initial[model.id][feature] = DEFAULTS[feature];
    });
  });
  return initial;
}

export default function Models() {
  const { isAuthenticated } = useAuth();
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [modelValues, setModelValues] = useState(makeInitialValues);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const [clusters, setClusters] = useState(null);

  const activeModel = useMemo(
    () => MODELS.find((model) => model.id === selectedModelId) || null,
    [selectedModelId],
  );

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
    setModelValues((previous) => ({
      ...previous,
      [modelId]: { ...previous[modelId], [feature]: value },
    }));
  };

  const resetModel = (model) => {
    if (!model?.features) return;

    const defaults = {};
    model.features.forEach((feature) => {
      defaults[feature] = DEFAULTS[feature];
    });

    setModelValues((previous) => ({ ...previous, [model.id]: defaults }));
    setResults((previous) => ({ ...previous, [model.id]: undefined }));
    setErrors((previous) => ({ ...previous, [model.id]: "" }));
  };

  const runModel = useCallback(
    async (model) => {
      setLoading((previous) => ({ ...previous, [model.id]: true }));
      setErrors((previous) => ({ ...previous, [model.id]: "" }));

      try {
        const { data } = await api.post(model.endpoint, modelValues[model.id]);
        setResults((previous) => ({ ...previous, [model.id]: data }));

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
        setErrors((previous) => ({
          ...previous,
          [model.id]:
            err.response?.data?.message || "Failed. Is the ML service running?",
        }));
      } finally {
        setLoading((previous) => ({ ...previous, [model.id]: false }));
      }
    },
    [isAuthenticated, modelValues],
  );

  const statusText = activeModel
    ? `${activeModel.name}${loading[activeModel.id] ? " - Working..." : " - Ready"}`
    : "Select a model from the menu bar.";

  const Demo = activeModel?.Demo;
  const activeResult = activeModel ? results[activeModel.id] : null;
  const activeError = activeModel ? errors[activeModel.id] : "";
  const activeLoading = activeModel ? loading[activeModel.id] : false;

  return (
    <RetroWindow
      windowId="/models"
      title="MoodWave Models"
      appIcon="M"
      statusText={statusText}
      menuBar={
        <ModelMenuBar
          models={MODELS}
          activeId={selectedModelId}
          onSelect={setSelectedModelId}
        />
      }
    >
      <div className={`win98-model-client ${activeModel ? "has-model" : "is-empty"}`}>
        {activeModel && (
          <div className="win98-model-page">
            <div className="win98-model-heading-row">
              <div>
                <h1 className="win98-model-title">{activeModel.name}</h1>
                <p className="win98-model-description">{activeModel.description}</p>
              </div>
              <div className="win98-model-badge">MoodWave ML</div>
            </div>

            {activeModel.id === "m6" ? (
              <MoodExplore />
            ) : (
              <div className="win98-model-layout">
                <fieldset className="win98-groupbox win98-input-group">
                  <legend>Model Inputs</legend>

                  <div className="win98-slider-grid">
                    {activeModel.features.map((feature) => (
                      <FeatureSlider
                        key={feature}
                        feature={feature}
                        value={modelValues[activeModel.id][feature]}
                        onChange={(changedFeature, value) =>
                          handleModelChange(activeModel.id, changedFeature, value)
                        }
                        compact
                      />
                    ))}
                  </div>

                  <div className="win98-action-row">
                    <button
                      type="button"
                      className="retro-btn win98-default-button"
                      onClick={() => runModel(activeModel)}
                      disabled={activeLoading}
                    >
                      {activeLoading ? "Running..." : "Predict"}
                    </button>
                    <button
                      type="button"
                      className="retro-btn"
                      onClick={() => resetModel(activeModel)}
                      disabled={activeLoading}
                    >
                      Reset
                    </button>
                  </div>

                  {activeError && (
                    <div className="win98-message-box is-error" role="alert">
                      <span className="win98-message-icon" aria-hidden="true">!</span>
                      <span>{activeError}</span>
                    </div>
                  )}
                </fieldset>

                <fieldset className="win98-groupbox win98-result-group">
                  <legend>Model Output</legend>
                  {!activeResult && (
                    <div className="win98-output-placeholder">
                      Set the input values and click Predict.
                    </div>
                  )}
                  {activeResult && Demo && (
                    <Demo result={activeResult} clusters={clusters} />
                  )}
                </fieldset>
              </div>
            )}
          </div>
        )}
      </div>
    </RetroWindow>
  );
}
