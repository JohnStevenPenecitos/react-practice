import { NavLink } from "react-router-dom";
// import { useAuth } from "./Auth";
import { motion } from "framer-motion";
import { useState } from "react";
import { BurgerSwipe } from "react-icons-animated";
import useLogout from "../hooks/useLogout";
import { useAuthContext } from "./Auth";
import Image from "./Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCaretDown,
  faCaretUp,
} from "@fortawesome/free-solid-svg-icons";

const navigation = [
  { name: "Home", href: "home" },
  { name: "About", href: "about" },
  { name: "Products", href: "product" },
  { name: "Users", href: "users" },
  { name: "Messages", href: "messages" },
  { name: "Notifications", href: "notifications" },
  { name: "Profile", href: "profile" },
];

const isMobile = window.innerWidth <= 600;

const Navbar = () => {
  const getNavLinkClassName = ({ isActive }: { isActive?: boolean } = {}) => {
    const baseClass =
      "p-2 inline-flex items-center text-xl focus:outline-none transition duration-500 ease-in-out";

    const activeClass = isActive
      ? "text-blue-800 border-indigo-400 hover:border-indigo-700 focus:border-indigo-700"
      : "border-transparent text-white hover:text-gray-400 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300";

    const responsiveClass = "md:text-lg lg:text-xl xl:text-2xl";

    return `${baseClass} ${activeClass} ${responsiveClass}`;
  };

  const [isClosed, setIsClosed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  /* Mobile navigation Style */
  const isHiddenStyle =
    "absolute space-y-10 bg-red-500 w-full p-6 min-h-screen";
  const isVisibleStyle =
    "absolute space-y-10 bg-red-500 w-full p-6 left-0  right-0 top-0 min-h-screen";

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 500, damping: 24 },
    },
    closed: { opacity: 0, y: -120, transition: { duration: 0.2 } },
  };

  const { authUser } = useAuthContext();

  const { logout } = useLogout();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const toggleDropdownNotif = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <>
      <div className="bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 p-2 flex items-center px-5 justify-between relative z-20">
        <div className="flex  items-center gap-2">
          {authUser ? (
            <>
              <div>
                {authUser.profilePhoto && <Image src={authUser.profilePhoto} />}
              </div>

              <input
                type="text"
                className="rounded-full bg-gray-200  text-left pl-4 h-10 md:w-64 w-52 "
                placeholder="Search"
              />
            </>
          ) : (
            <p>Welcome, Guest!</p>
          )}
        </div>

        <div className="block md:hidden">
          <div className="w-full flex justify-between items-center font-poppins md:hidden">
            <motion.div
              initial={false}
              animate={isOpen ? "open" : "closed"}
              className="flex flex-col w-full z-[100]"
            >
              <motion.button
                initial={{ opacity: 0.6 }}
                whileInView={{ opacity: 1 }}
                whileHover={{ scale: 1.2, transition: { duration: 0.5 } }}
                onClick={() => {
                  setIsClosed(!isClosed);
                  setIsOpen(!isOpen);
                  setIsHidden(!isHidden);
                }}
                style={{
                  display: "grid",
                  placeItems: "center",
                }}
                className={
                  isHidden
                    ? "z-50 absolute top-2 right-5 grid place-items-center bg-slate-400 rounded-full h-[50px] w-[50px]"
                    : "z-50 absolute top-2 right-5 grid w-[50px] h-[50px] place-items-center bg-emerald-500 rounded-full"
                }
              >
                <BurgerSwipe isClosed={isClosed} />
              </motion.button>

              <motion.ul
                variants={{
                  open: {
                    clipPath: "inset(0% 0% 0% 0% round 0px)",
                    transition: {
                      type: "spring",
                      bounce: 0,
                      duration: 1,
                      delayChildren: 0.3,
                      staggerChildren: 0.05,
                    },
                  },
                  closed: {
                    clipPath: "inset(10% 50% 90% 50% round 0px)",
                    transition: {
                      type: "spring",
                      bounce: 0,
                      duration: 0.3,
                    },
                  },
                }}
                layout
                className={isHidden ? isHiddenStyle : isVisibleStyle}
              >
                <div className="flex flex-col gap-5 font-bold text-3xl lg:text-5xl bg-red-200 justify-start">
                  {navigation.map((item) => (
                    <motion.div key={item.name} variants={itemVariants}>
                      <NavLink
                        to={item.href}
                        className={getNavLinkClassName}
                        onClick={() => {
                          setIsClosed(!isClosed);
                          setIsOpen(!isOpen);
                          setIsHidden(!isHidden);
                        }}
                      >
                        {item.name}
                      </NavLink>
                    </motion.div>
                  ))}
                  <div>
                    <motion.button
                      variants={itemVariants}
                      className="text-xl p-2"
                      onClick={logout}
                    >
                      Logout
                    </motion.button>
                  </div>
                </div>
              </motion.ul>
            </motion.div>
          </div>
        </div>
        <div className=" w-full flex justify-center items-center absolute -ml-5 -z-10">
          <div className="hidden md:block">
            <motion.nav
              className="bg-red-200 divide-x-2 divide-red-900 rounded-xl border-2 border-red-900 flex items-center justify-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {navigation.map((item) =>
                item.name !== "Notifications" && item.name !== "Profile" ? (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <NavLink to={item.href} className={getNavLinkClassName}>
                      {item.name}
                    </NavLink>
                  </motion.div>
                ) : isMobile ? (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <NavLink to={item.href} className={getNavLinkClassName}>
                      {item.name}
                    </NavLink>
                  </motion.div>
                ) : null
              )}
            </motion.nav>
          </div>
        </div>
        <div className="hidden md:block">
          <div className=" flex justify-between items-center relative  gap-4">
            <div
              className=" bg-amber-300 p-2 rounded-full h-12 w-12 flex items-center justify-center cursor-pointer"
              onClick={toggleDropdownNotif}
            >
              <FontAwesomeIcon
                className=" text-gray-800  text-3xl "
                icon={faBell}
              />
            </div>
            <div
              className="flex justify-end group hover:bg-slate-400 hover:rounded-full hover:border-[0.5px] hover:border-gray-400 cursor-pointer"
              onClick={toggleDropdown}
            >
              {authUser ? (
                <>
                  {authUser.profilePhoto && (
                    <Image src={authUser.profilePhoto} />
                  )}
                </>
              ) : (
                <p>Welcome, Guest!</p>
              )}
              <div className="flex justify-end absolute">
                <FontAwesomeIcon
                  className="mt-7  cursor-pointer text-gray-800 text-lg bg-gray-200  rounded-full h-4 w-4 border-2 border-gray-400 group-hover:bg-slate-400"
                  icon={isDropdownOpen ? faCaretUp : faCaretDown}
                />
              </div>
            </div>
            {isDropdownOpen && (
              <motion.div
                className="bg-red-300 absolute top-[50px] p-2 rounded-md flex justify-end right-[2px]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ul className="bg-gray-200 w-24 divide-y-2 divide-gray-500 flex flex-col">
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="hover:bg-gray-300"
                  >
                    Profile
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="hover:bg-gray-300"
                    onClick={logout}
                  >
                    Logout
                  </motion.button>
                </ul>
              </motion.div>
            )}

            {isNotificationOpen && (
              <div className="bg-blue-300 absolute top-[50px] p-2 rounded-lg flex justify-end right-[2px]">
                <ul className="bg-gray-200 w-96 min-h-[80vh]">
                  <li>Item 1</li>
                  <li>Item 2</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
