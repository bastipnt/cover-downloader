import { ReactNode, createContext, useState } from "react";
import { Track } from "../types";

export const TracksContext = createContext<{
  tracks: Track[];
  addTracks: (tracks: Track[]) => void;
  clearTracks: () => void;
}>({
  tracks: [],
  addTracks: () => {},
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

  return (
    <TracksContext.Provider
      value={{
        tracks,
        addTracks,
        clearTracks,
      }}
    >
      {children}
    </TracksContext.Provider>
  );
};

export default TracksProvider;
