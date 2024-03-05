import TitlePage from "./TitlePage";
import Posts from "./Posts";
import AddPost from "./AddPost";

const About: React.FC = () => {
  return (
    <>
      <TitlePage title="About Page" />
   
        <AddPost />
        <Posts />
    </>
  );
};

export default About;
