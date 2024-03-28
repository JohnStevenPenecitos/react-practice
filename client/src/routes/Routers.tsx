import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/Home";
import About from "../pages/About";
import Products from "../pages/Products";
import Featured from "../components/Featured";
import New from "../components/New";
import Users from "../pages/Users";
import UserDetails from "../components/UserDetails";
import AdminDetails from "../components/AdminDetails";
import PostDetails from "../components/PostDetails";
import MobileChat from "../pages/MobileChat";

const Routers = () => {
  return (
    <Layout>
      <Routes>
        <Route index element={<Navigate to="/app/home" />} />
        <Route path="home" element={<Home title="Home Page" />} />
        <Route path="about" element={<About />} />
        <Route path="messages" element={<MobileChat />} />
        <Route path="about/:postId" element={<PostDetails />} />
        <Route path="product" element={<Products />}>
          <Route index element={<Featured />} />
          <Route path="featured" element={<Featured />} />
          <Route path="new" element={<New title="New Page" />} />
        </Route>
        <Route path="users" element={<Users />}>
          <Route path=":userId" element={<UserDetails />} />
          <Route path="admin" element={<AdminDetails />} />
        </Route>
      </Routes>
    </Layout>
  );
};

export default Routers;
