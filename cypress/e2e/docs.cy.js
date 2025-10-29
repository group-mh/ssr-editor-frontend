/// <reference types="cypress" />

describe("Docs page (stubbed)", () => {
  it("user can view all documents in the database", () => {
    // Visit All Docs
    cy.visit("/ssr-editor-frontend/");
    
    cy.wait(1000);

    cy.url().should("include", "/");

    cy.contains('.title-column', 'Title').should('be.visible');
    cy.contains('.author-column', 'Author').should('be.visible');
    cy.contains('.created-column', 'Created').should('be.visible');

    cy.get('body').then(($body) => {
      if ($body.find('.docs-empty').length > 0) {
        cy.contains('.docs-empty', 'No documents in the database')
            .should('be.visible');
      } else {
        // should have one document if exist
        cy.get('.doc-row')
          .should('have.length.at.least', 1)
            .first()
            .within(() => {
              // every row should have title, author and created date.
              cy.get('.title-column').should('be.visible');
              cy.get('.author-column').should('be.visible');
              cy.get('.created-column').should('be.visible');
            });
      }
    });
  });

  it("created document appears in All Docs list", () => {
    // login
    cy.visit("/ssr-editor-frontend/login");
    cy.get('input[type="email"]').type("test@email.com");
    cy.get('input[type="password"]').type("test");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/my-docs", { timeout: 10000 });
    cy.wait(1000);

    //create a new document
    cy.contains('button.doc-menu-btn', 'New').click();
    cy.url().should("include", "/create");

    const docTitle = `Test Doc ${Date.now()}`;

    cy.get('input#doc-title', { timeout: 10000 })
      .should('be.visible')
      .type(docTitle);

    cy.get('.ql-editor')
      .should('be.visible')
      .type("Test content for All Docs");

    cy.get('button.save-button').click();

    cy.url().should("include", "/my-docs", { timeout: 10000 });

    // Go back to All Docs
    cy.contains('button.doc-menu-btn', 'All Docs').click();
    //cy.url().should("eq", Cypress.config().baseUrl + "/ssr-editor-frontend/");

    cy.url().should("include", "/docs");

    // Check if the created document is in All Docs
    cy.contains('.doc-row', docTitle, { timeout: 10000 })
      .should('be.visible')
      .within(() => {
        cy.get('.title-column').should('contain', docTitle);
        cy.get('.author-column').should('be.visible');
        cy.get('.created-column').should('be.visible');
      });
  });
});