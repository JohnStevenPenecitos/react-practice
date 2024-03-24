import TitlePage from "./TitlePage";
import Posts from "./Posts";
import AddPost from "./AddPost";

const About: React.FC = () => {
  return (
    <>
      <TitlePage title="Posts Page" />
      <div className="overflow-hidden max-h-[87.7vh] max-w-4xl mx-auto">
        <AddPost />
        <div className="w-full p-2">
          <Posts />
        </div>
      </div>
    </>
  );
};

export default About;
