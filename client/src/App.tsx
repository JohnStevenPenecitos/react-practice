import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Routers from "./routes/Routers";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import SignUp from "./pages/SignUp";
import { useAuthContext } from "./authentication/Auth";

const queryClient = new QueryClient();
function App() {
  const { authUser } = useAuthContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={authUser ? <Routers /> : <Login />} />
        <Route path="signup" element={authUser ? <Routers /> : <SignUp />} />
        <Route
          path="app/*"
          element={authUser ? <Routers /> : <Navigate to="/" />}
        />
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;
