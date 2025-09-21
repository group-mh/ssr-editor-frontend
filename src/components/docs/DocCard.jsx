import { useNavigate } from "react-router-dom";
import docModel from "../../models/documents";

function DocCard({ doc }) {
    const navigate = useNavigate();

    const editDoc = () => {
        navigate("/edit/${doc._id}", {
            replace: true,
            state: {
                doc: doc,
            },
        });
    };

    const deleteDoc = async () => {
        if (window.confirm("Säker på att du vill radera dokumentet?")) {
            await docModel.deleteDoc(doc._id);
            window.location.reload();
        }
    };

    return (
        <div className="card">
            <h2>{doc.title}</h2>
            <button className="edit-btn" onClick={editDoc}>
                Edit
            </button>
            <button className="delete-btn" onClick={deleteDoc}>
                Radera
            </button>
        </div>
    );
}

export default DocCard;