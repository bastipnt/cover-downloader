import { Event } from "@tauri-apps/api/event";
import { DragDropEvent } from "@tauri-apps/api/webviewWindow";
import { ReactNode, createContext, useEffect, useState } from "react";
import { getCurrentWebview } from "@tauri-apps/api/webview";

const currentWebview = getCurrentWebview();

export const DragDropEventContext = createContext<{
  dragDropEvent?: Event<DragDropEvent>;
}>({});

type Props = {
  children: ReactNode;
};

const DragDropEventProvider: React.FC<Props> = ({ children }) => {
  const [dragDropEvent, setDragDropEvent] = useState<Event<DragDropEvent>>();

  useEffect(() => {
    const unlisten = currentWebview.onDragDropEvent((e) => {
      setDragDropEvent(e);
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  return (
    <DragDropEventContext.Provider value={{ dragDropEvent }}>
      {children}
    </DragDropEventContext.Provider>
  );
};

export default DragDropEventProvider;
