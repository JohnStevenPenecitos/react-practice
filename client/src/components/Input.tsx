interface Props {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  color: keyof typeof colorVariants;
}

const colorVariants = {
  gray: "border border-gray-400 bg-gray-300 rounded-md",
};

const Input = ({color, onChange }: Props) => {
  const colorClass = colorVariants[color];

  return (
    <input
      type="text"
      className={`${colorClass}`}
      onChange={onChange}
    ></input>
  );
};

export default Input;
