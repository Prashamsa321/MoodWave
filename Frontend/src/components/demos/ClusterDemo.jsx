export default function ClusterDemo({ result }) {
  if (!result) return null;

  const clusterId = result.cluster_id ?? 0;
  const profile = result.profile || result.cluster_profile;

  return (
    <div className="win98-result-panel">
      <div className="win98-result-label">Assigned cluster</div>
      <div className="win98-inset-display win98-result-heading">
        Cluster {clusterId}
      </div>

      <div className="win98-properties-box">
        {profile?.description && (
          <div className="win98-property-row">
            <strong>Profile:</strong>
            <span>{profile.description}</span>
          </div>
        )}

        {profile?.common_genres && (
          <div className="win98-property-row">
            <strong>Common genres:</strong>
            <span>{profile.common_genres}</span>
          </div>
        )}

        {profile?.track_count && (
          <div className="win98-property-row">
            <strong>Tracks:</strong>
            <span>{profile.track_count.toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}
