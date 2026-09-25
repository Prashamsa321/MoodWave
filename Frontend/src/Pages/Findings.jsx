import React, { useState } from "react";
import RetroWindow from "../components/RetroWindow";

const FINDINGS = [
  {
    id: "01",
    title: "Mood & Emotion",
    description:
      "Songs plotted on the valence-energy plane and distributed across the four mood quadrants.",
    images: [
      {
        src: "/figures/03_eda/emotion_quadrant.png",
        caption: "Emotion Quadrant",
        longCaption:
          "Each dot is a song, positioned by its valence (x-axis) and energy (y-axis). Songs cluster most densely in the Euphoric quadrant (top-right), showing that popular music tends to skew positive and energetic. Very few songs fall in the Melancholic quadrant (bottom-left).",
      },
    ],
  },
  {
    id: "02",
    title: "Genre Analysis",
    description:
      "How audio features and moods differ across genres. Danceability, tempo, and audio profiles by genre.",
    images: [
      {
        src: "/figures/03_eda/genre_audio_profiles.png",
        caption: "Genre Audio Profiles",
        longCaption:
          "Average audio features per genre. Classical and acoustic genres have high acousticness; metal and electronic genres have high energy; hip-hop leads in speechiness. This confirms each genre has a distinct audio fingerprint.",
      },
      {
        src: "/figures/03_eda/genre_danceability_boxplot.png",
        caption: "Genre Danceability",
        longCaption:
          "Danceability spread per genre. Reggaeton, dance, and pop cluster near the top; ambient and classical stay low. Wide boxes indicate greater variety within that genre — some songs are very danceable, others aren't.",
      },
      {
        src: "/figures/03_eda/genre_tempo_distributions.png",
        caption: "Genre Tempo Distributions",
        longCaption:
          "Tempo distribution across genres. Punk and metal peak around 140–160 BPM; ambient stays under 100 BPM. Each genre has a distinct rhythmic signature, showing tempo is a strong genre signal.",
      },
    ],
  },
  {
    id: "03",
    title: "Historical Trends",
    description: "How the average mood of popular music shifted year by year.",
    images: [
      {
        src: "/figures/03_eda/yearly_valence_energy.png",
        caption: "Yearly Valence & Energy",
        longCaption:
          "Average valence (positivity) and energy per year. Popular music has steadily declined in valence since the 2000s — songs got sadder. Energy has remained relatively stable, meaning popular music stayed intense but became less happy.",
      },
      {
        src: "/figures/03_eda/yearly_mood_composition.png",
        caption: "Yearly Mood Composition",
        longCaption:
          "Share of each mood quadrant per year. Euphoric songs dominate the 2000s, but Aggressive and Melancholic have grown steadily through the 2010s and 2020s. This mirrors a broader cultural shift toward darker popular music.",
      },
    ],
  },
  {
    id: "04",
    title: "Country / Global Trends",
    description:
      "How mood profiles differ across countries based on daily chart observations.",
    images: [
      {
        src: "/figures/03_eda/country_mood_profiles.png",
        caption: "Country Mood Profiles",
        longCaption:
          "Mood composition across countries based on daily chart data. Latin American charts skew heavily Euphoric; Eastern European and Nordic charts lean Melancholic. This shows culture shapes the emotional character of popular music.",
      },
    ],
  },
  {
    id: "05",
    title: "Audio Features",
    description:
      "Pairwise correlations between all 11 audio features. What moves together and what doesn't.",
    images: [
      {
        src: "/figures/03_eda/feature_correlation_heatmap.png",
        caption: "Feature Correlation Heatmap",
        longCaption:
          "Correlation between all audio features. Energy and loudness are strongly correlated (+0.75); acousticness is strongly anti-correlated with energy (louder songs are less acoustic). Valence — how happy a song feels — has weak correlations with most features, meaning happiness isn't captured by simple audio properties.",
      },
    ],
  },
  {
    id: "06",
    title: "Popularity Model",
    description:
      "Linear Regression trained to predict a song's popularity score from its audio features.",
    images: [
      {
        src: "/figures/04_models/popularity_actual_vs_predicted.png",
        caption: "Actual vs Predicted Popularity",
        longCaption:
          "Actual vs. predicted popularity. Points scatter widely around the diagonal — audio features alone don't predict popularity well (R² ≈ 0). Commercial success depends on marketing, artist fame, timing, and cultural context far more than audio alone.",
      },
      {
        src: "/figures/04_models/popularity_residuals.png",
        caption: "Residual Plot",
        longCaption:
          "Residual plot. Errors are evenly distributed around zero with no obvious pattern, confirming the linear regression isn't overfitting and the model's assumptions are reasonable.",
      },
      {
        src: "/figures/04_models/popularity_coefficients.png",
        caption: "Feature Coefficients",
        longCaption:
          "Feature coefficients. Danceability and instrumentalness contribute positively to predicted popularity; loudness and duration have weak effects. Most coefficients are small, explaining the low R².",
      },
    ],
  },
  {
    id: "07",
    title: "Mood Classifier",
    description:
      "Decision Tree classifying songs into 4 mood quadrants from audio features alone.",
    images: [
      {
        src: "/figures/04_models/mood_confusion_matrix.png",
        caption: "Mood Confusion Matrix",
        longCaption:
          "Mood classifier's predictions vs. actual moods. Euphoric and Melancholic are easiest to distinguish. Peaceful and Euphoric get confused — they share high valence, differing mainly in energy.",
      },
      {
        src: "/figures/04_models/mood_decision_tree.png",
        caption: "Mood Decision Tree",
        longCaption:
          "The full decision tree structure. Each split shows a feature threshold (e.g., acousticness < 0.4) that separates moods. The tree reveals which audio properties matter most for classifying emotion.",
      },
      {
        src: "/figures/04_models/mood_feature_importance.png",
        caption: "Mood Feature Importance",
        longCaption:
          "Feature importance for mood. Acousticness, loudness, and tempo are the strongest predictors of mood. This aligns with music psychology research showing tempo and mode drive emotional perception.",
      },
    ],
  },
  {
    id: "08",
    title: "Genre Classifier",
    description:
      "Random Forest predicting a song's genre from audio features — no artist name, no lyrics.",
    images: [
      {
        src: "/figures/04_models/genre_confusion_selected.png",
        caption: "Genre Confusion Matrix (Top Classes)",
        longCaption:
          "Genre confusion matrix for the most common classes. Metal and rock get confused (they share energy and loudness); classical and acoustic rarely overlap with others. Shows which genres are acoustically distinct.",
      },
      {
        src: "/figures/04_models/genre_feature_importance.png",
        caption: "Genre Feature Importance",
        longCaption:
          "Feature importance for genre prediction. Acousticness and instrumentalness are the strongest genre signals — electronic and metal genres are low in both, while classical and ambient are high.",
      },
    ],
  },
  {
    id: "09",
    title: "Clustering",
    description:
      "Unsupervised K-Means and hierarchical clustering discovering natural emotional groupings.",
    images: [
      {
        src: "/figures/05_clustering/elbow_curve.png",
        caption: "Elbow Curve",
        longCaption:
          "Elbow curve for K-Means. Inertia (within-cluster variance) drops sharply until K=5, then flattens. This suggests 5 clusters is the sweet spot — more clusters don't reveal meaningfully better groupings.",
      },
      {
        src: "/figures/05_clustering/silhouette_scores.png",
        caption: "Silhouette Scores",
        longCaption:
          "Silhouette score per K. Peaks around K=5 but stays relatively low (0.16), showing clusters are soft rather than sharply separated. Music emotions form a continuum — songs exist on a spectrum, not in distinct boxes.",
      },
      {
        src: "/figures/05_clustering/cluster_profile_heatmap.png",
        caption: "Cluster Profile Heatmap",
        longCaption:
          "Heatmap of average features per cluster. Each cluster has a distinct 'personality' — one is danceable pop, another acoustic/romantic, another intense metal, another ambient/classical, another speechy/live.",
      },
      {
        src: "/figures/05_clustering/dendrogram.png",
        caption: "Hierarchical Dendrogram",
        longCaption:
          "Hierarchical clustering tree. Shows how songs and genres branch and merge at different similarity thresholds. Some branches align with genre labels; others cut across them, revealing emotional groupings that ignore traditional genre boundaries.",
      },
    ],
  },
  {
    id: "10",
    title: "Cluster Visualization",
    description:
      "PCA reducing 10 audio features to 2D so clusters can be visualized on a scatter plot.",
    images: [
      {
        src: "/figures/05_clustering/pca_cluster_map.png",
        caption: "PCA Cluster Map",
        longCaption:
          "2D PCA projection of the 5 K-Means clusters. The 5 emotional groups are visually distinguishable but overlap — confirming that music emotion is a continuum. PCA captures 43.9% of the total variance in just 2 dimensions.",
      },
    ],
  },
];

