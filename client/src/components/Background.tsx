interface Props {
  url: string;
  children: React.ReactNode;
}

const Background = ({ url, children }: Props) => {
  return (
    <div
      className={`bg-cover bg-center bg-no-repeat`}
      style={{ backgroundImage: `url(${url})` }}
    >
      {children}
    </div>
  );
};

export default Background;
