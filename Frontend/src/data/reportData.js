export const REPORTS = [
  {
    id: "mood-emotion",
    menuLabel: "Mood Emotion",
    title: "Mood & Emotion Report",
    subtitle: "Valence-energy mood quadrants in the historical Spotify sample.",
    summary:
      "The historical playlist is dominated by higher-energy moods. Euphoric songs account for 52.46% of tracks and Aggressive songs for 33.96%, while Melancholic and Peaceful tracks make up smaller shares.",
    figures: [
      {
        src: "/reports/figures/01_mood_emotion/emotion_quadrant.png",
        alt: "Emotion quadrant scatter plot",
        title: "Emotion Quadrant",
        finding:
          "The valence-energy plane separates songs into four interpretable mood regions. The concentration of points in the upper half shows that higher-energy tracks are common in this dataset, while the lower-energy Peaceful region is comparatively sparse.",
      },
    ],
  },
  {
    id: "genre",
    menuLabel: "Genre",
    title: "Genre Report",
    subtitle: "How audio characteristics differ across selected genres.",
    summary:
      "The EDA dataset contains 114 genre labels. For readable visual comparison, the analysis focuses on eight representative genres: pop, rock, hip-hop, jazz, classical, country, EDM and acoustic.",
    figures: [
      {
        src: "/reports/figures/02_genre/genre_audio_profiles.png",
        alt: "Genre audio feature profiles",
        title: "Genre Audio Profiles",
        finding:
          "The normalized profiles show that genres occupy different combinations of acousticness, energy, danceability and related audio features rather than sharing one common feature pattern.",
      },
      {
        src: "/reports/figures/02_genre/genre_danceability_boxplot.png",
        alt: "Genre danceability boxplot",
        title: "Genre Danceability",
        finding:
          "The boxplots compare both the typical danceability and the spread within each genre. Overlap between boxes is important: genre influences danceability, but no single danceability value uniquely identifies a genre.",
      },
      {
        src: "/reports/figures/02_genre/genre_tempo_distributions.png",
        alt: "Genre tempo distributions",
        title: "Genre Tempo Distributions",
        finding:
          "Tempo distributions differ by genre but still overlap substantially. This makes tempo useful as one signal among several rather than a standalone genre identifier.",
      },
    ],
  },
  {
    id: "historical-trends",
    menuLabel: "Historical Trends",
    title: "Historical Trends Report",
    subtitle: "Changes in valence, energy and mood composition from 2000 to 2023.",
    summary:
      "The historical analysis covers 2000-2023. Average valence is highest in 2001 (0.654) and lowest in 2017 (0.461). Average energy is highest in 2000 (0.750) and lowest in 2020 (0.609).",
    figures: [
      {
        src: "/reports/figures/03_historical_trends/yearly_valence_energy.png",
        alt: "Yearly valence and energy trend lines",
        title: "Yearly Valence & Energy",
        finding:
          "Valence generally trends lower from the early 2000s into the late 2010s, while energy varies within a narrower band. The chart therefore suggests a stronger long-term change in positivity than in intensity.",
      },
      {
        src: "/reports/figures/03_historical_trends/yearly_mood_composition.png",
        alt: "Yearly mood composition chart",
        title: "Yearly Mood Composition",
        finding:
          "The yearly shares show that the balance between Euphoric, Aggressive, Melancholic and Peaceful songs changes over time. Later years contain a larger share of lower-valence moods than many early-2000s years.",
      },
    ],
  },
  {
    id: "audio-features",
    menuLabel: "Audio Features",
    title: "Audio Features Report",
    subtitle: "Relationships between the numerical Spotify audio features.",
    summary:
      "The correlation analysis is used to identify features that move together and to flag redundancy before modelling. The project findings also show that individual audio features have weak linear relationships with popularity.",
    figures: [
      {
        src: "/reports/figures/05_audio_features/feature_correlation_heatmap.png",
        alt: "Audio feature correlation heatmap",
        title: "Feature Correlation Heatmap",
        finding:
          "The heatmap makes positive and negative feature relationships visible at a glance. Stronger blocks indicate related measurements, while many weaker cells show why a single audio feature is unlikely to explain a complex target such as popularity on its own.",
      },
    ],
  },
  {
    id: "popularity-model",
    menuLabel: "Popularity Model",
    title: "Popularity Regression Report",
    subtitle: "Linear regression using audio features to predict Spotify popularity.",
    summary:
      "The Linear Regression test result is MAE 9.09, RMSE 14.53 and R² -0.014. Its R² is slightly below the mean-prediction dummy baseline (-0.013), so these audio features do not provide useful linear predictive power for popularity in this dataset.",
    figures: [
      {
        src: "/reports/figures/06_popularity_model/popularity_actual_vs_predicted.png",
        alt: "Actual versus predicted popularity scatter plot",
        title: "Actual vs Predicted Popularity",
        finding:
          "Predictions do not closely follow the ideal diagonal line. The wide scatter is consistent with the negative R² and shows that popularity is not well explained by this linear audio-feature model.",
      },
      {
        src: "/reports/figures/06_popularity_model/popularity_residuals.png",
        alt: "Popularity regression residual plot",
        title: "Residuals",
        finding:
          "Residuals remain large across the prediction range. This reinforces the main result: even where the residual pattern is not strongly structured, the model still leaves substantial unexplained error.",
      },
      {
        src: "/reports/figures/06_popularity_model/popularity_coefficients.png",
        alt: "Popularity regression coefficients",
        title: "Regression Coefficients",
        finding:
          "The coefficient plot shows the direction and relative contribution of each feature inside the fitted linear model. These coefficients should be interpreted cautiously because the model as a whole has essentially no out-of-sample explanatory power.",
      },
    ],
  },
  {
    id: "mood-classifier",
    menuLabel: "Mood Classifier",
    title: "Mood Classifier Report",
    subtitle: "Decision Tree classification of four mood quadrants.",
    summary:
      "The tuned Decision Tree reaches 65.21% test accuracy with a macro F1 of 0.606. Melancholic is the strongest class by F1 (0.726), while Peaceful is the weakest (0.386), indicating uneven difficulty across the four moods.",
    figures: [
      {
        src: "/reports/figures/07_mood_classifier/mood_confusion_matrix.png",
        alt: "Mood classifier confusion matrix",
        title: "Mood Confusion Matrix",
        finding:
          "The confusion matrix shows where the classifier succeeds and where mood boundaries overlap. Peaceful has the lowest recall, while Melancholic is separated more reliably than the other classes.",
      },
      {
        src: "/reports/figures/07_mood_classifier/mood_decision_tree.png",
        alt: "Mood decision tree diagram",
        title: "Mood Decision Tree",
        finding:
          "The tree exposes the actual sequence of feature thresholds used for classification. This makes the model interpretable: each prediction can be traced through explicit audio-feature splits.",
      },
      {
        src: "/reports/figures/07_mood_classifier/mood_feature_importance.png",
        alt: "Mood classifier feature importance chart",
        title: "Mood Feature Importance",
        finding:
          "The feature-importance chart ranks which inputs the tree relied on most. It is best read together with the confusion matrix because importance describes model usage, not whether a feature alone can cleanly separate every mood.",
      },
    ],
  },
  {
    id: "genre-classifier",
    menuLabel: "Genre Classifier",
    title: "Genre Classifier Report",
    subtitle: "Random Forest classification across 112 cleaned genre classes.",
    summary:
      "The Random Forest reaches 34.41% exact-class accuracy, macro F1 0.294 and top-3 accuracy 52.78%. With 112 target classes, the top-3 result shows that the model often narrows a track to a small set of plausible genres even when the exact label is missed.",
    figures: [
      {
        src: "/reports/figures/08_genre_classifier/genre_confusion_selected.png",
        alt: "Selected genre confusion matrix",
        title: "Selected Genre Confusion Matrix",
        finding:
          "The selected confusion matrix highlights which common genres the model separates well and which are frequently confused. Shared audio characteristics between neighbouring styles produce many of the off-diagonal errors.",
      },
      {
        src: "/reports/figures/08_genre_classifier/genre_feature_importance.png",
        alt: "Genre classifier feature importance",
        title: "Genre Feature Importance",
        finding:
          "The importance ranking shows that the Random Forest uses some audio features much more heavily than others. Because the task contains many overlapping genre labels, no single feature is sufficient by itself.",
      },
    ],
  },
  {
    id: "clustering",
    menuLabel: "Clustering",
    title: "Clustering Report",
    subtitle: "K-Means and hierarchical clustering of songs by audio profile.",
    summary:
      "The final K-Means model uses five clusters over 115,657 tracks. At K=5 the sampled silhouette score is 0.164, which indicates substantial overlap between clusters and supports treating them as broad audio profiles rather than rigid natural categories.",
    figures: [
      {
        src: "/reports/figures/09_clustering/elbow_curve.png",
        alt: "K-Means elbow curve",
        title: "Elbow Curve",
        finding:
          "Inertia decreases as more clusters are added, so the elbow plot is used to look for diminishing returns. K=5 was selected as a practical balance between compactness and interpretable cluster profiles.",
      },
      {
        src: "/reports/figures/09_clustering/silhouette_scores.png",
        alt: "Silhouette scores for K-Means",
        title: "Silhouette Scores",
        finding:
          "Silhouette values remain modest across the tested K values. K=5 scores 0.164; the absence of a strong peak around the chosen solution confirms that songs occupy overlapping regions of audio-feature space.",
      },
      {
        src: "/reports/figures/09_clustering/cluster_profile_heatmap.png",
        alt: "Cluster profile heatmap",
        title: "Cluster Profile Heatmap",
        finding:
          "The profile heatmap shows five different combinations of energy, valence, acousticness, instrumentalness, liveness and other features. These profiles make the clusters understandable even though their geometric separation is not sharp.",
      },
      {
        src: "/reports/figures/09_clustering/dendrogram.png",
        alt: "Hierarchical clustering dendrogram",
        title: "Hierarchical Dendrogram",
        finding:
          "The dendrogram gives a second view of similarity by showing how observations merge at increasing distance thresholds. It supports the idea that the data has nested structure rather than one perfectly separated partition.",
      },
    ],
  },
  {
    id: "cluster-visualization",
    menuLabel: "Cluster Visualization",
    title: "Cluster Visualization Report",
    subtitle: "Two-dimensional PCA view of the five K-Means groups.",
    summary:
      "The first two PCA components explain 43.90% of total variance (28.68% + 15.22%). The 2D map is therefore useful for visual inspection, but it cannot preserve every distinction present in the original ten-dimensional feature space.",
    figures: [
      {
        src: "/reports/figures/10_cluster_visualization/pca_cluster_map.png",
        alt: "PCA cluster map",
        title: "PCA Cluster Map",
        finding:
          "The five colours form recognisable regions but also overlap. That visual overlap matches the modest silhouette scores and suggests that song profiles transition gradually rather than falling into perfectly isolated groups.",
      },
    ],
  },
];

export const REPORT_BY_ID = Object.fromEntries(
  REPORTS.map((report) => [report.id, report]),
);
