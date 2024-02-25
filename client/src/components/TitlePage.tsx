import { useEffect } from "react";

interface Props {
  title: string;
}

const TitlePage = ({ title }: Props) => {
  useEffect(() => {
    document.title = title;
    return () => {
      document.title = "Default Title";
    };
  }, [title]);

  return null;
};

export default TitlePage;
