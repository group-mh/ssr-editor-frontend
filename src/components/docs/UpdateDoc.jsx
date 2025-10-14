import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import docModel from "../../models/documents";
import "../../style/CreateEditor.css";
import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:1337";

function UpdateDoc() {
    const location = useLocation();
    const navigate = useNavigate();
    const socket = useRef(null);

    const docId = location.state.doc._id;

    const [newDoc, setNewDoc] = useState({
        _id: docId,
        title: location.state.doc.title,
        content: location.state.doc.content || "",
    });
    
    useEffect(() => {
      socket.current = io(SERVER_URL);

      socket.current.emit("joinDoc", docId);

      socket.current.on("docUpdate", (data) => {
        setNewDoc(data);
      });

      return () => {
        socket.current.disconnect();
      }
    }, [docId]);
   

    function handleTitleChange(event){
      const value = event.target.value;
      const updatedDoc = { ...newDoc, title: value };
      setNewDoc(updatedDoc);
      socket.current.emit("updateDoc", updatedDoc)
    }
    
    function handleContentChange(event){
      const value = event.target.value;
      const updatedDoc = { ...newDoc, content: value };
      setNewDoc(updatedDoc);
      socket.current.emit("updateDoc", updatedDoc)
    }

    const deleteDoc = async () => {
      if (window.confirm("Are you sure you want to delete the document?")) {
        await docModel.deleteDoc(newDoc._id);
        navigate("/my-docs")
      }
    };

    const inviteDoc = () => {
    navigate(`/invite/${newDoc._id}`, {
      replace: true,
      state: {
        doc: newDoc,
      },
    });
  }

    async function saveText() {
        await docModel.updateDoc(newDoc);
        navigate("/my-docs");
    }

    return (
       <div className="editor-container">
      <form className="editor-form" onSubmit={(e) => e.preventDefault()}>
        {" "}
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          className="input-field"
          value={newDoc.title}
          onChange={handleTitleChange}
          required
        />
        <label htmlFor="content">Text</label>
        <textarea
          id="content"
          name="content"
          className="text-area"
          value={newDoc.content}
          onChange={handleContentChange}
          rows="10"
          required
        />
        <div className="button-group">
          <button className="create-btn" onClick={saveText}>
                Save
          </button>

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/docs")}
          >
            Back
          </button>

          <button
            type="button"
            className="delete-btn"
            onClick={deleteDoc}
          >
            Delete
          </button>

          <button
            type="button"
            className="invite-btn"
            onClick={inviteDoc}
          >
            Invite
          </button>
        </div>
      </form>
    </div>


    );
}

export default UpdateDoc;