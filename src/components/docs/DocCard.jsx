import { useNavigate } from "react-router-dom";
import docModel from "../../models/documents";
import "../../style/DocCard.css";

function DocCard({ doc, showButtons = true, setDocs }) {
  const navigate = useNavigate();

  const editDoc = () => {
    navigate(`/edit/${doc.id}`, {
      replace: true,
      state: {
        doc: doc,
      },
    });
  };

  const doc_date = doc.created_at ? dateFormatted(doc.created_at) : null;

  const inviteDoc = () => {
    navigate(`/invite/${doc.id}`, {
      replace: true,
      state: {
        doc: doc,
      },
    });
  }

  const deleteDoc = async () => {
    if (window.confirm("Are you sure you want to delete the document?")) {
      const result = await docModel.deleteDoc(doc.id);
      if (result) {
        console.log("Deleted successfully:", result);
        // window.location.reload();
        // Get updated docuemts list/State from parent component reloading trigger unnessary fetches.
        setDocs(prevDocs => prevDocs.filter(d => d.id !== doc.id));
      } else {
        alert("Failed to delete document. See console for details.");
      }
    }
  };

  return (
    <div className="card">
      <h2>{doc.title}</h2>
      <div className="doc-info">
        <p className="date">Created: {doc_date}</p>
        <p className="author">Author: {doc.author.join(", ")}</p>
      </div>
      {showButtons && (
        <div className="button-group">
          <button className="edit-btn" onClick={editDoc}>
            Edit
          </button>
          <button className="delete-btn" onClick={deleteDoc}>
            Delete
          </button>
          <button className="invite-btn" onClick={inviteDoc}>
            Invite
          </button>
        </div>
      )}
    </div>
  );
}

function dateFormatted(docDate) {
  const date = new Date(docDate)
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + (date.getDate())).slice(-2);
  const year = date.getFullYear();
  const hour = ("0" + (date.getHours())).slice(-2);
  const min = ("0" + (date.getMinutes())).slice(-2);
  return year + "-" + month + "-" + day + " " + hour + ":" + min;
}

export default DocCard;
