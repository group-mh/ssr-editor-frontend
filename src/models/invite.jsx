const inviteModel = {
  baseUrl: "http://localhost:1337",

  sendInvite: async function (docId, email) {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const from = user?.email;

      console.log("sending invite, docid:", docId, "email:", email, "from", from);

      const response = await fetch(`${inviteModel.baseUrl}/docs/${docId}/invite`, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({ email, from }),
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
