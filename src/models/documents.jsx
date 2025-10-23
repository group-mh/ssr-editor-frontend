const docModel = {
  baseUrl: window.location.href.includes("localhost")
    ? "http://localhost:1337"
    : "https://jsramverk-editor-hahi24-byewf7bndbf9ehhf.swedencentral-01.azurewebsites.net",
  baseName: "/ssr-editor-frontend/",

  getAllDocs: async function getAllDocs() {
    const query = `
      query {
        documents {
          id
          title
          content
          author
          created_at
          comments {
            id
            user
            text
          }
        }
      }
    `;
    try {
      const response = await fetch(`${docModel.baseUrl}/graphql`, {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      return result.data.documents;
    } catch (error) {
      console.error("getAllDocs error:", error.message);
      return [];
    }
  },

  getMyDocs: async function getMyDocs() {
    const query = `
        query {
          myDocuments {
            id
            title
            content
            author
            created_at
            comments {
              id
              user
              text
            }
          }
        }
      `;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${docModel.baseUrl}/graphql`, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      console.log("GraphQL myDocs result:", result.data);
      return result.data.myDocuments;
    } catch (error) {
      console.error("getAllDocs error:", error.message);
      return [];
    }
  },

  createDoc: async function createDoc(newDoc) {
    try {
      const token = localStorage.getItem("token");
      const mutation = `
          mutation {
            addDocument(
              title: "${newDoc.title}",
              content: "${newDoc.content}"
            ) {
              id
              title
              content
              author
              created_at
              comments {
                id
                user
                text
              }
            }
          }
        `;

      const response = await fetch(`${docModel.baseUrl}/graphql`, {
        body: JSON.stringify({ query: mutation }),
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      console.log("createDoc response result:", result);
      return result.data.addDocument;
    } catch (error) {
      console.error("createDoc error:", error.message);
      return null;
    }
  },

  updateDoc: async function updateDoc(updateDoc) {
    try {
      const token = localStorage.getItem("token");
      const { id, title, content, comments } = updateDoc;
      const mutation = `
      mutation {
        updateDocument(
          id: "${id}",
          title: "${title}",
          content: "${content}"
        ) {
          id
          title
          content
          author
          created_at
          comments {
            id
            user
            text
          }
        }
      }
    `;
      const response = await fetch(`${docModel.baseUrl}/graphql`, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({ query: mutation }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      console.log("updateDoc response:", result);
      return result.data.updateDocument;
    } catch (error) {
      console.error("updateDoc error:", error.message);
      return null;
    }
  },

  deleteDoc: async function deleteDoc(id) {
    try {
      const token = localStorage.getItem("token");

      const mutation = `
          mutation {
            deleteDocument(id: "${id}")
          }
        `;

      const response = await fetch(`${docModel.baseUrl}/graphql`, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({ query: mutation }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      return result.data.deleteDocument;
    } catch (error) {
      console.error("deleteDoc error:", error.message);
      return null;
    }
  },
};

export default docModel;
