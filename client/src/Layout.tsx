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
      {/* <BackgroundGradientAnimation> */}
      <div className="  min-h-screen p-2">
        <div className="flex flex-col border-2 border-white min-h-[97.5vh] rounded-2xl overflow-hidden">
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <div className="overflow-hidden border-2 border-red-500 w-full  rounded-lg">
              {/* <BackgroundGradientAnimation> */}
                <main className="overflow-auto max-h-[84vh] max-w-3xl mx-auto">
                  {children}
                </main>
              {/* </BackgroundGradientAnimation> */}
            </div>
            <RightSidebar />
          </div>
        </div>
      </div>
      {/* </BackgroundGradientAnimation> */}
    </>
  );
};

export default Layout;
