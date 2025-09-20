import { useNavigate } from "react-router-dom";

function DocCard({ doc }) {
    const navigate = useNavigate();

    const editDoc = () => {
        navigate("/edit", {
            replace: true,
            state: {
                doc: doc,
            },
        });
    };

    return (
        <div className="card">
            <h2>{doc.title}</h2>
            <button className="edit-btn" onClick={editDoc}>
                Edit
            </button>
        </div>
    );
}

export default DocCard;