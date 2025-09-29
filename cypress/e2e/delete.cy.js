/// <reference types="cypress" />

const API =
  "https://jsramverk-editor-hahi24-byewf7bndbf9ehhf.swedencentral-01.azurewebsites.net";

describe("Delete document", () => {
  const DOC = { _id: "1", title: "Doc A", content: "New document" };

  it("user can delete a document", () => {
    
    let deleted = false;

    cy.intercept("GET", `${API}/docs`, {
      statusCode: 200,
      body: { data: deleted ? [] : [DOC] },
    }).as("getDocs");

    cy.intercept("DELETE", `${API}/docs/${DOC._id}`, (req) => {
      req.reply({ statusCode: 200, body: { success: true }, });
      deleted = true;
    }).as("deleteDoc");

    cy.on("window confirm", (text) => {
      expect(text).to.match(/delete the document/i)
      return true;
    });

    cy.visit("/ssr-editor-frontend/docs");
    cy.wait("@getDocs");
    cy.contains("h2", DOC.title).should("be.visible");

    cy.contains("h2", DOC.title)
      .closest(".card")
      .find("button.delete-btn")
      .click();

    cy.wait("@deleteDoc");
    cy.wait("@getDocs");

    cy.contains("h2", DOC.title).should("not.exist");
  });
});
