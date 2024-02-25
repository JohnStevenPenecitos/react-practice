// import { ReactNode } from "react";

interface Props {
  children: string;
  color: keyof typeof colorVariants; // Use the keys of colorVariants as valid color prop values
  onClick: () => void;
}

const colorVariants = {
  blue: "bg-blue-400 hover:bg-blue-500",
  red: "bg-red-400 hover:bg-red-500",
};

function Button({ children, color, onClick }: Props) {
  const colorClass = colorVariants[color];
  return (
    <button
      className={`p-2 w-32 flex items-center justify-center border border-red-500 rounded-md ${colorClass}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
