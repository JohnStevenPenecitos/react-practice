import { useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router-dom";

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
