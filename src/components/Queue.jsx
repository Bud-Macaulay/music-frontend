import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// simople Queue manager from hello-pangea example

export default function Queue({ queue, setQueue }) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newQueue = Array.from(queue);
    const [moved] = newQueue.splice(result.source.index, 1);
    newQueue.splice(result.destination.index, 0, moved);
    setQueue(newQueue);
  };

  const removeTrack = (index) => {
    setQueue((q) => q.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Queue</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="queue">
          {(provided) => (
            <div
              className="space-y-2 max-h-[20vh] bg-slate-500 overflow-auto py-1.5 px-1 rounded-sm shadow"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {queue.map((track, index) => (
                <Draggable
                  key={track.music_id}
                  draggableId={track.music_id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`p-2 bg-slate-50 rounded-xs shadow flex justify-between items-center ${
                        snapshot.isDragging ? "bg-gray-200" : ""
                      }`}
                    >
                      <span>
                        {track.title} — {track.artist}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => removeTrack(index)}
                          className="px-2 bg-red-200 rounded"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {!queue.length && <p className="text-gray-400">Queue is empty</p>}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
