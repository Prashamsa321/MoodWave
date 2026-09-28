import { getFeatureHelp } from "./featureHelp";

export default function FeatureHelpLabel({ feature, htmlFor, label }) {
  const help = getFeatureHelp(feature);
  const tooltipId = `${htmlFor || `feature-${feature}`}-help`;

  return (
    <span className="win98-feature-help" tabIndex={0} aria-describedby={tooltipId}>
      <label className="win98-feature-label" htmlFor={htmlFor}>
        {label || help.label}
      </label>
      <span className="win98-feature-help-mark" aria-hidden="true">?</span>
      <span id={tooltipId} className="win98-feature-tooltip" role="tooltip">
        {help.text}
      </span>
    </span>
  );
}
