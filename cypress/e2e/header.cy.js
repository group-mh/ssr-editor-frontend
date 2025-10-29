/// <reference types="cypress" />

describe("Header Navigation", () => {
  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      return false;
    });
  });

  it("displays correct elements when not logged in", () => {

    cy.visit("/ssr-editor-frontend/");

    cy.get('.logo-container')
      .should('be.visible')
      .contains('SSR Editor');

    cy.contains('button.doc-menu-btn', 'All Docs').should('be.visible');
;
    cy.contains('button.doc-menu-btn', 'My Docs').should('not.exist');

    cy.contains('button.doc-menu-btn', 'New').should('be.visible');

    cy.get('button.login-button')
      .should('be.visible')
      .contains('Login');
  });

  it("displays correct elements when logged in", () => {

    cy.visit("/ssr-editor-frontend/login");
    cy.get('input[type="email"]').type("test@email.com", { delay: 50 });
    cy.get('input[type="password"]').type("test", { delay: 50 });
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/my-docs", { timeout: 10000 });

    // check logo is visible
    cy.get('.logo-container')
      .should('be.visible')
      .contains('SSR Editor');

      cy.contains('button.doc-menu-btn', 'All Docs').should('be.visible');

      cy.contains('button.doc-menu-btn', 'My Docs').should('be.visible');

      cy.contains('button.doc-menu-btn', 'New').should('be.visible');

      // check if users info is shown
      cy.get('.user-info')
        .should('be.visible')
        .within(() => {
          cy.get('.username').should('contain', 'test');
          cy.get('.user-email').should('contain', 'test@email.com');
        });

        // check if Logout button is visible
        cy.get('button.logout-button')
          .should('be.visible')
          .contains('Logout');
      });

      it("can navigate between pages using header buttons", () => {
        // login
        cy.visit("/ssr-editor-frontend/login");
        cy.get('input[type="email"]').type("test@email.com", { delay: 50 });
        cy.get('input[type="password"]').type("test", { delay: 50 });
        cy.get('button[type="submit"]').click();

        cy.url().should("include", "/my-docs", { timeout: 10000 });

        // Navigate to All Docs
        cy.contains('button.doc-menu-btn', 'All Docs').click();
        cy.url().should("include", "/docs");

         // Navigate to My Docs
        cy.contains('button.doc-menu-btn', 'My Docs').click();
        cy.url().should("include", "/my-docs");

         // Navigate to Create
        cy.contains('button.doc-menu-btn', 'New').click();
        cy.url().should("include", "/create");

        // Click logo to navigate to homepage
        cy.get('.logo-container').click();
        cy.url().should("include", "/docs");
      });

      it("can logout using header logout button", () => {
        // login
        cy.visit("/ssr-editor-frontend/login");
        cy.get('input[type="email"]').type("test@email.com", { delay: 50 });
        cy.get('input[type="password"]').type("test", { delay: 50 });
        cy.get('button[type="submit"]').click();

        cy.url().should("include", "/my-docs", { timeout: 10000 });

        // check if user is logged in
        cy.get('.user-info').should('be.visible');

        // click logut
        cy.get('button.logout-button').click();

        // check if redirected to login or homepage
        cy.url().should("match", /(login|docs)/);

        // Check if logged out by login button is displayed
        cy.get('button.login-button', { timeout: 5000 })
          .should('be.visible')
          .contains('Login');

          // check if My Docs button is not shown
          cy.contains('button.doc-menu-btn', 'My Docs').should('not.exist');
      });
  });
