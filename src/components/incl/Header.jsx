import { useNavigate } from "react-router-dom";
import "../../style/Header.css";

function Header({ user, token, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <h1 className="logo" onClick={() => navigate("/")}>
        SSR Editor
      </h1>
      <nav className="nav-buttons">
        <button className="nav-btn" onClick={() => navigate("/")}>All documents</button>
        <button className="nav-btn" onClick={() => navigate("/create")}>Create document</button>

        {token && (
          <>
          <button className="nav-btn" onClick={() => navigate("/my-docs")}>My documents</button>
          </>
        )}

        {token ? (
          <>
            <button className="nav-btn" onClick={onLogout}>Logout</button>
            <span className="user-info">Logged in as: {user && user.username ? user.username : "Unknown"}</span>
            <span className="user-info">({user && user.email ? user.email : ""})</span>
          </>
        ) : (
        <button className="nav-btn" onClick={() => navigate("/login")}>Login</button>
        )}
      </nav>
    </header>
  );
}

export default Header;