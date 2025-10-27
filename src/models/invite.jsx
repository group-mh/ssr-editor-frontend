const inviteModel = {
  baseUrl: "http://localhost:1337",

  sendInvite: async function (docId, email) {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      // const from = user?.username;

      // console.log("sending invite, docid:", docId, "email:", email, "from", from);
      console.log("sending invite, docid:", docId, "email:", email);

      const mutation = `
          mutation {
            inviteUser(docId: "${docId}", email: "${email}") 
          }
        `;

      // const response = await fetch(`${inviteModel.baseUrl}/docs/${docId}/invite`, {
      const response = await fetch(`${inviteModel.baseUrl}/graphql`, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({ query: mutation }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      if (!response.ok) {
        if (response.status === 500) {
          return {
            success: false,
            message:
              "ERROR: Invite could not be sent. Mailgun sandbox accounts can only send to authorized recipients.",
          };
        }
        throw new Error(result.message || `Error: ${response.status}`);
      }

      return {
        success: true,
        message: result.data?.inviteUser || "Invite has been sent."
        // message: result.data?.inviteUser?.message || "Invite has been sent.",
      };
    } catch (error) {
      console.error("sendInvite error:", error.message);
      return { success: false, message: error.message || "Something went wrong." };
    }
  },
};

export default inviteModel;
