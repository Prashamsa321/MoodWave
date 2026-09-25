export default function FeatureSlider({
    feature,
    value,
    onChange,
    compact = false,
  }) {
    const config = {
      danceability:     { min: 0,  max: 1,    step: 0.01 },
      energy:           { min: 0,  max: 1,    step: 0.01 },
      valence:          { min: 0,  max: 1,    step: 0.01 },
      acousticness:     { min: 0,  max: 1,    step: 0.01 },
      instrumentalness: { min: 0,  max: 1,    step: 0.01 },
      liveness:         { min: 0,  max: 1,    step: 0.01 },
      speechiness:      { min: 0,  max: 1,    step: 0.01 },
      loudness:         { min: -60, max: 0,   step: 0.5 },
      tempo:            { min: 40, max: 220,  step: 1 },
      duration_ms:      { min: 30000, max: 600000, step: 1000 },
      time_signature:   { min: 1,  max: 7,    step: 1 },
      key:              { min: 0,  max: 11,   step: 1 },
      mode:             { min: 0,  max: 1,    step: 1 },
    }[feature] || { min: 0, max: 1, step: 0.01 };
  
    const displayValue =
      config.step < 1
        ? Number(value).toFixed(2)
        : feature === "duration_ms"
        ? `${(value / 60000).toFixed(1)}m`
        : Number(value).toFixed(0);
  
    return (
      <div className={compact ? "mb-2" : "mb-3"}>
        <div className="flex justify-between text-xs mb-1">
          <span className="capitalize">{feature.replace(/_/g, " ")}</span>
          <span className="font-mono text-purple-700">{displayValue}</span>
        </div>
        <input
          type="range"
          min={config.min}
          max={config.max}
          step={config.step}
          value={value}
          onChange={(e) => onChange(feature, Number(e.target.value))}
          className="retro-slider"
        />
      </div>
    );
  }