import { getLeaderboard } from '../utils/storage';

export function Leaderboard() {
  const entries = getLeaderboard();

  if (entries.length === 0) {
    return (
      <div className="text-sand/40 text-sm text-center py-4">
        Nessun risultato ancora. Sii il primo!
      </div>
    );
  }

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-2">
      <h3 className="text-gold font-bold text-sm uppercase tracking-wider text-center">
        Classifica
      </h3>
      <div className="space-y-1">
        {entries.map((entry, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-sea-medium/50 rounded-lg px-3 py-2 text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-gold font-bold w-5 text-right">
                {i + 1}.
              </span>
              <span className="text-sand">{entry.teamName}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gold-bright font-mono text-xs">
                {entry.score} pt
              </span>
              <span className="text-sand/50 font-mono text-xs">
                {formatTime(entry.totalTime)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
