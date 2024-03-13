import React, {
  createContext,
  useContext,
  useState,
  // ReactNode,
  // useEffect,
} from "react";
// import { useNavigate } from "react-router-dom";

// interface AuthContextProps {
//   user: any;
//   login: (user: any) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextProps | null>(null);

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<any | null>(() => {
//     const storedUser = localStorage.getItem("user");
//     return storedUser ? JSON.parse(storedUser) : null;
//   });

//   const login = (newUser: any) => {
//     setUser(newUser);
//     // Save user to localStorage on login
//     localStorage.setItem("user", JSON.stringify(newUser));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user === null) {
//       navigate("/");
//     }
//   }, [user, navigate]);

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);

//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }

//   return context;
// };

// interface AuthContextProps {
//   authUser: string | null;
//   setAuthUser: React.Dispatch<React.SetStateAction<string | null>>;
// }
// const storedUser = localStorage.getItem("chat-user");
// const [authUser, setAuthUser] = useState<string | null>(
//   storedUser ? JSON.parse(storedUser) : null
// );

interface AuthContextProps {
  authUser: {
    _id: number;
    firstName: string;
    lastName: string;
    userName: string;
    profilePhoto: string;
  } | null;
  setAuthUser: React.Dispatch<
    React.SetStateAction<{
      _id: number;
      firstName: string;
      lastName: string;
      userName: string;
      profilePhoto: string;
    } | null>
  >;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const storedUser = localStorage.getItem("chat-user");
  const [authUser, setAuthUser] = useState<{
    _id: number;
    firstName: string;
    lastName: string;
    userName: string;
    profilePhoto: string;
  } | null>(
    storedUser
      ? {
          _id: JSON.parse(storedUser)._id,
          firstName: JSON.parse(storedUser).firstName,
          lastName: JSON.parse(storedUser).lastName,
          userName: JSON.parse(storedUser).userName,
          profilePhoto: JSON.parse(storedUser).profilePhoto,
        }
      : null
  );

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }

  return context;
};
