import { useRef, useState } from "react";
import TrackCard from "./TrackCard";

// TODO make this not expect trackcard and instead just wrap around children.

export default function DraggableTrackGrid({ entries, onQueue }) {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);

  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = x - startX;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 gap-2 max-h-[50.5vh] overflow-auto mb-4 bg-slate-500 px-2 py-2 rounded-sm cursor-grab"
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      {entries?.map((t) => (
        <TrackCard key={t.id} track={t} onQueue={onQueue} />
      ))}
      {!entries?.length && <p className="text-gray-400">No entries found</p>}
    </div>
  );
}
