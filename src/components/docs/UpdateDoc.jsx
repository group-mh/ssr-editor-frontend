import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import docModel from "../../models/documents";

function UpdateDoc() {
    const location = useLocation();
    const navigate = useNavigate();
    
    
    const [newDoc, setNewDoc] = useState({
        _id: location.state.doc._id,
        title: location.state.doc.title,
        content: location.state.doc.content || "",
    });

    console.log("location.state:", location.state);

    function changeTitle(event) {
        const { name, value } = event.target;
        setNewDoc(prev => ({ ...prev, [name]: value }));
    }

    function changeText(event) {
        const { name, value } = event.target;
        setNewDoc(prev => ({ ...prev, [name]: value }));
    }

    async function saveText() {
        if (!newDoc.title || !newDoc.content) {
            alert("Please enter title and text");
            return;
        }

        await docModel.updateDoc(newDoc);
        navigate("/docs");
    }

    return (
        <div>
            <div>
                <button className="create-btn" onClick={saveText}>
                    Update
                </button>
            </div>

            <div>
                <input
                    value={newDoc.title}
                    className="title-input"
                    onChange={changeTitle}
                    name="title"
                />
                <textarea
                    value={newDoc.content}
                    className="text-area"
                    onChange={changeText}
                    name="content"
                    rows="25"
                    style={{ width: "100%", marginTop: "1em" }}
                />
            </div>
        </div>
    );
}

export default UpdateDoc;