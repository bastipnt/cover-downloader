declare global {
  const dragDropCallbackFns: ((e: Event<DragDropEvent>) => void)[];
  let mockTracks: MockTrack[];
}

export type MockTrack = {
  title: string;
  album: string;
  artists: string[];
  path: string;
};
