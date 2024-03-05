interface Props {
  src: string;
}

function Image({ src }: Props) {
  return (
    <>
      <img src={src} alt="" className="h-12 rounded-full" />
    </>
  );
}

export default Image;
