import { useNavigate } from "react-router-dom";
import { useState } from "react";
import docModel from "../../models/documents";  
import "../../style/CreateEditor.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css";


function CreateEditor() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const modules = {
      toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
    };

    const formats = [
      'header',
      'bold', 'italic', 'underline', 'strike',
      'color', 'background',
      'list', 'bullet',
      'align',
      'link', 'image'
    ];

    const goBack = async () => {
      navigate("/my-docs");
    };

  async function handleSave(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"))

      if (!user || !user.username) {
        alert("You must be logged in!")
        return;
      }

      if (!title.trim()) {
        alert("Title can't be empty!")
        return;
      }

      const text = content.replace(/<(.|\n)*?>/g, "").trim();
      if (!text) {
        alert("Text can't be empty!")
        return;
      }
      
      const docData = {
      title: title.trim(),
      content,
      author: user.username,
    };

    console.log("Create document with data:", docData);
    const createdDoc = await docModel.createDoc(docData);
    
    console.log("Response from createDoc:", createdDoc);
    console.log("createdDoc._id:", createdDoc?._id);

    console.log("Document created, navigating to /edit/" + createdDoc);
    alert("Document created successfully!");

    navigate("/my-docs");


    } catch (error) {
        console.error("Error creating doucment:", error);
        alert("Faild to create document!");

      } finally {
        setIsLoading(false);
      }
    
  }

  return (
   <>
   <div className="create-toolbar">
         <h2>Create New Document</h2>
         <p className="toolbar-description">
          Enter title and text, click save icon to create the document.
        </p>
        <div className="toolbar-actions">
          <button
            className="back-button"
            onClick={goBack}
            title="Back"
            aria-label="Back">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>

          <input
            type="text"
            id="doc-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title"
            aria-label="Enter title"
            title="Enter title"
          />

          <button 
            className="save-button"
            aria-label="Save"
            title="Save"
            onClick={handleSave}
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faSave} />
          </button>

          <button
            className="cancel-button"
            aria-label="Cancel"
            title="Cancel"
            onClick={goBack}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        </div>
  
       
        

        <div className="create-editor-container">
          <ReactQuill 
            className='create-quill-editor'
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="Enter text here..."
          />
        </div>
      
        </>
  );
}

export default CreateEditor;
