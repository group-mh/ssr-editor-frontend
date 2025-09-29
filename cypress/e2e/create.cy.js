/// <reference types="cypress" />

const API = "https://jsramverk-editor-hahi24-byewf7bndbf9ehhf.swedencentral-01.azurewebsites.net";

describe("Create document", () => {
    beforeEach(() => {
        cy.intercept("GET", `${API}/docs`, {
            statusCode: 200,
            body: { data: [] },
        }).as("getDocsInit");

        cy.intercept("POST", `${API}/docs`, {
            statusCode: 201,
            body: { _id: "123", title: "New Doc"},
        }).as("createDoc");

        cy.visit("/create");
        cy.wait("@getDocsInit")
    });

    it("user can create a new document", () => {
         cy.get("input[name=title]").should('be.visible').and('not.be.disabled').type("New Doc");
            cy.get('textarea[name=content]').should('be.visible').and('not.be.disabled').type("Hi!");
            
        cy.intercept("GET", `${API}/docs`, {
            statusCode: 200,
            body: { data: [{ _id: "123", title: "New Doc" }] },
        }).as("getDocsAfterCreate")

        cy.get("button.create-btn").click();

        cy.wait("@createDoc");

        cy.location("pathname").should("eq", "/docs");
        cy.wait("@getDocsAfterCreate");

        cy.contains("New Doc").should("be.visible");
    });
});