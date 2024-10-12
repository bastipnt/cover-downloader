import { useContext, useEffect, useState } from "react";
import "./App.css";
import { DragDropEventContext } from "./providers/dragDropEventProvider";
import { TracksContext } from "./providers/tracksProvider";
import { Track } from "./types";

function App() {
  const [isDragOver, setIsDragOver] = useState(false);
  const { dragDropEvent } = useContext(DragDropEventContext);
  const { tracks, addTracks } = useContext(TracksContext);

  const handleDrop = (paths: string[]) => {
    console.log(paths);
    const tracks = paths.map<Track>((path) => ({
      id: crypto.randomUUID(),
      path,
      trackInfo: {},
    }));
    addTracks(tracks);
    setIsDragOver(false);
  };

  useEffect(() => {
    if (!dragDropEvent) return;

    if (["enter", "over"].includes(dragDropEvent.payload.type))
      setIsDragOver(true);
    else if (dragDropEvent.payload.type === "leave") setIsDragOver(false);
    else if (dragDropEvent.payload.type === "drop")
      handleDrop(dragDropEvent.payload.paths);
  }, [dragDropEvent]);

  return (
    <>
      <div className={`dragArea ${isDragOver ? "dragOver" : ""}`}>
        <h1>Drop your songs here</h1>
        {tracks.length > 0 && (
          <ul>
            {tracks.map((track) => (
              <li key={track.id}>{track.path}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default App;
