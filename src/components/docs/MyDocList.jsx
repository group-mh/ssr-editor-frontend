import { useEffect } from "react";
import docModel from "../../models/documents";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faUserPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import "../../style/DocList.css";

function MyDocList({ docs, setDocs }) {
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMyDocs() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!user || !token) {
          console.error("User, token missing.");
          setDocs([]);
          return;
        }

        const myDocs = await docModel.getMyDocs();
        setDocs(myDocs);
      } catch (error) {
        console.error("Faild when fetching users documents", error.message);
        setDocs([]);
      }
    }
    fetchMyDocs();
  }, []);

  function dateFormatted(docDate) {
    if (!docDate) return "";

    const timestamp = Number(docDate);
    const date = new Date(timestamp);

    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const year = date.getFullYear();
    const hour = ("0" + date.getHours()).slice(-2);
    const min = ("0" + date.getMinutes()).slice(-2);
    return year + "-" + month + "-" + day + " " + hour + ":" + min;
  }

  async function handleDelete(doc) {
    if (confirm(`Are you sure you want to delete "${doc.title}"?`)) {
      const result = await docModel.deleteDoc(doc.id);
      if (result) {
        console.log("Deleted successfully:", result);
        setDocs((prevDocs) => prevDocs.filter((d) => d.id !== doc.id));
      } else {
        alert("Failed to delete document.");
      }
    }
  }

  function handleUpdate(doc) {
    navigate(`/edit/${doc.id}`, {
      state: {
        doc: doc,
      },
    });
  }

  function handleInvite(docId) {
    navigate(`/invite/${docId}`);
  }

  return (
    <main className="all-docs">
      <div className="docs-container">
        <div className="docs-grid">
          <div className="title-column">Title</div>
          <div className="author-column">Author</div>
          <div className="created-column">Created</div>
          <div className="actions-column"></div>
        </div>

        {!docs || docs.length === 0 ? (
          <div className="docs-empty">No documents in the database.</div>
        ) : (
          docs.map((doc) => {
            const title = doc.title;
            const author = Array.isArray(doc.author)
              ? doc.author.join(", ")
              : doc.author || "Unknown";
            const created = dateFormatted(doc.created_at);

            return (
              <div
                className="my-doc-row"
                key={doc.id}
                onClick={() => {
                  console.log("Row clicked: ", doc.id);
                  handleUpdate(doc);
                }}
              >
                <div className="title-column">
                  <span className="title-doc" title={title}>
                    <FontAwesomeIcon icon={faFileLines} className="doc-icon" />
                    <span>{title}</span>
                  </span>
                </div>
                <div className="author-column" title={author}>
                  {author}
                </div>
                <div className="created-column">{created}</div>
                <div className="actions-column">
                  <button
                    className="icon-btn invite-btn"
                    title="Invite"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInvite(doc.id);
                    }}
                  >
                    <FontAwesomeIcon icon={faUserPlus} />
                  </button>
                  <button
                    className="icon-btn delete-btn"
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(doc);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}

export default MyDocList;
