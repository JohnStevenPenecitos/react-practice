import Chat from "./Chat";

function RightSidebar() {
  return (
    <>
      <div className="hidden md:block bg-red-200 border-2 border-blue-400 rounded-lg p-2">
        <Chat />
      </div>
    </>
  );
}

export default RightSidebar;
