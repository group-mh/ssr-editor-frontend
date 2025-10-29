/// <reference types="cypress" />

describe("Delete Document", () => {
    it("user can delete a document", () => {
        // login
        cy.visit("/ssr-editor-frontend/login");
        cy.get('input[type="email"]').type("test@email.com");
        cy.get('input[type="password"]').type("test");
        cy.get('button[type="submit"]').click();

        cy.url().should("include", "/my-docs", { timeout: 10000 });
        cy.wait(1000);

        cy.contains('button', 'New').click();
        
        cy.url().should("include", "/create");

        cy.get('input#doc-title',  { timeout: 10000 })
            .should('be.visible')
            .type("Document to Delete");

        cy.get('.ql-editor')
            .should('be.visible')
            .type("Test Content");
        
        cy.get('button.save-button').click();

        cy.url().should("include", "/my-docs", { timeout: 10000 });

         cy.contains('.my-doc-row', 'Document to Delete', { timeout: 10000 })
          .should("be.visible")
          .within(() => {
            cy.get('button.delete-btn')
                .should('be.visible')
                .click();
          });

        cy.on('window:confirm', () => true);

        cy.contains('.my-doc-row', 'Document to Delete').should("not.exist");
    });
});
