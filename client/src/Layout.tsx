//this is the layout
import Navbar from "./components/Navbar";
import FooterSys from "./components/FooterSys";
import { ReactNode } from "react";
// import Background from "./components/Background";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      {/* <Background url="../blue-bg.jpg"> */}
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <FooterSys />
        </div>
      {/* </Background> */}
    </>
  );
};

export default Layout;
