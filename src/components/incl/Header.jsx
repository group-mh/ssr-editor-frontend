import { useLocation, useNavigate } from "react-router-dom";
import "../../style/Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faPlus,
  faFloppyDisk,
  faUserCircle,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

function Header({ user, token, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="navbar">
        <div className="navbar-left">
          <div className="logo-container" onClick={() => navigate("/")}>
            <FontAwesomeIcon icon={faFileLines} className="logo-icon" />
            <span className="logo-text">SSR Editor</span>
          </div>

          <div className="doc-menu">
            <button
              className={`doc-menu-btn ${isActive("/docs") ? "active" : ""}`}
              onClick={() => navigate("/")}
            >
              <FontAwesomeIcon icon={faFileLines} />
              All Docs
            </button>

            {token && (
              <button
                className={`doc-menu-btn ${isActive("/my-docs") ? "active" : ""}`}
                onClick={() => navigate("/my-docs")}
              >
                <FontAwesomeIcon icon={faFileLines} />
                My Docs
              </button>
            )}

            <button
              className={`doc-menu-btn ${isActive("/create") ? "active" : ""}`}
              onClick={() => navigate("/create")}
            >
              <FontAwesomeIcon icon={faPlus} />
              New
            </button>
          </div>
        </div>

        <div className="navbar-right">
          {token ? (
            <>
              <div className="user">
                <FontAwesomeIcon icon={faUserCircle} className="user-icon" />
                <div className="user-info">
                  <span className="username">
                    {user?.username || "Unknown"}
                  </span>
                  <span className="user-email">{user?.email || ""}</span>
                </div>
                <button className="logout-button" onClick={onLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <button className="login-button" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
