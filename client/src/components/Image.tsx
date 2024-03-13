interface Props {
  src: string;
}

function Image({ src }: Props) {
  return (
    <>
      <img
        src={src}
        alt=""
        className="h-12 rounded-full flex-nowrap flex object-cover"
      />
    </>
  );
}

export default Image;
