const auth = {
  baseUrl: window.location.href.includes("localhost")
    ? "http://localhost:1337"
    : "http://localhost:1337",

  token: "",

  login: async function (user) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
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

      return result;
    } catch (err) {
      console.error("login error:", err);
      return { error: err.message };
    }
  },

  register: async function (user) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
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
