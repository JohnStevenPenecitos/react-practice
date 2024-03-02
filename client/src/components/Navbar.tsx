import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./Auth";

const navigation = [
  { name: "Home", href: "home" },
  { name: "About", href: "about" },
  { name: "Products", href: "product" },
  { name: "Users", href: "users" },
];

const Navbar = () => {
  const getNavLinkClassName = ({ isActive }: { isActive?: boolean }) => {
    return isActive
      ? "p-2 inline-flex items-center text-blue-800 border-indigo-400 text-xl  focus:outline-none focus:border-indigo-700 transition duration-150 ease-in-out"
      : "p-2 inline-flex items-center border-transparent text-xl  text-white hover:text-gray-400 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-500 ease-in-out";
  };

  const auth = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/");
  };
  return (
    <>
      <div className="bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 h-24 flex items-center justify-between px-8">
        <div> Welcome {auth.user}</div>
        <nav className="bg-red-200 divide-x-2 divide-red-900 rounded-xl border-2 border-red-900">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={getNavLinkClassName}
            >
              {item.name}
            </NavLink>
          ))}
          <button className="text-xl p-2" onClick={handleLogout}>Logout</button>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
