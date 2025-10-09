import { useNavigate } from "react-router-dom";
import docModel from "../../models/documents";
import "../../style/DocCard.css";

function DocCard({ doc }) {
  const navigate = useNavigate();

  const editDoc = () => {
    navigate(`/edit/${doc._id}`, {
      replace: true,
      state: {
        doc: doc,
      },
    });
  };

  const doc_date = doc.created_at ? dateFormatted(doc.created_at) : null;

  const inviteDoc = () => {
    navigate(`/invite/${doc._id}`, {
      replace: true,
      state: {
        doc: doc,
      },
    });
  }

  const deleteDoc = async () => {
    if (window.confirm("Are you sure you want to delete the document?")) {
      await docModel.deleteDoc(doc._id);
      window.location.reload();
    }
  };

  return (
    <div className="card">
      <h2>{doc.title}</h2>
      <p className="date">{doc_date}</p>
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
    </div>
  );
}

function dateFormatted(docDate) {
    const date = new Date(docDate)
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day  = ("0" + (date.getDate())).slice(-2);
    const year = date.getFullYear();
    const hour =  ("0" + (date.getHours())).slice(-2);
    const min =  ("0" + (date.getMinutes())).slice(-2);
    return year + "-" + month + "-" + day + " " + hour + ":" +  min;
}

export default DocCard;
