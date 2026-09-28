import { useEffect, useRef, useState } from "react";
import FeatureHelpLabel from "../FeatureHelpLabel";

const KEY_OPTIONS = [
  [0, "C"],
  [1, "C# / Db"],
  [2, "D"],
  [3, "D# / Eb"],
  [4, "E"],
  [5, "F"],
  [6, "F# / Gb"],
  [7, "G"],
  [8, "G# / Ab"],
  [9, "A"],
  [10, "A# / Bb"],
  [11, "B"],
].map(([value, label]) => ({ value, label }));

const FEATURE_CONFIG = {
  danceability: {
    control: "slider",
    label: "Danceability",
    min: 0,
    max: 1,
    step: 0.01,
  },
  energy: {
    control: "slider",
    label: "Energy",
    min: 0,
    max: 1,
    step: 0.01,
  },
  valence: {
    control: "slider",
    label: "Valence",
    min: 0,
    max: 1,
    step: 0.01,
  },
  acousticness: {
    control: "slider",
    label: "Acousticness",
    min: 0,
    max: 1,
    step: 0.01,
  },
  instrumentalness: {
    control: "slider",
    label: "Instrumentalness",
    min: 0,
    max: 1,
    step: 0.01,
  },
  liveness: {
    control: "slider",
    label: "Liveness",
    min: 0,
    max: 1,
    step: 0.01,
  },
  speechiness: {
    control: "slider",
    label: "Speechiness",
    min: 0,
    max: 1,
    step: 0.01,
  },

  // These values are continuous measurements rather than naturally bounded
  // 0..1 scores. A classic edit field is a better control than pretending the
  // model has a hard minimum/maximum for them.
  loudness: {
    control: "number",
    label: "Loudness",
    step: 0.1,
    unit: "dB",
    placeholder: "e.g. -6.2",
  },
  tempo: {
    control: "number",
    label: "Tempo",
    step: 0.1,
    unit: "BPM",
    placeholder: "e.g. 124.5",
  },
  duration_ms: {
    control: "number",
    label: "Duration",
    step: 1000,
    integer: true,
    unit: "ms",
    placeholder: "e.g. 213000",
  },

  // Discrete/categorical values use a Win98-style combo box rather than a
  // trackbar. The numeric value sent to the API remains unchanged.
  key: {
    control: "select",
    label: "Key",
    options: KEY_OPTIONS,
  },
  mode: {
    control: "select",
    label: "Mode",
    options: [
      { value: 0, label: "Minor" },
      { value: 1, label: "Major" },
    ],
  },
  time_signature: {
    control: "select",
    label: "Time signature",
    options: Array.from({ length: 7 }, (_, index) => {
      const beats = index + 1;
      return {
        value: beats,
        label: `${beats} beat${beats === 1 ? "" : "s"} / bar`,
      };
    }),
  },
};

function formatSliderValue(value, step) {
  if (step < 1) return Number(value).toFixed(2);
  return Number(value).toFixed(0);
}

function formatDuration(milliseconds) {
  const totalSeconds = Math.max(0, Math.round(Number(milliseconds || 0) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function FeatureSlider({ feature, value, onChange }) {
  const config = FEATURE_CONFIG[feature] || {
    control: "number",
    label: feature.replace(/_/g, " "),
    step: 0.01,
  };
  const id = `feature-${feature}`;

  const [draftValue, setDraftValue] = useState(String(value ?? ""));
  const isEditingRef = useRef(false);

  // Keep the editable string separate from the numeric model value. While the
  // user is typing, parent updates must NOT overwrite the draft or the browser
  // will move/reset the caret (and values such as "124." become impossible to
  // finish typing). We only resync from props when the field is not being edited.
  useEffect(() => {
    if (!isEditingRef.current) {
      setDraftValue(String(value ?? ""));
    }
  }, [value]);

  if (config.control === "slider") {
    return (
      <div className="win98-feature-control">
        <div className="win98-feature-label-row">
          <FeatureHelpLabel feature={feature} htmlFor={id} label={config.label} />
          <output className="win98-value-box" htmlFor={id}>
            {formatSliderValue(value, config.step)}
          </output>
        </div>

        <div className="win98-trackbar-row">
          <span className="win98-slider-edge">{config.min}</span>
          <input
            id={id}
            type="range"
            min={config.min}
            max={config.max}
            step={config.step}
            value={value}
            onChange={(event) => onChange(feature, Number(event.target.value))}
            className="retro-slider win98-trackbar"
          />
          <span className="win98-slider-edge">{config.max}</span>
        </div>
      </div>
    );
  }

  if (config.control === "select") {
    return (
      <div className="win98-feature-control win98-field-control">
        <FeatureHelpLabel feature={feature} htmlFor={id} label={config.label} />
        <select
          id={id}
          className="win98-combo-box"
          value={value}
          onChange={(event) => onChange(feature, Number(event.target.value))}
        >
          {config.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  const parseDraft = (rawValue) => {
    const trimmed = rawValue.trim();

    // These are useful intermediate states while typing, but they are not
    // complete numbers yet. Leave them in the edit box until blur/Enter.
    if (!trimmed || trimmed === "-" || trimmed === "+" || trimmed === "." ||
        trimmed === "-." || trimmed === "+.") {
      return null;
    }

    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed)) return null;
    return config.integer ? Math.round(parsed) : parsed;
  };

  const commitDraft = (rawValue, { normalize = false } = {}) => {
    const parsed = parseDraft(rawValue);
    if (parsed == null) return false;

    onChange(feature, parsed);
    if (normalize) setDraftValue(String(parsed));
    return true;
  };

  return (
    <div className="win98-feature-control win98-field-control">
      <FeatureHelpLabel feature={feature} htmlFor={id} label={config.label} />

      <div className="win98-edit-row">
        <input
          id={id}
          type="text"
          inputMode={config.integer ? "numeric" : "decimal"}
          className="win98-edit-field"
          value={draftValue}
          placeholder={config.placeholder}
          autoComplete="off"
          spellCheck={false}
          onFocus={() => {
            isEditingRef.current = true;
          }}
          onChange={(event) => {
            const nextValue = event.target.value;

            // Always preserve exactly what the user typed locally. If it is
            // already a valid number we may also update the model state, but
            // the prop-sync effect above is intentionally suspended while the
            // field has focus so it cannot steal/reset the caret.
            setDraftValue(nextValue);
            commitDraft(nextValue);
          }}
          onBlur={() => {
            isEditingRef.current = false;

            // Invalid/incomplete input reverts to the last accepted model value.
            // Valid input is normalized once editing is finished.
            if (!commitDraft(draftValue, { normalize: true })) {
              setDraftValue(String(value ?? ""));
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              event.currentTarget.blur();
            }

            if (event.key === "Escape") {
              event.preventDefault();
              setDraftValue(String(value ?? ""));
              event.currentTarget.blur();
            }
          }}
        />
        {config.unit && <span className="win98-input-unit">{config.unit}</span>}
      </div>

      {feature === "duration_ms" && (
        <div className="win98-field-hint">Current duration: {formatDuration(value)}</div>
      )}
    </div>
  );
}
