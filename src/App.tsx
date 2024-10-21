import { useContext, useEffect, useState } from "react";
import "./App.css";
import { DragDropEventContext } from "./providers/dragDropEventProvider";
import { TracksContext } from "./providers/tracksProvider";
import { Track, TrackState } from "./types.d";
import useMusicbrainzApi from "./hooks/useMusicbrainzApi";
import useUpdateTrackLocally from "./hooks/useUpdateTrackLocally";

function App() {
  const [isDragOver, setIsDragOver] = useState(false);
  const { dragDropEvent } = useContext(DragDropEventContext);
  const { tracks, addTracks, updateTrack } = useContext(TracksContext);
  const { analyzeTrack, getOnlineTrackInfo } = useMusicbrainzApi();
  const { downloadTrackInfo, updateTrackLocally } = useUpdateTrackLocally();

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
        state: TrackState.INITIAL,
      });
    }

    addTracks(tracks);
  };

  const handleGetOnlineInfo = async () => {
    for (const track of tracks) {
      const updatedTrackInfo = await getOnlineTrackInfo(track.trackInfo);

      if (!updatedTrackInfo) continue;

      const updatedTrack: Track = { ...track, updatedTrackInfo };
      updateTrack(updatedTrack);
    }
  };

  const handleDownloadTrackInfo = async () => {
    for (const track of tracks) {
      const isUpdated = await downloadTrackInfo(track);
      const res = await updateTrackLocally(track);

      // console.log({ res });

      if (!isUpdated) continue;
      const updatedTrack: Track = { ...track, state: TrackState.FINISHED };
      updateTrack(updatedTrack);
    }
  };

  useEffect(() => {
    if (!dragDropEvent) return;

    if (["enter", "over"].includes(dragDropEvent.payload.type)) setIsDragOver(true);
    else if (dragDropEvent.payload.type === "leave") setIsDragOver(false);
    else if (dragDropEvent.payload.type === "drop") handleDrop(dragDropEvent.payload.paths);
  }, [dragDropEvent]);

  return (
    <>
      <div data-testid="dragArea" className={`dragArea ${isDragOver ? "dragOver" : ""}`}>
        <h1>Drop your songs here</h1>
        <button onClick={handleGetOnlineInfo}>Get online info</button>
        <button onClick={handleDownloadTrackInfo}>Update Track</button>
        {tracks.length > 0 && (
          <ul className="track-list">
            {tracks.map(({ id, trackInfo, updatedTrackInfo, state }, i) => (
              <li key={id} className="track-list-item">
                <span className="track-cover">
                  {trackInfo.picture ? (
                    <img src={trackInfo.picture} alt={`cover picture - ${trackInfo.title}`} />
                  ) : (
                    updatedTrackInfo?.coverArtUri && (
                      <img
                        src={updatedTrackInfo.coverArtUri}
                        alt={`cover picture - ${trackInfo.title}`}
                      />
                    )
                  )}
                </span>
                <span className="track-number">{i + 1}</span>
                <span className="track-title">{updatedTrackInfo?.title || trackInfo.title}</span>
                <span className="track-album">{updatedTrackInfo?.album || trackInfo.album}</span>
                <span className="track-artists">
                  {updatedTrackInfo?.artists
                    ? updatedTrackInfo.artists.join(", ")
                    : trackInfo.artists.join(", ")}
                </span>
                {state === TrackState.FINISHED && (
                  <span data-testid={TrackState.FINISHED} className={TrackState.FINISHED}>
                    ✅
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default App;
