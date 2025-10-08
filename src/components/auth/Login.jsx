import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import authModel from "../../models/auth";

function Login({ setToken, user = {}, setUser }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.token) {
      navigate("/");
    }
  }, [user, navigate]);

  function changeHandler(event) {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(mode) {
    setMessage("");
    setError("");

    if (!user.email || !user.password) {
      setError("Email, password are required");
      return;
    }

    try {
      const result =
        mode === "login"
          ? await authModel.login(user)
          : await authModel.register(user);

      if (result?.errors?.message) {
        setError(result.errors.message);
        return;
      }

      if (result?.data?.token) {
        setToken(result.data.token);
        if (mode === "login") {
          navigate("/");
        }
      }

      if (mode === "register" && !result.errors) {
        setMessage("Registration successful, you are now able to login.");
      }
    } catch (err) {
      setError("Unexpected error occurred. Please try again.");
      console.error(err);
      return;
    }
  }

  return (
    <div className="login-form">
      <h1 className="title">Login / Register</h1>

      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        name="email"
        value={user.email || ""}
        onChange={changeHandler}
        required
      />

      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        name="password"
        value={user.password || ""}
        onChange={changeHandler}
        required
      />

      <button
        type="button"
        className="register-btn"
        onClick={() => handleSubmit("register")}
      >
        Register
      </button>

      <button
        type="button"
        className="login-btn"
        onClick={() => handleSubmit("login")}
      >
        Login
      </button>
    </div>
  );
}

export default Login;
