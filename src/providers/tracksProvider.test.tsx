import { useContext, useEffect } from "react";
import { describe, expect, test } from "vitest";
import { render, screen, within } from "../../tests/helpers/test-utils";
import { Track, TrackState } from "../types.d";
import { TracksContext } from "./tracksProvider";
import {
  excludedFullInitialTrack4,
  fullInitialTrack1,
  fullInitialTrack3,
  initialMockTracks,
  notFullInitialTrack2,
} from "../../tests/data/mockTracks";

type TestProps = {
  mockTracks?: Track[];
  updatedMockTrack?: Track;
};

const TestComponent: React.FC<TestProps> = ({ mockTracks, updatedMockTrack }) => {
  const { tracks, addTracks, updateTrack } = useContext(TracksContext);

  useEffect(() => {
    if (mockTracks && mockTracks.length !== 0) addTracks(mockTracks);
    if (updatedMockTrack) updateTrack(updatedMockTrack);
  }, [mockTracks, updatedMockTrack]);

  return (
    <ul>
      {tracks.map((track) => (
        <li key={track.id}>{track.id}</li>
      ))}
    </ul>
  );
};

describe("tracksProvider", () => {
  test("default tracks are empty", () => {
    render(<TestComponent />);

    expect(screen.queryAllByRole("listitem").length).toBe(0);
  });

  test("it adds the given tracks", () => {
    render(<TestComponent mockTracks={initialMockTracks} />);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toBe(3);
    expect(within(listItems[0]).getByText(fullInitialTrack1.id));
    expect(within(listItems[1]).getByText(notFullInitialTrack2.id));
    expect(within(listItems[2]).getByText(fullInitialTrack3.id));
  });

  test("it does not add duplicates", () => {
    const component = render(<TestComponent mockTracks={initialMockTracks} />);

    const listItems1 = screen.getAllByRole("listitem");
    expect(listItems1.length).toBe(3);

    component.rerender(
      <TestComponent mockTracks={[notFullInitialTrack2, excludedFullInitialTrack4]} />
    );

    const listItems2 = screen.getAllByRole("listitem");
    expect(listItems2.length).toBe(4);
    expect(within(listItems2[0]).getByText(fullInitialTrack1.id));
    expect(within(listItems2[1]).getByText(notFullInitialTrack2.id));
    expect(within(listItems2[2]).getByText(fullInitialTrack3.id));
    expect(within(listItems2[3]).getByText(excludedFullInitialTrack4.id));
  });

  test("it does not add tracks when TackState=UPDATING", () => {
    const component = render(<TestComponent mockTracks={initialMockTracks} />);

    const listItems1 = screen.getAllByRole("listitem");
    expect(listItems1.length).toBe(3);

    const updatingFullInitialTrack1: Track = { ...fullInitialTrack1, state: TrackState.UPDATING };

    component.rerender(<TestComponent updatedMockTrack={updatingFullInitialTrack1} />);
    component.rerender(<TestComponent mockTracks={[excludedFullInitialTrack4]} />);

    const listItems2 = screen.getAllByRole("listitem");
    expect(listItems2.length).toBe(3);
  });
});
