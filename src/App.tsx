import { useContext, useEffect, useState } from "react";
import "./App.css";
import { DragDropEventContext } from "./providers/dragDropEventProvider";
import { TracksContext } from "./providers/tracksProvider";
import { Track } from "./types";
import useMusicbrainzApi from "./hooks/useMusicbrainzApi";

function App() {
  const [isDragOver, setIsDragOver] = useState(false);
  const { dragDropEvent } = useContext(DragDropEventContext);
  const { tracks, addTracks } = useContext(TracksContext);
  const { analyzeTrack } = useMusicbrainzApi();

  const handleDrop = async (paths: string[]) => {
    setIsDragOver(false);

    const tracks: Track[] = [];

    for (const path of paths) {
      const fileName = path.split("/").pop() || "";
      const folder = path.match(/^(.+)(?:\/)/)?.[1] || "";

      const trackInfo = await analyzeTrack(path);

      tracks.push({
        id: crypto.randomUUID(),
        trackInfo,
        fileName,
        folder,
      });
    }

    addTracks(tracks);
  };

  useEffect(() => {
    if (!dragDropEvent) return;
    // console.log(dragDropEvent);

    if (["enter", "over"].includes(dragDropEvent.payload.type))
      setIsDragOver(true);
    else if (dragDropEvent.payload.type === "leave") setIsDragOver(false);
    else if (dragDropEvent.payload.type === "drop")
      handleDrop(dragDropEvent.payload.paths);
  }, [dragDropEvent]);

  return (
    <>
      <div
        data-testid="dragArea"
        className={`dragArea ${isDragOver ? "dragOver" : ""}`}
      >
        <h1>Drop your songs here</h1>
        {tracks.length > 0 && (
          <ul>
            {tracks.map(({ id, trackInfo }) => (
              <li key={id}>
                {trackInfo.artists.join(", ")} - {trackInfo.title} -{" "}
                {trackInfo.album}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default App;
