import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface Props {
  children: ReactNode;
  onClose: () => void;
  title: keyof typeof titles;
}

const titles = {
  update: `Update Post`,
  delete: `Delete Post`,
};

function Modal({ children, onClose, title }: Props) {
  const titleModal = titles[title];
  const backgroundColorClass =
    title === "update" ? "bg-blue-200" : "bg-red-200";

  return (
    <>
      <div className="z-10 inset-0 fixed">
        <div className="flex items-center justify-center min-h-screen text-center">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-black opacity-75"></div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all w-96">
            <div
              className={`flex justify-between p-2 ${backgroundColorClass} items-center`}
            >
              <span className="text-lg text-gray-600">{titleModal}</span>
              <FontAwesomeIcon
                className="fa-solid fa-x hover:bg-gray-400 mt-1 rounded-lg cursor-pointer p-2 text-gray-800"
                icon={faXmark}
                onClick={onClose}
              />
            </div>

            <span>{children}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
