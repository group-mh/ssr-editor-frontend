/// <reference types="cypress" />

import { within } from "@testing-library/react";

describe("Update Document", () => {
    beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      return false;
    });
  });

    it("user can edit document title and content", () => {
         // login
        cy.visit("/ssr-editor-frontend/login");
        cy.get('input[type="email"]').type("test@email.com", { delay: 50 });
        cy.get('input[type="password"]').type("test", { delay: 50 });
        cy.get('button[type="submit"]').click();

        cy.url().should("include", "/my-docs", { timeout: 10000 });
        cy.wait(1000);

        const docTitle = `Test Doc ${Date.now()}`;

        //create a new document
        cy.contains('button.doc-menu-btn', 'New').click();
        cy.url().should("include", "/create");


    cy.get('input#doc-title', { timeout: 10000 })
      .should('be.visible')
      .type(docTitle);

    cy.get('.ql-editor')
      .should('be.visible')
      .type(docTitle);

    cy.get('button.save-button').click();
    cy.url().should("include", "/my-docs", { timeout: 10000 });

    cy.contains('.my-doc-row', docTitle, { timeout: 10000 })
      .should('be.visible')
      .click();

    cy.url().should("include", "/edit", { timeout: 10000 });

    const updatedDocTitle = `Test Doc ${Date.now()}`;
    const updatedDocContent = `Test Doc ${Date.now()}`;

    // Edit title
    cy.get('input#doc-title')
        .should('be.visible')
        .clear()
        .type(updatedDocTitle);

        // Edit the content
        cy.get('.ql-editor')
            .should('be.visible')
            .clear()
            .type(updatedDocContent);

        cy.wait(1000);

        cy.get('button.back-button').click();

        cy.url().should("include", "/my-docs", { timeout: 10000 });

        // verify the updated title is shown in my-docs
        cy.contains('.my-doc-row', updatedDocTitle, { timeout: 10000 })
            .should('be.visible');

        // delete the document
        cy.contains('.my-doc-row', updatedDocTitle)
            .within(() => {
                cy.get('button.delete-btn')
                .should('be.visible')
                .click({ force: true })
            });

        cy.wait(2000);

        cy.contains('.my-doc-row', updatedDocTitle).should('not.exist');
    });



    it("user can invite collaborators to a document", () => {
         // login
        cy.visit("/ssr-editor-frontend/login");
        cy.get('input[type="email"]').type("test@email.com", { delay: 50 });
        cy.get('input[type="password"]').type("test", { delay: 50 });
        cy.get('button[type="submit"]').click();

        cy.url().should("include", "/my-docs", { timeout: 10000 });
        cy.wait(1000);

        //create a new document to share with 
        cy.contains('button.doc-menu-btn', 'New').click();
        cy.url().should("include", "/create");

        const sharedDocTitle = `Test Doc ${Date.now()}`;
        const sharedContentTitle = `Test Doc ${Date.now()}`;

        cy.get('input#doc-title', { timeout: 10000 })
        .should('be.visible')
        .type(sharedDocTitle);

        cy.get('.ql-editor')
            .should('be.visible')
            .type(sharedContentTitle);
        
        cy.get('button.save-button').click();
        cy.url().should("include", "/my-docs", { timeout: 10000 });

        // click invite button from my-docs
        cy.contains('.my-doc-row', sharedDocTitle, { timeout: 10000 })
            .should('be.visible')
            .within(() => {
                cy.get('button.invite-btn').click();
            });

        cy.url().should("include", "/invite", { timeout: 10000 });

        // enter email to collaborator
        cy.get('input#email', { timeout: 10000 })
            .should('be.visible')
            .type("mats.jonstromer@gmail.com");

        // click send invite button
        cy.contains('button.invite-btn', 'Send invite').click();

        cy.wait(3000);

        cy.get('.invite-status.success', { timeout: 10000 })
            .should('be.visible');
        
        // Logout test@email.com
        cy.get('button.logout-button').click();

        cy.wait(1000);

        // Login as mats.jonstromer@gmail.com
        cy.visit("/ssr-editor-frontend/login");
        cy.get('input[type="email"]').type("mats.jonstromer@gmail.com", { delay: 50 });
        cy.get('input[type="password"]').type("mats", { delay: 50 });
        cy.get('button[type="submit"]').click();

        cy.url().should("include", "/my-docs", { timeout: 10000 });
        
        // check to see if shared documents is displayed in Mats my-docs
        cy.contains('.my-doc-row', sharedDocTitle, { timeout: 10000 })
            .should('be.visible')
            .within(() => {
                cy.get('button.delete-btn').click();
            });

        // confirm delete
        cy.on('window:confirm', () => true);

        cy.contains('.my-doc-row', sharedDocTitle).should('not.exist');
    });
});