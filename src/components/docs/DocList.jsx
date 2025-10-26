import { useEffect } from "react";
import docModel from "../../models/documents";
import "../../style/DocList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines} from "@fortawesome/free-regular-svg-icons";


function DocList({ docs, setDocs }) {
  
  async function fetchAllDocs() {
    const allDocs = await docModel.getAllDocs();

    const sortedDocs = allDocs.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    
    setDocs(sortedDocs);
  }

  useEffect(() => {
    fetchAllDocs();
  }, []);

  function dateFormatted(docDate) {
    const date = new Date(docDate);
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
          <div className="name-column">Name</div>
          <div className="author-column">Author</div>
          <div className="created-column">Created</div>
        </div>

        {!docs || docs.length === 0 ? (
          <div className="docs-empty">No documents in the database.</div>
        ) : (
          docs.map((doc) => {

            const title = doc.title;
            const author = doc.author.join(", ");
            const created = dateFormatted(doc.created_at);

            return (
              <div className="doc-row" key={doc._id}>
                <div className="name-column">
                  <span className="name-doc" title={title}>
                    <FontAwesomeIcon icon={faFileLines} className="doc-icon" />
                    <span>{title}</span>
                  </span>
                </div>
                <div className="author-column" title={author}>{author}</div>
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
