/// <reference types="cypress" />

describe("Docs page (stubbed)", () => {
  const DOCS = [
    { _id: "1", title: "Doc A" },
    { _id: "2", title: "Doc B" },
  ];

  beforeEach(() => {
    cy.on("uncaught:exception", (err) => {
      if (/reading 'document'/.test(err.message)) return false;
    });

    cy.intercept(
      { method: "GET", url: "**/docs*" },
      { statusCode: 200, body: { data: DOCS } }
    ).as("getDocs");
  });

  it("redirects / to /docs and show list", () => {
    cy.visit("/");
    cy.wait("@getDocs");

    cy.location("pathname").should("eq", "/ssr-editor-frontend/docs");

    cy.contains("Doc A").should("be.visible");
    cy.contains("Doc B").should("be.visible");

    cy.get(".list .card").should("have.length", 2);
    cy.get(".list .card h2").eq(0).should("have.text", "Doc A");
    cy.get(".list .card h2").eq(1).should("have.text", "Doc B");
  });
});
