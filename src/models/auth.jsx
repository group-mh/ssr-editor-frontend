const auth = {
  baseUrl: window.location.href.includes("localhost")
    ? "http://localhost:1337"
    : "https://jsramverk-editor-hahi24-byewf7bndbf9ehhf.swedencentral-01.azurewebsites.net",
  token: "",

  login: async function (user) {
    try {
      const mutation = `
        mutation {
          login(email: "${user.usernameOrEmail}", password: "${user.password}")
        }
      `;
      const response = await fetch(`${this.baseUrl}/graphql`, {
        method: "POST",
        body: JSON.stringify({ query: mutation }),
        headers: {
          "content-type": "application/json",
        },
      });

      const result = await response.json();

      if (result.errors) {
        return { error: result.errors[0].message };
      }

      const token = result.data.login;
      if (!token) {
        return { error: "Login failed: no token returned" };
      }

      localStorage.setItem("token", token);

      return { token };

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
      const mutation = `
      mutation {
        register(
          username: "${user.username}",
          email: "${user.email}",
          password: "${user.password}"
        )
      }
    `;
      const response = await fetch(`${this.baseUrl}/graphql`, {
        method: "POST",
        body: JSON.stringify({ query: mutation }),
        headers: {
          "content-type": "application/json",
        },
      });

      const result = await response.json();

      if (result.errors) {
        return { error: result.errors[0].message };
      }

      return { message: result.data.register };
    } catch (err) {
      console.error("register error:", err);
      return { error: err.message };
    }
  },
};

export default auth;
