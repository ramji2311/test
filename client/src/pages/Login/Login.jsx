import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

function Login() {

  const navigate = useNavigate();
useEffect(() => {

  const isLoggedIn =
    localStorage.getItem("isLoggedIn");

  if (isLoggedIn === "true") {

    navigate("/dashboard");

  }

}, [navigate]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {

    if (
      username === "admin" &&
      password === "admin123"
    ) {

      localStorage.setItem("isLoggedIn", "true");

      navigate("/dashboard");

    } else {

      setError("Invalid Username or Password");

    }

  };

  return (

    <div className="login-container">

      <div className="login-card">

        <h1>MIARA DESIGNER HOUSE</h1>

        <p>Tailor ERP System</p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <div className="show-password">

          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() =>
              setShowPassword(!showPassword)
            }
          />

          <label htmlFor="showPassword">
            Show Password
          </label>

        </div>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <button onClick={handleLogin}>
          Login
        </button>

      </div>

    </div>

  );

}

export default Login;