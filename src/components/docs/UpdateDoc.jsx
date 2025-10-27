import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import docModel from "../../models/documents";
import "../../style/CreateEditor.css";
import "../../style/UpdateDoc.css";
import { io } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUserPlus,
  faTrash,
  faComment,
  faWindowRestore,
} from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css";

function UpdateDoc() {
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useRef(null);
  const quillRef = useRef(null);
  const docId = location.state.doc.id;

  const [newDoc, setNewDoc] = useState({
    id: docId,
    title: location.state.doc.title,
    content: location.state.doc.content || "",
    comments: location.state.doc.comments || [],
  });

  

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUser = user?.username || "Anonymous";

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  
  useEffect(() => {
    socket.current = io(docModel.baseUrl);
    socket.current.emit("join_document", docId);

    socket.current.on("document:update", (data) => {
      setNewDoc(data);
      if (data.comments) {
        setComments(data.comments);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [docId]);

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
        docId: newDoc.id,
        ...updatedDoc,
      });
    }
  }

  function handleContentChange(value) {
    const updatedDoc = { ...newDoc, content: value };
    setNewDoc(updatedDoc);
    socket.current.emit("document:update", { docId, ...updatedDoc });
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
  };

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
          ref={quillRef}
          className="update-quill-editor"
          theme="snow"
          value={newDoc.content}
          onChange={handleContentChange}
          modules={modules}
          formats={formats}
        />
      </div>

      <div className="comments-sidebar">
        <h3>
          <FontAwesomeIcon icon={faComment} /> Comments ({comments.length})
        </h3>

        {comments.length === 0 ? (
          <p className="no-comments">No comments</p>
        ) : (
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">{comment.user}</span>
                  <span className="comment-timestamp">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="comment-selected-text">
                  "<em>{comment.selectedText}</em>"
                </div>

                <p className="comment-text">{comment.text}</p>

                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="delete-comment-btn"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCommentBox && (
        <div
          className="comment-box"
          style={{
            top: commentBoxPosition.top,
            left: commentBoxPosition.left,
          }}
        >
          <div className="comment-box-header">
            <strong className="comment-box-title">Add Comment</strong>
          </div>

          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write comment here.."
            autoFocus
          />

          <div className="comment-box-actions">
            <button
              onClick={() => {
                setShowCommentBox(false);
                setCommentText("");
              }}
              className="comment-box-cancel-btn"
            >
              Cancel
            </button>

            <button
              onClick={handleAddComment}
              disabled={!commentText.trim()}
              className="comment-box-submit-btn"
            >
              Comment
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default UpdateDoc;
