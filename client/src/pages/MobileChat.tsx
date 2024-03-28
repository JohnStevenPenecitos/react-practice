import CopyChat from "../components/CopyChat";
import ResponsiveChat from "../components/ResponsiveChat";

const Messages = () => {
  return (
    <div className="bg-red-200 border-2 border-blue-400 rounded-lg p-2 ">
      <div className="md:block hidden">
        <CopyChat />
      </div>

      <div className="md:hidden block">
        <ResponsiveChat />
      </div>
    </div>
  );
};

export default Messages;