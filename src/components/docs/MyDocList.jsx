import { useEffect } from "react";
import docModel from "../../models/documents";
import DocCard from "./DocCard";
import "../../style/DocList.css";

function MyDocList({ docs, setDocs }) {
  useEffect(() => {
    async function fetchDocs() {
      const allDocs = await docModel.getAllDocs();

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        console.error("No user found.");
        setDocs([]);
        return;
      }

      const myDocs = allDocs.filter(
        (doc) => doc.username === user.username || doc.username === user.email
      );

      setDocs(myDocs);
    }
    fetchDocs();
  }, [setDocs]);

  const docCards = docs.map((doc, index) => <DocCard key={index} doc={doc} />);

  if (docCards.length > 0) {
    return <div className="list">{docCards}</div>;
  } else {
    return (
      <p className="notification">You have no documents in the database</p>
    );
  }
}

export default MyDocList;
