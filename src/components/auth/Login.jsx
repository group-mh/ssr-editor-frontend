import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import auth from "../../models/auth";

export default function Login( { setToken, setUser}) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = auth.getToken();
    if (token) {
      navigate("/my-docs")
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "login") {
      const result = await auth.login({
        usernameOrEmail: email,
        password,
      });

      if (result.error) {
        setStatus(`Login failed: ${result.error}`);
      } else {
        setStatus("Login successful!");
        setToken(result.token);

        try {
          const decoded = jwtDecode(result.token);
          console.log("Decoded JWT:", decoded);

          const userFromToken = {
            email: decoded.username || decoded.email,
            id: decoded.id
          };
        
        setUser(userFromToken);
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(userFromToken));
        } catch (err) {
          console.error("Failed to decode JWT:", err);
          setUser({});
        }

        navigate("/my-docs");
      }
    } else {
      const result = await auth.register({
        username: username || email,
        email,
        password,
      });

      if (result.error) {
        setStatus(`Register failed: ${result.error}`);
      } else {
        setStatus("Registration successful.");
        setMode("login");
      }
    }
};

return (
  <form onSubmit={handleSubmit}>
    <h2>{mode === "login" ? "Login" : "Register"}</h2>

    {mode === "register" && (
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        />
    )}

    <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        />

        <button type="submit">{mode === "login" ? "Login" : "Register"}</button>

        {status && <p>{status}</p>}

        <p>
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setStatus("");
                }}
                >
                  Register here
                </button>
              </>
           ) : (
            <>
              Already have an account?{" "}
              
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setStatus("");
                }}
                 >
                  Login here
                </button>
            </>
          )}
        </p>
  </form>
)


}

