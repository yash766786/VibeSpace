// hooks/useSocketEvent.js
import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";

/**
 * Reusable hook to subscribe/unsubscribe to socket events
 * @param {string} event - The event name to listen for
 * @param {function} handler - Callback to run on event trigger
 */
export const useSocketEvent = (event, handler) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !event || !handler) return;

    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
  }, [socket, event, handler]);
};
