//this is the layout
import Navbar from "./components/Navbar";
// import FooterSys from "./components/FooterSys";
import { ReactNode } from "react";
import Sidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar";
// import { BackgroundGradientAnimation } from "./components/ui/background-gradient-animation";
// import Background from "./components/Background";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <div className=" p-2  min-h-screen">
        <div className="flex flex-col border-2 border-white  rounded-2xl overflow-hidden min-h-[97.5vh]">
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <div className="overflow-hidden border-2 border-red-500 w-full  rounded-lg ">
              <main className="max-w-3xl mx-auto">{children}</main>
            </div>
            <RightSidebar />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
