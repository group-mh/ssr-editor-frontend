import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import docModel from "../../models/documents";
import "../../style/CreateEditor.css";
import "../../style/UpdateDoc.css";
import { io } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUserPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css";

function UpdateDoc() {
  console.log("UpdateDoc loaded");
    const location = useLocation();
    const navigate = useNavigate();

    const socket = useRef(null);
    const isSocketUpdate = useRef(false)

  const docId = location.state.doc.id;

    const [newDoc, setNewDoc] = useState({
        _id: docId,
        title: location.state.doc.title,
        content: location.state.doc.content || "",
    });

    const modules = {
      toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
    };

    const formats = [
      'header',
      'bold', 'italic', 'underline', 'strike',
      'color', 'background',
      'list', 'bullet',
      'align',
      'link', 'image'
    ];

    useEffect(() => {
      console.log("Socket connected to:", docModel.baseUrl);
      socket.current = io(docModel.baseUrl);

    socket.current.emit("join_document", docId);
    console.log("Joining room:", docId);

      socket.current.on("document:update", (data) => {
        isSocketUpdate.current = true;
        setNewDoc(data);
      });

    return () => {
      socket.current.disconnect();
    };
  }, [docId]);

  
  function handleTitleChange(event) {
    const value = event.target.value;
    const updatedDoc = { ...newDoc, title: value };
    setNewDoc(updatedDoc);

      if (socket.current) {
        socket.current.emit("document:update", {
        docId: newDoc._id,
        ...updatedDoc
      });
      }
      
    }
    
    function handleContentChange(value){

      if (isSocketUpdate.current) {
        isSocketUpdate.current = false;
        return;
      }

      const updatedDoc = { ...newDoc, content: value };
      setNewDoc(updatedDoc);

      if (socket.current) {
        socket.current.emit("document:update", {
          docId: newDoc._id,
          ...updatedDoc
        });
      }
      
    }

  const deleteDoc = async () => {
    if (window.confirm("Are you sure you want to delete the document?")) {
      await docModel.deleteDoc(newDoc.id);
      navigate("/my-docs");
    }
  };

  const inviteDoc = () => {
    navigate(`/invite/${newDoc.id}`, {
      replace: true,
      state: {
        doc: newDoc,
      },
    });
  }

    const goBack = async () => {
      await docModel.updateDoc(newDoc);
      navigate("/my-docs");
    };

  async function saveText() {
    const docToSave = {
      ...newDoc,
      comments: comments
    };
    await docModel.updateDoc(docToSave);
    navigate("/my-docs");
  }

    return (
      <>
        <div className="create-toolbar">
          <div className="toolbar-actions2">
          <button 
            className="back-button"
            onClick={goBack}
            title="Back"
            aria-label="Back"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>

          <input
            type="text"
            id="doc-title"
            value={newDoc.title}
            onChange={handleTitleChange}
            placeholder="Enter a title"
            aria-label="Title"
            title="Title"
          />

          <button
            className="invite-button"
            onClick={inviteDoc}
            aria-label="Invite"
            title="Invite"
          >
            <FontAwesomeIcon icon={faUserPlus} />
          </button>

          <button
            className="delete-button"
            onClick={deleteDoc} 
            aria-label="Delete"
            title="Delete"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
          </div>
        </div>

        <div className="update-editor-container">
          <ReactQuill 
            className='update-quill-editor'
            theme="snow"
            value={newDoc.content}
            onChange={handleContentChange}
            modules={modules}
            formats={formats}
          />
        </div>
        </>
    );
}

export default UpdateDoc;
