import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import DragDropEventProvider from "../../src/providers/dragDropEventProvider";
import TracksProvider from "../../src/providers/tracksProvider";

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <DragDropEventProvider>
      <TracksProvider>{children}</TracksProvider>
    </DragDropEventProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
