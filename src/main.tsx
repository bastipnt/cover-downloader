import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import DragDropEventProvider from "./providers/dragDropEventProvider.tsx";
import TracksProvider from "./providers/tracksProvider.tsx";

// const addListeners = async () => {
//   await getCurrentWebview().onDragDropEvent((event) => {
//     console.log(event);

//     // if (event.payload.type === "hover") {
//     //   console.log("User hovering", event.payload.paths);
//     // } else if (event.payload.type === "drop") {
//     //   console.log("User dropped", event.payload.paths);
//     // } else {
//     //   console.log("File drop cancelled");
//     // }
//   });
// };

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DragDropEventProvider>
      <TracksProvider>
        <App />
      </TracksProvider>
    </DragDropEventProvider>
  </StrictMode>
);
