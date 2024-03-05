// import { Outlet } from "react-router-dom";
import TitlePage from "./TitlePage";
import { TextRevealCard, TextRevealCardDescription, TextRevealCardTitle } from "./ui/text-reveal-card";

const Users = () => {
  return (
    <>
      <TitlePage title="Users" />
      {/* <div>Users</div>
      <button>User 1</button>
      <button>User 2</button>
      <button>User 3</button> */}

      {/* <div className="absolute z-10 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
        <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
          Wowie
        </p>
      </div> */}

      <div className="flex items-center justify-center  rounded-2xl w-full -z-50 relative">
        <TextRevealCard
          text="You know the business"
          revealText="Yieee "
        >
          <TextRevealCardTitle>
            Sometimes, you just need to see it.
          </TextRevealCardTitle>
          <TextRevealCardDescription>
            This is a text reveal card. Hover over the card to reveal the hidden
            text.
          </TextRevealCardDescription>
        </TextRevealCard>
      </div>
      {/* <Outlet /> */}
    </>
  );
};

export default Users;
