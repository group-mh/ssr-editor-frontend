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
} from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css";

function UpdateDoc() {
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useRef(null);
  const quillRef = useRef(null);
  const isSocketUpdate = useRef(false);
  const docId = location.state.doc.id;

  const [newDoc, setNewDoc] = useState({
    id: docId,
    title: location.state.doc.title,
    content: location.state.doc.content || "",
    comments: location.state.doc.comments || [],
  });

  const [comments, setComments] = useState(location.state.doc.comments || []);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentBoxPosition, setCommentBoxPosition] = useState({
    top: 0,
    left: 0,
  });
  const [selectedText, setSelectedText] = useState("");

  const [selectedComment, setSelectedComment] = useState(null);

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

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "align",
    "link",
    "image",
  ];

  useEffect(() => {
    console.log("Socket connected to:", docModel.baseUrl);
    socket.current = io(docModel.baseUrl);

    socket.current.emit("join_document", docId);
    console.log("Joining room:", docId);

    socket.current.on("document:update", (data) => {
      isSocketUpdate.current = true;
      setNewDoc(data);
      if (data.comments) {
        setComments(data.comments);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [docId]);

  useEffect(() => {
    const editor = quillRef.current?.getEditor();
    if (!editor || comments.length === 0) return;

    // highlighting
    comments.forEach((comment) => {
      if (comment.index !== undefined && comment.length !== undefined) {
        editor.formatText(comment.index, comment.length, {
          background: "#fff3cd",
        });
      }
    });
  }, [comments]);

  useEffect(() => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    const handleEditorClick = () => {
      const selection = editor.getSelection();
      if (!selection) return;

      const clickIndex = selection.index;

      const clickedComment = comments.find(
        (comment) =>
          comment.index !== undefined &&
          comment.length !== undefined &&
          clickIndex >= comment.index &&
          clickIndex < comment.index + comment.length
      );

      if (clickedComment) {
        setSelectedComment(clickedComment.id);

        const commentElement = document.getElementById(
          `comment-${clickedComment.id}`
        );

        if (commentElement) {
          commentElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      } else {
        setSelectedComment(null);
      }
    };

    const editorElement = editor.root;
    editorElement.addEventListener("click", handleEditorClick);

    return () => {
      editorElement.removeEventListener("click", handleEditorClick);
    };
  }, [comments]);

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
    if (isSocketUpdate.current) {
      isSocketUpdate.current = false;
      return;
    }

    const updatedDoc = { ...newDoc, content: value };
    setNewDoc(updatedDoc);

    if (socket.current) {
      socket.current.emit("document:update", { docId, ...updatedDoc });
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
  };

  const goBack = async () => {
    const docToSave = {
      ...newDoc,
      comments: comments,
    };
    await docModel.updateDoc(docToSave);
    navigate("/my-docs");
  };

  function handleAddComment() {
    if (!commentText.trim()) return;

    const editor = quillRef.current?.getEditor();
    const selection = editor?.getSelection();

    if (!selection) return;

    const newComment = {
      id: Date.now().toString(),
      user: currentUser,
      selectedText: selectedText,
      text: commentText,
      createdAt: new Date().toISOString(),
      index: selection.index,
      length: selection.length,
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);

    const updatedDoc = {
      ...newDoc,
      comments: updatedComments,
    };

    setNewDoc(updatedDoc);

    if (editor && selection) {
      editor.formatText(selection.index, selection.length, {
        background: "#fff3cd",
      });
    }

    if (socket.current) {
      socket.current.emit("document:update", {
        docId,
        ...updatedDoc,
      });
    }

    setShowCommentBox(false);
    setCommentText("");
    setSelectedText("");
  }

  function handleDeleteComment(commentId) {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      const commentToDelete = comments.find((c) => c.id === commentId);

      if (commentToDelete && quillRef.current) {
        const editor = quillRef.current.getEditor();
        if (
          commentToDelete.index !== undefined &&
          commentToDelete.length !== undefined
        ) {
          editor.formatText(commentToDelete.index, commentToDelete.length, {
            background: false,
          });
        }
      }

      const updatedComments = comments.filter((c) => c.id !== commentId);
      setComments(updatedComments);

      const updatedDoc = {
        ...newDoc,
        comments: updatedComments,
      };

      setNewDoc(updatedDoc);

      if (socket.current) {
        socket.current.emit("document:update", {
          docId,
          ...updatedDoc,
        });
      }

      setSelectedComment(null);
    }
  }

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection.toString().trim();

      if (text && quillRef.current) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setSelectedText(text);
        setCommentBoxPosition({
          top: rect.bottom + window.scrollY + 10,
          left: rect.left + window.scrollX,
        });
        setShowCommentBox(true);
      }
    };

    const editor = quillRef.current?.getEditor();
    if (editor) {
      const editorElement = editor.root;
      editorElement.addEventListener("mouseup", handleSelection);

      return () => {
        editorElement.removeEventListener("mouseup", handleSelection);
      };
    }
  }, []);

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
              <div
                id={`comment-${comment.id}`}
                key={comment.id}
                className={`comment-item ${
                  selectedComment === comment.id ? "comment-item-selected" : ""
                }`}
              >
                <div className="comment-header">
                  <span className="comment-author">{comment.user}</span>
                  <span className="comment-timestamp">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {comment.selectedText && (
                  <div className="comment-selected-text">
                    "<em>{comment.selectedText}</em>"
                  </div>
                )}

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
                setSelectedText("");
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
