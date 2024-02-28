import { useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router-dom";
import TitlePage from "./TitlePage";
import Button from "./Button";
import Input from "./Input";
import Background from "./Background";

function Login() {
  const [user, setUser] = useState("");

  const auth = useAuth();

  const navigate = useNavigate();

  const handleLogin = () => {
    auth.login(user);
    navigate("/app/home");
  };
  return (
    <>
      <TitlePage title="Login Page" />
      <Background url="blue-bg.jpg">
        <div className="flex justify-center items-center min-h-screen">
          <div className=" bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100 rounded-lg h-96 overflow-hidden">
            <div className="flex justify-center items-center  text-white text-2xl font-bold p-2">
              Login Page
            </div>
            <div className="p-10  h-full flex flex-col justify-between ">
              <div>
                <h1 className="text-white text-xl font-bold">Username</h1>
                <Input
                  color="gray"
                  onChange={(e) => {
                    setUser(e.target.value);
                  }}
                ></Input>
              </div>
              <div className="mb-10">
                <Button color="red" onClick={handleLogin}>
                  Log in
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Background>
    </>
  );
}

export default Login;
