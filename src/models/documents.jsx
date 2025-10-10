const docModel = {
    baseUrl: window.location.href.includes("localhost")
        ? "http://localhost:1337"
        : "https://jsramverk-editor-hahi24-byewf7bndbf9ehhf.swedencentral-01.azurewebsites.net",
  baseName: "/ssr-editor-frontend/",

  getAllDocs: async function getAllDocs() {
    try {
      const response = await fetch(`${docModel.baseUrl}/docs`, {
        headers: {
          "content-type": "application/json",
        },
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("getAllDocs error:", error.message);
      return [];
    }
  },

  getMyDocs: async function getMyDocs() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${docModel.baseUrl}/my-docs`, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("getAllDocs error:", error.message);
      return [];
    }
  },

  createDoc: async function createDoc(newDoc) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${docModel.baseUrl}/docs`, {
        body: JSON.stringify(newDoc),
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
      return result;
    } catch (error) {
      console.error("createDoc error:", error.message);
      return null;
    }
  },

  updateDoc: async function updateDoc(updateDoc) {
    try {
      const token = localStorage.getItem("token");
      const { _id, ...updateData } = updateDoc;

      const response = await fetch(`${docModel.baseUrl}/docs/${_id}`, {
        body: JSON.stringify(updateData),
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("updateDoc error:", error.message);
      return null;
    }
  },

  deleteDoc: async function deleteDoc(id) {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${docModel.baseUrl}/docs/${id}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("deleteDoc error:", error.message);
      return null;
    }
  },
};

export default docModel;
