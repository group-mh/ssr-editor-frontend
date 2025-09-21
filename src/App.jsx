import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import docModel from "./models/documents";
import Header from "./components/incl/Header";
import Footer from "./components/incl/Footer";
import DocList from "./components/docs/DocList";
import CreateEditor from "./components/docs/CreateEditor";
import UpdateDoc from "./components/docs/UpdateDoc";
import "./App.css";

function App() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    async function fetchDocs() {
      const allDocs = await docModel.getAllDocs();
      if (allDocs) setDocs(allDocs);
    }
    fetchDocs();
  }, []);

  return (
    <BrowserRouter basename={docModel.baseName}>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/docs" replace />} />
          <Route path="/docs" element={<DocList docs={docs} setDocs={setDocs} />} />
          <Route path="/create" element={<CreateEditor />} />
          <Route path="/edit/:id" element={<UpdateDoc />} />
          <Route path="*" element={<p>404 - Page not found</p>} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;