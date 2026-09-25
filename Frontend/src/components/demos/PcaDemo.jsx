import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
  } from "recharts";
  
  const CLUSTER_COLORS = ["#8b5cf6", "#22c55e", "#ef4444", "#3b82f6", "#f59e0b"];
  
  export default function PcaDemo({ result, clusters }) {
    if (!result || !result.pca_1) {
      return (
        <div className="text-xs text-purple-600 italic">
          Click "Predict" to see the position on the cluster map.
        </div>
      );
    }
  
    const queryPoint = [{ x: result.pca_1, y: result.pca_2 }];
  
    const clusterGroups = {};
    if (clusters?.points) {
      clusters.points.forEach((p) => {
        const id = p.cluster_id ?? 0;
        if (!clusterGroups[id]) clusterGroups[id] = [];
        clusterGroups[id].push({ x: p.pca_1 ?? 0, y: p.pca_2 ?? 0 });
      });
    }
  
    return (
      <div className="bg-white border-2 border-slate-900 rounded p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs font-bold text-purple-700">
            PCA Position — where your song lands
          </div>
          <div className="text-xs font-mono bg-purple-100 px-2 py-0.5 rounded">
            ({result.pca_1.toFixed(2)}, {result.pca_2.toFixed(2)})
          </div>
        </div>
  
        {clusters?.points && (
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#d0c8e0" />
              <XAxis
                type="number"
                dataKey="x"
                stroke="#6b5b95"
                tick={{ fontSize: 10 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                stroke="#6b5b95"
                tick={{ fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fdfbff",
                  border: "2px solid #7c5cbf",
                  borderRadius: 6,
                  fontSize: 11,
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
                    fill="#ff006e"
                    shape={(props) => {
                        const { cx, cy } = props;
                        return (
                        <g>
                            <circle cx={cx} cy={cy} r={10} fill="#ff006e" opacity={0.3} />
                            <circle cx={cx} cy={cy} r={5} fill="#ff006e" stroke="#fff" strokeWidth={2} />
                        </g>
                        );
                    }}
                    isAnimationActive={false}
                    />
            </ScatterChart>
          </ResponsiveContainer>
        )}
  
        <div className="text-[10px] text-purple-700 mt-2 italic text-center">
         Red marked = it shows where your song located in the PCA space, while the other points represent the clusters of songs in the dataset.
        </div>
      </div>
    );
  }