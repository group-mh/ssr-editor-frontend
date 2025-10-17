import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import docModel from "../../models/documents";
import "../../style/CreateEditor.css";
import { io } from "socket.io-client";

function UpdateDoc() {
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useRef(null);
  const textareaRef = useRef(null);
  const [highlightId, setHighlightId] = useState(null);
  const [currentRange, setCurrentRange] = useState(null);

  const docId = location.state.doc._id;

  const [newDoc, setNewDoc] = useState({
    _id: docId,
    title: location.state.doc.title,
    content: location.state.doc.content || "",
    comments: location.state.doc.comments || [],
  });

  const [comments, setComments] = useState(location.state.doc.comments || []);
  const [selectedText, setSelectedText] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [boxPosition, setBoxPosition] = useState({ top: 0, left: 0 });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUser = user?.username || "Anonymous";

  console.log("currentuser:", currentUser);

  useEffect(() => {
    console.log("Socket connected to:", docModel.baseUrl);
    socket.current = io(docModel.baseUrl);

    socket.current.emit("join_document", docId);
    console.log("Joining room:", docId);

    socket.current.on("document:update", (data) => {
      
      setNewDoc(data);
      if (data.comments) {
        setComments(data.comments);
      }
    });

    //setComments([]);

    if (textareaRef.current && newDoc.content) {
      textareaRef.current.innerHTML = newDoc.content;
    }

    return () => {
      socket.current.disconnect();
    };
  }, [docId]);

  
  function handleTitleChange(event) {
    const value = event.target.value;
    const updatedDoc = { ...newDoc, title: value };
    setNewDoc(updatedDoc);

    socket.current.emit("document:update", {
      docId: docId,
      ...updatedDoc,
    });
  }

  function handleContentChange() {
    const value = textareaRef.current.innerHTML.replace(/<div><br><\/div>/g, '<br>');
    //const value = event.target.value;
    const updatedDoc = { ...newDoc, content: value, comments: comments };
    setNewDoc(updatedDoc);

    socket.current.emit("document:update", {
      docId: docId,
      ...updatedDoc,
    });
  }

  function handleTextSelection(e) {
    const selection = window.getSelection();
    const selected = selection.toString();

    if (selected.trim().length > 0) {
      const range = selection.getRangeAt(0);

      setCurrentRange(range.cloneRange());

      const rect = range.getBoundingClientRect();
      const textareaRect = textareaRef.current.getBoundingClientRect();

      setBoxPosition({
            top: rect.bottom - textareaRect.top + 5,
            left: rect.left - textareaRect.left,
          });
        
        setSelectedText(selected);
        setHighlightId(Date.now().toString());
        setShowCommentBox(true);
      } else {
        setShowCommentBox(false);
      }
    }
   

  function handleAddComment() {
    if (commentText.trim() === "" || !currentRange) return;

    const id = highlightId;

    const span = document.createElement("span");
    span.className = "highlighted";
    span.dataset.commentId = id;
    span.onclick = () => scrollToComment(id);

    try {
      const extracted = currentRange.extractContents();
      span.appendChild(extracted);

      currentRange.insertNode(span);

      const newComment = {
      id: highlightId,
      user: currentUser,
      line: 0,
      selectedText,
      text: commentText.trim(),
      author: currentUser,
      createdAt: new Date(),
    };

    console.log("selected text:", selectedText)

    setComments((prev) => [...prev, newComment]);
    setCommentText("");
    setSelectedText("");
    setShowCommentBox(false);
    setCurrentRange(null);

    handleContentChange();

    socket.current.emit("document:update", {
      docId: newDoc._id,
      title: newDoc.title,
      content: textareaRef.current.innerHTML,
      comments: [...comments, newComment],
    })

    } catch (err) {
      console.error("Unable to highlight text:", err)
    }
  }

  async function handleDeleteComment(id) {
    const updatedComments = comments.filter((c) => c.id !==id);
    setComments(updatedComments);
    
    const highlightedSpan = document.querySelector(`[data-comment-id="${id}"]`);
    if (highlightedSpan) {
      const parent = highlightedSpan.parentNode;

      while (highlightedSpan.firstChild) {
        parent.insertBefore(highlightedSpan.firstChild, highlightedSpan);
      }
      parent.removeChild(highlightedSpan);

      parent.normalize();

      const value = textareaRef.current.innerHTML.replace(/<div><br><\/div>/g, '<br>');
    //const value = event.target.value;
    const updatedDoc = { 
      ...newDoc,
      content: value,
      comments: updatedComments
    };
    setNewDoc(updatedDoc);

    await docModel.updateDoc(updatedDoc);

      socket.current.emit("document:update", {
        docId: docId,
        ...updateDoc,
      });
    }
  }

  function scrollToComment(id) {
    const element = document.getElementById(`comment-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("highlight-comment");

      setTimeout(() => {
        element.classList.remove("highlight-comment");
      }, 1000);
    }
  }

  function handleContentClick(event) {
    const element = event.target.closest('.highlighted');
    if (!element) return;
    const id = element.dataset.commentId;
    if (id) scrollToComment(id);
  }

  const deleteDoc = async () => {
    if (window.confirm("Are you sure you want to delete the document?")) {
      await docModel.deleteDoc(newDoc._id);
      navigate("/my-docs");
    }
  };

  const inviteDoc = () => {
    navigate(`/invite/${newDoc._id}`, {
      replace: true,
      state: {
        doc: newDoc,
      },
    });
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
    <div className="editor-layout">
      <div className="editor-container">
        <form className="editor-form" onSubmit={(e) => e.preventDefault()}>
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
          <div
            ref={textareaRef}
            id="content"
            className="text-area"
            contentEditable
            onInput={handleContentChange}
            onMouseUp={handleTextSelection}
            onClick={handleContentClick}
          />

          <div className="button-group">
            <button className="create-btn" onClick={saveText}>
              Save
            </button>

            <button
              type="button"
              className="back-btn"
              onClick={() => navigate("/my-docs")}
            >
              Back
            </button>

            <button type="button" className="delete-btn" onClick={deleteDoc}>
              Delete
            </button>

            <button type="button" className="invite-btn" onClick={inviteDoc}>
              Invite
            </button>
          </div>

          {showCommentBox && (
            <div
              className="comment-Box"
              style={{
                position: "absolute",
                top: boxPosition.top,
                left: boxPosition.left,
              }}
            >
              <textarea
                placeholder="Write a comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button onClick={handleAddComment}>Add Comment</button>
            </div>
          )}
        </form>
      </div>

      <section className="comments-section">
        <h2>Comments</h2>
        <ul className="comments-list">
          {comments.length === 0 && (
            <li className="no-comments">No comments.</li>
          )}
          {comments.map((comment) => (
            <li
              key={comment.id}
              id={`comment-${comment.id}`}
              className="comment-item"
            >
              <div>
                <span className="comment-author">{comment.user}</span>{" "}
                <span className="comment-timestamp">{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}</span>
              </div>

              {comment.selectedText && (
                <p className="comment-highlighted-text">
                  "<em>{comment.selectedText}</em>"
                </p>
              )}

              <p className="comment-text">{comment.text}</p>
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="delete-comment-btn"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default UpdateDoc;
