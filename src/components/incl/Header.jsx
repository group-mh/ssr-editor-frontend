import { useNavigate } from "react-router-dom";
import "../../style/Header.css";

function Header({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <h1 className="logo" onClick={() => navigate("/")}>
        SSR Editor
      </h1>
      <nav className="nav-buttons">
        <button className="nav-btn" onClick={() => navigate("/")}>Home</button>
        <button className="nav-btn" onClick={() => navigate("/create")}>Create document</button>
        {user?.token ? (
        <button className="nav-btn" onClick={onLogout}>Logout</button>
        ) : (
        <button className="nav-btn" onClick={() => navigate("/login")}>Login</button>
        )}
      </nav>
    </header>
  );
}

export default Header;