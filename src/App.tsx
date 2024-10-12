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
          <ul className="track-list">
            {tracks.map(({ id, trackInfo }, i) => (
              <li key={id} className="track-list-item">
                <span className="track-cover">
                  {trackInfo.picture && (
                    <img src={trackInfo.picture} alt="cover-picture" />
                  )}
                </span>
                <span className="track-number">{i + 1}</span>
                <span className="track-title">{trackInfo.title}</span>
                <span className="track-album">{trackInfo.album}</span>
                <span className="track-artists">
                  {trackInfo.artists.join(", ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default App;
