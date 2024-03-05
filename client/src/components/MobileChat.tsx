import Image from "./Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";

const messages1 = [
  {
    src1: "../images/KayeIcon.png",
    name1: "Kaye Parenafasd fasd",
    message1: "hiii po! Thank you so much  asdf asdffasdf asdf! asdf",
  },
  {
    src1: "../images/KayeIcon.png",
    name1: "John Steven Penecitoa sdfs",
    message1: "hiii po! Thank you so much! asdf fa sdf afsd f asdf asd",
  },

  {
    src1: "../images/KayeIcon.png",
    name1: "John Patrick Pen asfdecitos",
    message1: "hiii po! Thank you so much!",
  },

  {
    src1: "../images/KayeIcon.png",
    name1: "Kim Andrea Peneci asfdtos",
    message1: "hiii po! Thank you so mu asdfch!",
  },
];

function MobileChat() {
  // const [isContentVisible, setIsContentVisible] = useState(true);

  // const toggleContentVisibility = () => {
  //   setIsContentVisible((prev) => !prev);
  // };

  return (
    <>
      <div className={`bg-red-200 border-2 border-blue-400 rounded-lg p-2`}>
        <div className="gap-2 flex flex-col">
          <div className={`flex  items-center`}>
            <FontAwesomeIcon
              className="hover:bg-gray-400 mt-1 rounded-full cursor-pointer p-2 text-gray-800 text-2xl bg-gray-200"
              icon={faCaretRight}
            />
          </div>
          {messages1.map((item1, index) => (
            <div
              key={index}
              className="max-h-[80vh] bg-blue-200 p-2 rounded-xl flex flex-row gap-2 w-full "
            >
              <div className=" flex justify-center items-center w-12">
                <Image src={item1.src1} />
              </div>
              <div>
                <div>
                  <h1 className="font-bold">{item1.name1}</h1>
                  <span className="block overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[15rem]">
                    {item1.message1}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default MobileChat;
