const docModel = {
    baseUrl: window.location.href.includes("localhost")
        ? "http://localhost:1337"
        : "",
    baseName: window.location.href.includes("localhost")
        ? "/"
        : "/",

    getAllDocs: async function getAllDocs() {
        const response = await fetch(`${docModel.baseUrl}/docs`, {
            headers: {
                "content-type": "application/json",
            },
            method: "GET",
        });

        const result = await response.json();
        return result.data;
    },

    createDoc: async function createDoc(newDoc) {
        const response = await fetch(`${docModel.baseUrl}/docs`, {
            body: JSON.stringify(newDoc),
            headers: {
                "content-type": "application/json",
            },
            method: "POST",
        });

        const result = await response.json();


    console.log("createDoc response result:", result);

    return result;
    },

 
    updateDoc: async function updateDoc(updateDoc) {
        const response = await fetch(
            `${docModel.baseUrl}/docs/${updateDoc._id}`,
            {
                body: JSON.stringify(updateDoc),
                headers: {
                    "content-type": "application/json",
                },
                method: "PUT",
            }
        );

        const result = await response.json();
        return result;
    }
};

export default docModel;