// import ListGroup from "./components/ListGroup";
// import React from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Routers from "./components/Routers";
// import { AuthProvider } from "./components/Auth";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import SignUp from "./components/SignUp";
import { useAuthContext } from "./components/Auth";
// import { useAuth } from "./components/Auth";

// const LazyAbout = React.lazy(() => import("./components/About"));

const queryClient = new QueryClient();
function App() {
  const { authUser } = useAuthContext();
  return (
    // <AuthProvider>
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
    // </AuthProvider>
    // <Layout>
    //   <Routes>
    //     <Route path="/" element={<Home title="Home Page" />} />
    //     <Route path="about" element={<About title="About Page" />} />
    //     <Route path="product" element={<Products />}>
    //       <Route index element={<Featured />} />
    //       <Route path="featured" element={<Featured />} />
    //       <Route path="new" element={<New title="New Page" />} />
    //     </Route>
    //     <Route path="users" element={<Users />}>
    //       <Route path=":userId" element={<UserDetails />} />
    //       <Route path="admin" element={<AdminDetails />} />
    //     </Route>
    //   </Routes>
    // </Layout>
  );
}

export default App;
