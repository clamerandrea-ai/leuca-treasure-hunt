interface CompassProps {
  bearing: number;
  distanceText: string;
}

export function Compass({ bearing, distanceText }: CompassProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-gold/30 bg-sea-dark/50" />
        <div
          className="absolute inset-2 flex items-start justify-center"
          style={{ transform: `rotate(${bearing}deg)` }}
        >
          <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[24px] border-l-transparent border-r-transparent border-b-gold-bright drop-shadow-lg" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-gold" />
        </div>
      </div>
      <span className="text-gold text-sm font-medium">{distanceText}</span>
    </div>
  );
}
