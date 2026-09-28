export const FEATURE_HELP = {
  danceability: {
    label: "Danceability",
    text: "How suitable the track feels for dancing. Input range: 0.00–1.00. 0 = least danceable; 1 = most danceable.",
  },
  energy: {
    label: "Energy",
    text: "Perceived intensity and activity of the track. Input range: 0.00–1.00. 0 = calm/low-energy; 1 = intense/high-energy.",
  },
  valence: {
    label: "Valence",
    text: "Musical positivity. Input range: 0.00–1.00. 0 = more negative/sad; 1 = more positive/happy. MoodWave uses 0.50 as the low/high mood-label threshold.",
  },
  acousticness: {
    label: "Acousticness",
    text: "Confidence that the track is acoustic. Input range: 0.00–1.00. Higher values mean the track is more likely to be acoustic.",
  },
  instrumentalness: {
    label: "Instrumentalness",
    text: "Likelihood that the track contains little or no vocal content. Input range: 0.00–1.00. Higher values indicate a more instrumental track.",
  },
  liveness: {
    label: "Liveness",
    text: "Likelihood that the recording contains a live audience or live-performance character. Input range: 0.00–1.00. Higher values mean stronger evidence of liveness.",
  },
  speechiness: {
    label: "Speechiness",
    text: "Amount of spoken-word content detected in the track. Input range: 0.00–1.00. Higher values indicate more speech-like content.",
  },
  loudness: {
    label: "Loudness",
    text: "Overall track loudness in dB. Use the track's measured value. MoodWave's historical popularity data spans about -21.11 to -0.28 dB; the genre/clustering data spans about -49.53 to +4.53 dB, with its middle 50% around -10.00 to -5.00 dB.",
  },
  tempo: {
    label: "Tempo",
    text: "Estimated speed of the track in beats per minute (BPM). Use the measured BPM. In MoodWave's genre/clustering data, the middle 50% is about 99–140 BPM; unusual values far outside the training distribution can produce unusual model outputs.",
  },
  duration_ms: {
    label: "Duration",
    text: "Track length in milliseconds. Example: 213000 ms = 3:33. In MoodWave's genre/clustering data, the middle 50% of tracks is roughly 174000–262000 ms (about 2:54–4:22), although longer and shorter tracks exist.",
  },
  key: {
    label: "Key",
    text: "Estimated musical key as a pitch-class number. Supported values: 0–11. 0=C, 1=C#/Db, 2=D, ... 11=B.",
  },
  mode: {
    label: "Mode",
    text: "Major/minor tonality of the track. Supported values: 0 = Minor, 1 = Major.",
  },
  time_signature: {
    label: "Time signature",
    text: "Estimated beats per bar. MoodWave's control supports 1–7 beats per bar; 4 beats per bar is the common 4/4 case.",
  },
};

export function getFeatureHelp(feature) {
  return FEATURE_HELP[feature] || {
    label: feature.replace(/_/g, " "),
    text: "Audio feature used by the selected MoodWave model.",
  };
}
