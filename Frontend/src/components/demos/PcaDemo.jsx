import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const CLUSTER_COLORS = ["#000080", "#008080", "#800000", "#008000", "#808000"];

export default function PcaDemo({ result, clusters }) {
  if (!result || result.pca_1 == null || result.pca_2 == null) return null;

  const queryPoint = [{ x: result.pca_1, y: result.pca_2 }];
  const clusterGroups = {};

  if (clusters?.points) {
    clusters.points.forEach((point) => {
      const id = point.cluster_id ?? 0;
      if (!clusterGroups[id]) clusterGroups[id] = [];
      clusterGroups[id].push({ x: point.pca_1 ?? 0, y: point.pca_2 ?? 0 });
    });
  }

  return (
    <div className="win98-result-panel">
      <div className="win98-pca-header">
        <div className="win98-result-label">PCA position</div>
        <div className="win98-value-box">
          ({result.pca_1.toFixed(2)}, {result.pca_2.toFixed(2)})
        </div>
      </div>

      <div className="win98-chart-frame">
        {clusters?.points ? (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 12, right: 16, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#c0c0c0" />
              <XAxis
                type="number"
                dataKey="x"
                stroke="#000000"
                tick={{ fontSize: 10, fill: "#000000" }}
              />
              <YAxis
                type="number"
                dataKey="y"
                stroke="#000000"
                tick={{ fontSize: 10, fill: "#000000" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffe1",
                  border: "1px solid #000000",
                  borderRadius: 0,
                  fontSize: 11,
                  fontFamily: "MS Sans Serif, Tahoma, sans-serif",
                }}
              />
              {Object.entries(clusterGroups).map(([id, points]) => (
                <Scatter
                  key={id}
                  data={points}
                  fill={CLUSTER_COLORS[Number(id) % CLUSTER_COLORS.length]}
                  opacity={0.35}
                  isAnimationActive={false}
                />
              ))}
              <Scatter
                name="Your song"
                data={queryPoint}
                fill="#ff0000"
                shape={({ cx, cy }) => (
                  <g>
                    <rect
                      x={cx - 6}
                      y={cy - 6}
                      width={12}
                      height={12}
                      fill="#ff0000"
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  </g>
                )}
                isAnimationActive={false}
              />
            </ScatterChart>
          </ResponsiveContainer>
        ) : (
          <div className="win98-output-placeholder">Cluster-map data is not loaded.</div>
        )}
      </div>

      <div className="win98-result-note">
        The red square marks the submitted track; the other points show songs from the
        learned clusters in PCA space.
      </div>
    </div>
  );
}
