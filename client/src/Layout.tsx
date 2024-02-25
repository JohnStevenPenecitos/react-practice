//this is the layout
import Navbar from "./components/Navbar";
import FooterSys from "./components/FooterSys";
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <FooterSys />
      </div>
    </>
  );
};

export default Layout;
