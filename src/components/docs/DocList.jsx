import { useEffect } from "react";
import docModel from "../../models/documents";
import DocCard from "./DocCard";
import "../../style/DocList.css";

function DocList({ docs, setDocs }) {
    const user = JSON.parse(localStorage.getItem("user"));

    // Jag kommentar bort så alla kan see dokument som finns i databasen. KAn används för att ha vy där man ka bara see document en dokument via kanse get_documentbyid.
    // if (!user) {
    //     return <p className="notification">You must be logged in to see all documents.</p>
    // }

    async function fetchAllDocs() {
        const allDocs = await docModel.getAllDocs();

        const sortedDocs = allDocs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        // setDocs(allDocs);
        setDocs(sortedDocs);
    }

    useEffect(() => {
        fetchAllDocs();
    }, []);

    const docCards = docs.map((doc, index) => (
        <DocCard key={index} doc={doc} showButtons={false} />
    ));

    if (docCards.length > 0) {
        return <div className="list">{docCards}</div>;
    } else {
        return <p className="notification">No documents in the database</p>;
    }
}

export default DocList;