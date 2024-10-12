import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import DragDropEventProvider from "./providers/dragDropEventProvider.tsx";
import TracksProvider from "./providers/tracksProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DragDropEventProvider>
      <TracksProvider>
        <App />
      </TracksProvider>
    </DragDropEventProvider>
  </StrictMode>
);
