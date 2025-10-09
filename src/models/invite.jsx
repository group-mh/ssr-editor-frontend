const inviteModel = {
  baseUrl: "http://localhost:1337",

  sendInvite: async function (docId, email) {
    try {
      const token = localStorage.getItem("token");

      console.log("sending invite to docId:", docId, "email:", email)

      const response = await fetch(`${inviteModel.baseUrl}/docs/${docId}/invite`, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({ email }),
      });
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Error: ${response.status}`);
      }
   
      return { success: true, message: result.message || "Invite has been sent." };
    } catch (error) {
      console.error("sendInvite error:", error.message);
      return { success: false, message: error.message || "Something went wrong."};
    }
  },
};

export default inviteModel;
