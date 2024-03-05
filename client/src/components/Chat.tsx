import { useState } from "react";
import Image from "./Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const messages = [
  {
    src: "../images/KayeIcon.png",
    name: "Kaye Parena",
    message: "hiii po! Thank you so much  asdf asdffasdf asdf!",
  },
  {
    src: "../images/KayeIcon.png",
    name: "John Steven Penecitos",
    message: "hiii po! Thank you so much! fa sdf afsd f asdf asd",
  },

  {
    src: "../images/KayeIcon.png",
    name: "John Patrick Penecitos",
    message: "hiii po! Thank you so much!",
  },

  {
    src: "../images/KayeIcon.png",
    name: "Kim Andrea Penecitos",
    message: "hiii po! Thank you so much!",
  },
];

function Chat() {
  const [isContentVisible, setIsContentVisible] = useState(true);

  const toggleContentVisibility = () => {
    setIsContentVisible((prev) => !prev);
  };

  return (
    <>
      <motion.div
        className={` w-[${isContentVisible ? "20rem" : "5rem"}]`}
        initial={{ width: "5rem", opacity: 0 }}
        animate={{ width: isContentVisible ? "20rem" : "5rem", opacity: 1 }}
        transition={{
          duration: 1,
          ease: [0, 0.3, 0.3, 1.01],
          scale: {
            type: "spring",
            damping: 5,
            stiffness: 100,
            restDelta: 0.001,
          },
        }}
      >
        <div className="gap-2 flex flex-col">
          <motion.div
            className={`flex ${
              isContentVisible ? "justify-left" : "justify-center"
            } items-center`}
          >
            <FontAwesomeIcon
              className="hover:bg-gray-400 mt-1 rounded-full cursor-pointer p-2 text-gray-800 text-2xl bg-gray-200"
              icon={isContentVisible ? faCaretLeft : faCaretRight}
              onClick={toggleContentVisibility}
            />
          </motion.div>
          {messages.map((item) => (
            <div
              key={item.name}
              className="max-h-[80vh] bg-blue-200 p-2 rounded-xl flex flex-row gap-2"
            >
              <div
                className={`flex justify-center items-center ${
                  isContentVisible ? "mx-0" : "mx-auto"
                }`}
              >
                <Image key={item.name} src={item.src} />
              </div>
              {isContentVisible && (
                <div className="">
                  <div key={item.name}>
                    <h1 className="font-bold">{item.name}</h1>
                    <span className="block overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[13rem]">
                      {item.message}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

export default Chat;
