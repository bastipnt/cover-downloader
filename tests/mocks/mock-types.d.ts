declare global {
  const dragDropCallbackFns: ((e: Event<DragDropEvent>) => void)[];
  let mockTracks: MockTrack[];
  let mockOnlineTracks: MockOnlineTrack[];
}

export type MockTrack = {
  title: string;
  album?: string;
  artists: string[];
  path: string;
};

export type MockOnlineTrack = {
  title: string;
  album?: string;
  artists: string[];
  pictureUrl?: string;
};
