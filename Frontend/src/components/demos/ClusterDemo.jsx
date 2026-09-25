const CLUSTER_COLORS = ["#8b5cf6", "#22c55e", "#ef4444", "#3b82f6", "#f59e0b"];

export default function ClusterDemo({ result }) {
  if (!result) {
    return (
      <div className="text-xs text-purple-600 italic">
        Click "Predict" to see the cluster assignment.
      </div>
    );
  }

  const cid = result.cluster_id ?? 0;
  const color = CLUSTER_COLORS[cid % CLUSTER_COLORS.length];
  const profile = result.profile || result.cluster_profile;

  return (
    <div className="bg-white border-2 border-slate-900 rounded p-4">
      <div className="text-xs opacity-60 mb-3">Assigned Cluster</div>

      {/* Main message */}
      <div className="mb-3">
        <span className="text-base">
          Your song lies in{" "}
        </span>
        <span
          className="text-lg font-bold"
          style={{ color }}
        >
          Cluster {cid}
        </span>
      </div>

      {/* Description */}
      {profile?.description && (
        <div className="text-sm mb-2">
          <span className="font-bold text-purple-700">Profile: </span>
          {profile.description}
        </div>
      )}

      {/* Common genres */}
      {profile?.common_genres && (
        <div className="text-sm mb-3">
          <span className="font-bold text-purple-700">Common genres: </span>
          {profile.common_genres}
        </div>
      )}

      {/* Track count */}
      {profile?.track_count && (
        <div className="text-xs bg-purple-100 border border-purple-300 rounded px-3 py-2">
          This cluster contains{" "}
          <strong>{profile.track_count.toLocaleString()}</strong> songs from
          the dataset.
        </div>
      )}
    </div>
  );
}