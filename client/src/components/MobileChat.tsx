import { useSocketContext } from "./SocketContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "./Auth";
import Chat from "./Chat";
import CopyChat from "./CopyChat";



const DisplayIdsComponent = () => {
  const { onlineUsers } = useSocketContext();

  const { authUser } = useAuthContext();
  const userAuthId = authUser?._id;

  return (
    <div className="bg-red-200 border-2 border-blue-400 rounded-lg p-2">
   
     
    <CopyChat/>

    
    </div>
  );
};

export default DisplayIdsComponent;
