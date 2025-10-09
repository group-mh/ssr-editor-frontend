import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import docModel from "./models/documents";
import Header from "./components/incl/Header";
import Footer from "./components/incl/Footer";
import DocList from "./components/docs/DocList";
import MyDocList from "./components/docs/MyDocList";
import CreateEditor from "./components/docs/CreateEditor";
import UpdateDoc from "./components/docs/UpdateDoc";
import Invite from "./components/invite/inviteForm";
import Login from "./components/auth/Login";
import "./App.css";

function App() {
  const [docs, setDocs] = useState([]);
  const [user, setUser] = useState({});
  const [token, setToken] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
    
    const savedUser = localStorage.getItem("user");
    if (savedUser && savedUser !=="undefined") {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e)
        localStorage.removeItem("user");
      }
    } 
  }, []);

  useEffect(() => {
    async function fetchDocs() {
      const allDocs = await docModel.getAllDocs();
      console.log(allDocs);
      if (allDocs) setDocs(allDocs);
    }
    fetchDocs();
  }, []);

  function handleLogout() {
    setToken("");
    setUser({});
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return (
    <BrowserRouter basename={docModel.baseName}>
      <Header user={user} token={token} onLogout={handleLogout} />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/docs" replace />} />
          <Route path="/docs" element={<DocList docs={docs} setDocs={setDocs} />} />
          <Route path="/my-docs" element={
            token ? ( <MyDocList docs={docs} setDocs={setDocs} />
          ) : (
            <Navigate to="/login" replace />
          )
          } 
          />
          <Route path="/create" element={
            token ? <CreateEditor /> : <Navigate to="/login" replace />
            } 
            />
          <Route path="/edit/:id" 
          element={
          token ? <UpdateDoc /> : <Navigate to="/login" replace />
        } />
        <Route path="/invite/:id" 
          element={
          token ? <Invite /> : <Navigate to="/login" replace />
        } />
        <Route
          path="/login"
          element={<Login setToken={setToken} user={user} setUser={setUser} />}
          />
          <Route path="*" element={<p>404 - Page not found</p>} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;