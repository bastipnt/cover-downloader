import { ReactNode, createContext, useState } from "react";
import { Track, UpdatedTrackInfo } from "../types";

export const TracksContext = createContext<{
  tracks: Track[];
  addTracks: (tracks: Track[]) => void;
  updateTrack: (trackId: string, updatedTrackInfo: UpdatedTrackInfo) => void;
  clearTracks: () => void;
}>({
  tracks: [],
  addTracks: () => {},
  updateTrack: () => {},
  clearTracks: () => {},
});

type Props = {
  children: ReactNode;
};

const TracksProvider: React.FC<Props> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>([]);

  const addTracks = (newTracks: Track[]) =>
    setTracks((prevTracks) => [...prevTracks, ...newTracks]);

  const clearTracks = () => setTracks([]);

  const updateTrack = (trackId: string, updatedTrackInfo: UpdatedTrackInfo) => {
    const trackIndex = tracks.findIndex(({ id }) => id === trackId);
    if (trackIndex === -1) return;

    setTracks((oldTracks) => {
      const updatedTracks = [...oldTracks];

      updatedTracks[trackIndex].updatedTrackInfo = updatedTrackInfo;

      return updatedTracks;
    });
  };

  return (
    <TracksContext.Provider
      value={{
        tracks,
        addTracks,
        updateTrack,
        clearTracks,
      }}
    >
      {children}
    </TracksContext.Provider>
  );
};

export default TracksProvider;
