
import { NavLink, Outlet } from "react-router-dom";
import TitlePage from "../components/TitlePage";

const navigation = [
  { name: "Featured", href: "featured" },
  { name: "New", href: "new" },
];

const Products = () => {

  const getNavLinkClassName = ({ isActive }: { isActive?: boolean }) => {
    return isActive
      ? "inline-flex items-center px-1 pt-1 text-blue-800 border-indigo-400 text-xl font-medium leading-5  focus:outline-none focus:border-indigo-700 transition duration-150 ease-in-out"
      : "inline-flex items-center px-1 pt-1 border-transparent text-xl font-medium leading-5 text-white hover:text-gray-400 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-500 ease-in-out";
  };
  return (
    <>
      <TitlePage title="Products Page" />

      <div>Products</div>

      <input
        type="text"
        placeholder="Search here hehe!"
        className="bg-slate-200 rounded-lg"
      ></input>



      <nav className="bg-green-200  flex items-center justify-start px-8 gap-3">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={getNavLinkClassName}
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </>
  );
};

export default Products;
