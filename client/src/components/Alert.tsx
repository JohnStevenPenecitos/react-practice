import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClose: () => void;
}

const Alert = ({ children, onClose }: Props) => {
  return (
    <div className="bg-blue-100 text-blue-800 p-4 justify-between flex items-center rounded-md border border-blue-400 w-full">
      <span>{children}</span>
      <button className="bg-red-400 p-2 rounded-full" onClick={onClose}>X</button>
    </div>
  );
};

export default Alert;
