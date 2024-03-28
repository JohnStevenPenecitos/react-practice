import { useAuthContext } from "../authentication/Auth";
import Image from "./Image";
import { NavLink } from "react-router-dom";
// import { motion } from "framer-motion";

const navigation = [
  { name: "Home", href: "home" },
  { name: "About", href: "about" },
  { name: "Products", href: "product" },
  { name: "Users", href: "users" },
  { name: "Messages", href: "messages" },
];

function Sidebar({
  setIsMessagesActive,
}: {
  setIsMessagesActive: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { authUser } = useAuthContext();

  const getNavLinkClassName = ({ isActive }: { isActive?: boolean }) => {
    const baseClass =
      "p-2 inline-flex items-center text-xl focus:outline-none transition duration-500 ease-in-out";

    const activeClass = isActive
      ? "text-blue-800 border-indigo-400 hover:border-indigo-700 focus:border-indigo-700"
      : "border-transparent text-white hover:text-gray-400 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300";

    const responsiveClass = "md:text-lg lg:text-xl xl:text-2xl";

    return `${baseClass} ${activeClass} ${responsiveClass}`;
  };

  return (
    <>
      <div className="hidden lg:block bg-red-200 w-[20rem] border-2 border-blue-400 rounded-lg p-3">
        <div>
          {authUser ? (
            <>
              <div className="flex gap-2">
                <div>
                  {authUser.profilePhoto && (
                    <Image src={authUser.profilePhoto} />
                  )}
                </div>
                <p className="font-bold flex items-center">
                  {authUser.firstName} {authUser.lastName}
                </p>
              </div>
            </>
          ) : (
            <p>Welcome, Guest!</p>
          )}
        </div>

        <div className="flex flex-col gap-5 justify-center font-bold text-3xl lg:text-5xl">
          {navigation.map((item) => (
            <div key={item.name}>
              <NavLink
                to={item.href}
                className={getNavLinkClassName}
                onClick={() => setIsMessagesActive(item.href === "messages")}
              >
                {item.name}
              </NavLink>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Sidebar;
