export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold">🌊 Moodwave Dashboard</h1>

      <p className="text-slate-400 mt-2">
        Discover music through emotion and analytics.
      </p>

      <div className="grid grid-cols-4 gap-6 mt-8">
        <div className="bg-slate-900 rounded-xl p-6">
          <h3 className="text-slate-400">Total Songs</h3>
          <h1 className="text-3xl font-bold">600K+</h1>
        </div>

        <div className="bg-slate-900 rounded-xl p-6">
          <h3 className="text-slate-400">Genres</h3>
          <h1 className="text-3xl font-bold">23</h1>
        </div>

        <div className="bg-slate-900 rounded-xl p-6">
          <h3 className="text-slate-400">Avg Energy</h3>
          <h1 className="text-3xl font-bold">0.68</h1>
        </div>

        <div className="bg-slate-900 rounded-xl p-6">
          <h3 className="text-slate-400">Avg Valence</h3>
          <h1 className="text-3xl font-bold">0.54</h1>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl mt-8 p-8 h-80">
        Chart Area
      </div>
    </div>
  );
}