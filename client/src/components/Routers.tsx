import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../Layout";
import Home from "./Home";
import About from "./About";
import Products from "./Products";
import Featured from "./Featured";
import New from "./New";
import Users from "./Users";
import UserDetails from "./UserDetails";
import AdminDetails from "./AdminDetails";
import PostDetails from "./PostDetails";
// import Chat from "./Chat";
import MobileChat from "./MobileChat";
// import SignUp from "./SignUp";
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
