import React, {
  createContext,
  useContext,
  useState
} from "react";

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
