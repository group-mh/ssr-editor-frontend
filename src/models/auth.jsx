const auth = {
  baseUrl: "http://localhost:1337",
  token: "",
  //  logic function
  login: async function (user) {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "content-type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      localStorage.setItem("token", result.token);

      return result;
    } catch (err) {
      console.error("login error:", err);
      return { error: err.message };
    }
  },

  logout: function () {
    localStorage.removeItem("token");
  },

  getToken: function () {
    return localStorage.getItem("token");
  },

  register: async function (user) {
    console.log("Register data:", user);
    try {
      const response = await fetch(`${this.baseUrl}/register`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "content-type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Register failed");
      }

      return result;
    } catch (err) {
      console.error("register error:", err);
      return { error: err.message };
    }
  },
};

export default auth;
