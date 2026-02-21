function secondsToMinutes(seconds) {
  if (!seconds) return "Unknown";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function TrackCard({ track, onQueue }) {
  return (
    <div className="flex justify-between items-center p-4 bg-slate-50 shadow rounded hover:shadow-md transition">
      <div>
        <h2 className="font-semibold">{track.title}</h2>
        <p className="text-gray-500">
          {track.artist} || Length:{" "}
          {secondsToMinutes(track.audio_features.duration_seconds)}
          {track.genres && track.genres.length > 0 && (
            <>
              {" || Genre: "}
              {track.genres.slice(0, 2).join(" / ")}
            </>
          )}
        </p>

        {track.album && <p className="text-gray-400 text-sm">{track.album}</p>}
      </div>
      <button
        onClick={() => onQueue(track)}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Queue
      </button>
    </div>
  );
}
