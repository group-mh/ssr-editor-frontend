import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import docModel from "../../models/documents";
import "../../style/CreateEditor.css";

function UpdateDoc() {
    const location = useLocation();
    const navigate = useNavigate();
    
    
    const [newDoc, setNewDoc] = useState({
        _id: location.state.doc._id,
        title: location.state.doc.title,
        content: location.state.doc.content || "",
    });

    function handleChange(event){
        const { name, value } = event.target;
        setNewDoc(prev => ({ ...prev, [name]: value }));
    }

    const deleteDoc = async () => {
      if (window.confirm("Are you sure you want to delete the document?")) {
        await docModel.deleteDoc(newDoc._id);
        navigate("/docs")
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
        navigate("/docs");
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
          onChange={handleChange}
          required
        />
        <label htmlFor="content">Text</label>
        <textarea
          id="content"
          name="content"
          className="text-area"
          value={newDoc.content}
          onChange={handleChange}
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