import { useEffect } from "react";
import docModel from "../../models/documents";
import DocCard from "./DocCard";
import "../../style/DocList.css";

function MyDocList({ docs, setDocs }) {
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
  }, [setDocs]);

  const docCards = docs.map((doc, index) => <DocCard key={index} doc={doc} showButtons={true}/>);

  if (docCards.length > 0) {
    return <div className="list">{docCards}</div>;
  } else {
    return (
      <p className="notification">You have no documents in the database</p>
    );
  }
}

export default MyDocList;
