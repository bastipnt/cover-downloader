import { ReactNode, createContext, useState } from "react";
import { Track, TrackState } from "../types.d";

export const TracksContext = createContext<{
  tracks: Track[];
  addTracks: (tracks: Track[]) => void;
  updateTrack: (updatedTrack: Track) => void;
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
    setTracks((oldTracks) => {
      if (oldTracks.some(({ state }) => state === TrackState.UPDATING)) return oldTracks;

      return newTracks.reduce((prevTracks, currentTrack) => {
        const { folder: fol, fileName: fiN } = currentTrack;

        if (prevTracks.some(({ folder, fileName }) => fiN === fileName && fol === folder))
          return prevTracks;

        return [...prevTracks, currentTrack];
      }, oldTracks);
    });

  const clearTracks = () => setTracks([]);

  const updateTrack = (updatedTrack: Track) => {
    const trackIndex = tracks.findIndex(({ id }) => id === updatedTrack.id);
    if (trackIndex === -1) return;

    setTracks((tracks) => {
      const updatedTracks = [...tracks];

      updatedTracks[trackIndex] = updatedTrack;

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
