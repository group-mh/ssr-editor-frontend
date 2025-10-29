/// <reference types="cypress" />

describe("Create Document", () => {

    beforeEach(() => {
        cy.on('uncaught:exception', (err) => {
            if (err.message.includes('Cannont read properties of null')) {
                return false;
            }
            return true;
        });
    });

    it("user can create a new document", () => {
        // login
        cy.visit("/ssr-editor-frontend/login");
        cy.get('input[type="email"]').type("test@email.com", { delay: 50 });
        cy.get('input[type="password"]').type("test", { delay: 50 });
        cy.get('button[type="submit"]').click();

        cy.url().should("include", "/my-docs", { timeout: 10000 });
        cy.wait(1000);

        cy.contains('button', 'New').click();
        
        cy.url().should("include", "/create");

        cy.get('input#doc-title',  { timeout: 10000 })
            .should('be.visible')
            .type("Test Document");

        cy.get('.ql-editor')
            .should('be.visible')
            .type("Test Content");
        
        cy.get('button.save-button').click();

        cy.url().should("include", "/my-docs", { timeout: 10000 });
        cy.contains("Test Document", { timeout: 10000 }).should("be.visible");
    });
});
