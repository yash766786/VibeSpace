// // src/context/SocketContext.jsx
// import { createContext, useContext, useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";
// import { conf } from "../conf/conf.js";

// const SocketContext = createContext(null);

// export const useSocket = () => useContext(SocketContext);

// export const SocketProvider = ({ children }) => {
//   const socketRef = useRef(null);
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     socketRef.current = io(conf.server2Socket, {
//       withCredentials: true, // allows cookies to be sent for JWT auth
//     });

//     socketRef.current.on("connect", () => {
//       console.log("✅ Socket connected:", socketRef.current.id);
//       setIsConnected(true);
//     });

//     socketRef.current.on("disconnect", () => {
//       console.log("❌ Socket disconnected");
//       setIsConnected(false);
//     });

//     return () => {
//       socketRef.current.disconnect();
//     };
//   }, []);

//   return (
//     <SocketContext.Provider value={socketRef.current}>
//       {children}
//     </SocketContext.Provider>
//   );
// };



import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { conf } from "../conf/conf.js";

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within a SocketProvider");
  return context;
};

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socketInstance, setSocketInstance] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io(conf.server2Socket, {
      withCredentials: true,
    });
    socketRef.current = socket;
    setSocketInstance(socket); // ✅ trigger re-render for context consumers

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        // socket: socketRef.current,
        socket: socketInstance,
        isConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
