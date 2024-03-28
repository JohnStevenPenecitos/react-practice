//this is the layout
import Navbar from "../components/Navbar";
import { ReactNode, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import { useLocation } from "react-router-dom";
interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  const [isMessagesActive, setIsMessagesActive] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if the current URL is /app/messages
    setIsMessagesActive(location.pathname === "/app/messages");
  }, [location.pathname]);
  return (
    <>
      <div className=" p-2  min-h-screen overflow-hidden">
        <div className="flex flex-col border-2 border-white  rounded-2xl overflow-hidden min-h-[97.5vh]">
          <Navbar />
          <div className="flex flex-1">
            <Sidebar setIsMessagesActive={setIsMessagesActive} />
            <div className="overflow-hidden border-2 border-red-500 w-full  rounded-lg">
              <main>{children}</main>
            </div>
            {!isMessagesActive && <RightSidebar />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
