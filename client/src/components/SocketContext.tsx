import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useAuthContext } from "./Auth";

interface User {
  _id: string | undefined; // Assuming the ID property is named 'id'
}

interface SocketContextType {
  socket: Socket<any, any> | null;
  onlineUsers: User[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
});

export const useSocketContext = (): SocketContextType => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket<any, any> | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      // const newSocket = io("http://localhost:3000", {
      const newSocket = io("https://react-practice-uk4m.onrender.com", {

        query: {
          userId: authUser._id, 
        },
      });

      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (users: User[]) => {
        setOnlineUsers(users);
      });

      return () => {
        newSocket.close();
        setSocket(null);
      };
    } else {
      setSocket(null);
      setOnlineUsers([]);
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
