import { useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router-dom";
import TitlePage from "./TitlePage";

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
    <TitlePage title="Login Page"/>
      <div>Login Page</div>
      <label>Username</label>
      <input
        type="text"
        onChange={(e) => {
          setUser(e.target.value);
        }}
      />

      <button onClick={handleLogin}> Login</button>
    </>
  );
}

export default Login;
