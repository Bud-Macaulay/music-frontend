import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import Queue from "./components/Queue";
import DraggableTrackGrid from "./components/DraggableTrackGrid";

const API_BASE = "http://127.0.0.1:8000";

function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function App() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [queue, setQueue] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/stats`);
      return res.data;
    },
  });

  // Fetch tracks
  const { data: tracks } = useQuery({
    queryKey: ["tracks", debouncedSearch],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/tracks`, {
        params: { query: debouncedSearch, limit: 200 },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const addToQueue = (track) => {
    setQueue((q) => [...q, track]);
    if (!currentTrack) {
      setCurrentTrack(track);
      setQueue((q) => q.slice(1));
    }
  };

  const playNext = () => {
    if (queue.length === 0) return;
    setCurrentTrack(queue[0]);
    setQueue((q) => q.slice(1));
  };

  return (
    <div className="min-h-screen bg-slate-300 p-4">
      <input
        type="text"
        placeholder="Search tracks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 bg-slate-100 rounded-sm shadow-md"
      />

      <DraggableTrackGrid entries={tracks} onQueue={addToQueue} />

      <Queue queue={queue} setQueue={setQueue} playNext={playNext} />

      {currentTrack && (
        <div className="mt-4">
          <h2 className="font-semibold">Now Playing: {currentTrack.title}</h2>
          <AudioPlayer
            src={`${API_BASE}/tracks/file/${currentTrack.music_id}`}
            onEnded={playNext}
            autoPlay
          />
        </div>
      )}
    </div>
  );
}
