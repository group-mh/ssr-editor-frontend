/// <reference types="cypress" />

describe("ssr-editor app", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("displays header", () => {
    cy.get("h1.logo").should("contain.text", "SSR Editor");
  });

  it("navigates to docs and shows all documents", () => {
    
    cy.visit("/docs");

    //cy.contains("Documents").should("be.visible");

    /* cy.get(".doc-list-item").should("exists"); */
  }
)
});
