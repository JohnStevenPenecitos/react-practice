import { Outlet } from "react-router-dom";
import TitlePage from "./TitlePage";

const Users = () => {
  return (
    <>
      <TitlePage title="Users" />
      <div>Users</div>
      <button>User 1</button>
      <button>User 2</button>
      <button>User 3</button>
      <Outlet />
    </>
  );
};

export default Users;
