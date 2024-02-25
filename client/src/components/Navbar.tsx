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
      ? "inline-flex items-center px-1 pt-1 text-blue-800 border-indigo-400 text-xl font-medium leading-5  focus:outline-none focus:border-indigo-700 transition duration-150 ease-in-out"
      : "inline-flex items-center px-1 pt-1 border-transparent text-xl font-medium leading-5 text-white hover:text-gray-400 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-500 ease-in-out";
  };

  const auth = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/");
  };
  return (
    <>
      <div className="bg-blue-300 h-24 flex items-center justify-between px-8">
        <div> Welcome {auth.user}</div>
        <nav>
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={getNavLinkClassName}
            >
              {item.name}
            </NavLink>
          ))}
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
