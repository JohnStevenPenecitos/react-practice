// import { ReactNode } from "react";

interface Props {
  children: string;
  color: keyof typeof colorVariants;
  onClick?: () => void;
  onSubmit?: () => void;
}

const colorVariants = {
  blue: "bg-blue-400 hover:bg-blue-500 ",
  red: "bg-red-200 hover:bg-red-400 border rounded-md",
};

function Button({ children, color, onClick, onSubmit }: Props) {
  const handleClick = () => {
    // e.preventDefault();
    if (onClick) {
      onClick();
    }
    if (onSubmit) {
      onSubmit();
    }
  };

  const colorClass = colorVariants[color];
  return (
    <button
      type="submit"
      className={`p-2 flex items-center justify-center rounded-lg ${colorClass}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

export default Button;
