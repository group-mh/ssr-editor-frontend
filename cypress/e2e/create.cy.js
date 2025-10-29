/// <reference types="cypress" />

describe("Create Document", () => {

    beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      return false;
    });
  });

    it("user can create a new document", () => {
        // login
        cy.visit("/ssr-editor-frontend/login");
        cy.get('input[type="email"]').type("test@email.com", { delay: 50 });
        cy.get('input[type="password"]').type("test", { delay: 50 });
        cy.get('button[type="submit"]').click();

        const docTitle = `Test Doc ${Date.now()}`;

        cy.url().should("include", "/my-docs", { timeout: 10000 });
        cy.wait(1000);

        cy.contains('button', 'New').click();
        
        cy.url().should("include", "/create");

        cy.get('input#doc-title',  { timeout: 10000 })
            .should('be.visible')
            .type(docTitle);

        cy.get('.ql-editor')
            .should('be.visible')
            .type(docTitle);
        
        cy.get('button.save-button').click();

        cy.wait(2000);

        cy.url().should("include", "/my-docs", { timeout: 10000 });

        cy.contains('.my-doc-row', docTitle, { timeout: 10000 })
          .should("be.visible")
          .within(() => {
            cy.get('button.delete-btn').click();
          })
    });
});
