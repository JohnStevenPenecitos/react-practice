import { useSocketContext } from "./SocketContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from "./Auth";



const DisplayIdsComponent = () => {
  const { onlineUsers } = useSocketContext();

  const { authUser } = useAuthContext();
  const userAuthId = authUser?._id;

  return (
    <div className="bg-red-200 border-2 border-blue-400 rounded-lg p-2">
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <FontAwesomeIcon
            className="hover:bg-gray-400 rounded-full cursor-pointer p-2 text-gray-800 text-2xl bg-gray-200"
            icon={faCaretRight}
          />
        </div>
        {/* <div>
          <h2>Online User IDs</h2>
          <ul>
            {onlineUsers.map((id, index) => (
              <li key={index}>
                _id: {id} {id === userAuthId ? "(You)" : ""}
              </li>
            ))}
          </ul>
        </div> */}

      
      </div>
    </div>
  );
};

export default DisplayIdsComponent;
