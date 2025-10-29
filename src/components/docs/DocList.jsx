import { useEffect } from "react";
import docModel from "../../models/documents";
import "../../style/DocList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";

function DocList({ docs, setDocs }) {
  async function fetchAllDocs() {
    const allDocs = await docModel.getAllDocs();

    console.log("Docs fetched:", allDocs);
    if (allDocs.length > 0) {
      console.log("First doc created: ", allDocs[0].created_at);
      console.log("First doc keys: ", Object.keys(allDocs[0]));
    }

    const sortedDocs = allDocs.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    setDocs(sortedDocs);
  }

  useEffect(() => {
    fetchAllDocs();
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

  return (
    <main className="all-docs">
      <div className="docs-container">
        <div className="docs-grid">
          <div className="title-column">Title</div>
          <div className="author-column">Author</div>
          <div className="created-column">Created</div>
        </div>

        {!docs || docs.length === 0 ? (
          <div className="docs-empty">No documents in the database.</div>
        ) : (
          docs.map((doc) => {
            const title = doc.title;
            const author = Array.isArray(doc.author)
              ? doc.author.join(", ")
              : (doc.author || "Unknown");
            const created = dateFormatted(doc.created_at);

            return (
              <div className="doc-row" key={doc.id}>
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
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}

export default DocList;
