import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./Auth";
import { motion } from "framer-motion";
import { useState } from "react";
import { BurgerSwipe } from "react-icons-animated";
// import {
//   UilGoogle,
//   UilFacebookF,
//   UilTwitterAlt,
//   UilPolygon,
//   UilLinkedinAlt,
//   UilSuitcase,
//   UilEstate,
//   UilUsersAlt,
//   UilPuzzlePiece,
// } from "@iconscout/react-unicons";

const navigation = [
  { name: "Home", href: "home" },
  { name: "About", href: "about" },
  { name: "Products", href: "product" },
  { name: "Users", href: "users" },
  { name: "Messages", href: "messages" },
];

const Navbar = () => {
  const getNavLinkClassName = ({ isActive }: { isActive?: boolean }) => {
    // return isActive
    //   ? "p-2 inline-flex items-center text-blue-800 border-indigo-400 text-xl focus:outline-none focus:border-indigo-700 transition duration-150 ease-in-out"
    //   : "p-2 inline-flex items-center border-transparent text-xl  text-white hover:text-gray-400 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-500 ease-in-out";
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

  /* Framer Motion animation properties for the children of the parent motion container */

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 500, damping: 24 },
    },
    closed: { opacity: 0, y: -120, transition: { duration: 0.2 } },
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
        <div>Welcome {auth.user}</div>
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
                  // width: "50px",
                  // height: "20px",
                  display: "grid",
                  placeItems: "center",
                }}
                className={
                  isHidden
                    ? "z-50 absolute top-5 right-5 grid place-items-center bg-slate-400 rounded-full h-[50px] w-[50px]"
                    : "z-50 absolute top-5 right-5 grid w-[50px] h-[50px] place-items-center bg-emerald-500 rounded-full"
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
                <div className="flex flex-col gap-5 justify-center font-bold text-3xl lg:text-5xl bg-red-200">
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
                </div>
              </motion.ul>
            </motion.div>
          </div>
        </div>
        <div className="hidden md:block">
          <motion.nav
            className="bg-red-200 divide-x-2 divide-red-900 rounded-xl border-2 border-red-900 p-2 flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {navigation.map((item) => (
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
            ))}

            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl p-2"
              onClick={handleLogout}
            >
              Logout
            </motion.button>
          </motion.nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
