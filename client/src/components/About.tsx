import TitlePage from "./TitlePage";
import Posts from "./Posts";
import AddPost from "./AddPost";

const About: React.FC = () => {
  return (
    <>
      <TitlePage title="About Page" />
      <div className="overflow-auto max-h-[87.8vh]">
        <AddPost />
        <Posts />
      </div>
    </>
  );
};

export default About;
