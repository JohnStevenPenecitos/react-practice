// import { ReactNode } from "react";

interface Props {
  children: string;
  color: keyof typeof colorVariants;
  onClick: () => void;
}

const colorVariants = {
  blue: "bg-blue-400 hover:bg-blue-500 ",
  red: "bg-red-200 hover:bg-red-400 border rounded-md",
};

function Button({ children, color, onClick }: Props) {
  const colorClass = colorVariants[color];
  return (
    <button
      className={`p-2 flex items-center justify-center rounded-lg ${colorClass}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