export default function Findings() {
  const [openId, setOpenId] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  const totalFigures = FINDINGS.reduce((acc, s) => acc + s.images.length, 0);

  return (
    <RetroWindow title="FINDINGS">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <h1 className="retro-h1 mb-0"> Findings</h1>
        <div className="flex gap-2">
        </div>
      </div>


      <div className="space-y-3">
        {FINDINGS.map((section) => {
          const isOpen = openId === section.id;

          return (
            <div
              key={section.id}
              className={`retro-accordion ${isOpen ? "retro-accordion-open" : ""}`}
            >
             <button
  className="retro-accordion-header"
  onClick={() => toggle(section.id)}
>
  <div className="flex items-center gap-3 min-w-0">
    <span className="text-slate-900 text-sm font-bold shrink-0">
      {isOpen ? "▾" : "▸"}
    </span>
    <span
      className="font-mono text-xs px-2 py-0.5 rounded border border-slate-900 shrink-0"
      style={{
        background: isOpen ? "#fff" : "#cdbdf0",
        color: "#1e293b",
      }}
    >
      {section.id}
    </span>
    <span className="font-bold text-sm truncate">
      {section.title}
    </span>
  </div>
  <div className="flex items-center gap-2 shrink-0">
    
  </div>
</button>

              {isOpen && (
                <div className="retro-accordion-body">
                  <p className="text-xs mb-4 italic text-purple-800">
                    {section.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.images.map((img, i) => (
                      <figure
                        key={i}
                        className="bg-white border-2 border-slate-900 rounded-lg overflow-hidden cursor-pointer hover:shadow-[4px_4px_0_#1e293b] transition"
                        onClick={() => setLightbox(img)}
                      >
                        <div className="h-56 flex items-center justify-center bg-purple-50 p-2">
                          <img
                            src={img.src}
                            alt={img.caption}
                            className="max-h-full max-w-full object-contain"
                            loading="lazy"
                          />
                        </div>
                        <figcaption className="text-xs text-center text-purple-800 italic px-3 py-2 border-t border-purple-200 bg-white">
                          {img.caption}
                        </figcaption>
                      </figure>
                    ))}
                  </div>

                  <div className="text-[10px] text-purple-600 text-center mt-3 opacity-70">
                    💡 Click any figure to see details
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center text-xs text-purple-700">
        ✦ End of Findings ✦
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(30, 41, 59, 0.85)" }}
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[92vh] bg-white border-4 border-slate-900 rounded-lg shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-purple-200 border-b-2 border-slate-900 shrink-0">
              <span className="text-sm font-bold text-slate-900 truncate">
                📊 {lightbox.caption}
              </span>
              <button
                className="retro-btn text-xs px-3 py-1"
                onClick={() => setLightbox(null)}
              >
                ✕ Close
              </button>
            </div>

            {/* Body: image + description */}
            <div className="flex-1 overflow-auto">
              <div className="p-4 bg-purple-50 flex items-center justify-center">
                <img
                  src={lightbox.src}
                  alt={lightbox.caption}
                  className="max-w-full max-h-[50vh] object-contain rounded border-2 border-slate-900"
                />
              </div>
              {lightbox.longCaption && (
                <div className="px-5 py-4 bg-white border-t-2 border-slate-900">
                  <div className="text-xs font-bold text-purple-700 mb-1">
                    What this shows
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {lightbox.longCaption}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </RetroWindow>
  );
}