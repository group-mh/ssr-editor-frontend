/// <reference types="cypress" />

describe("Header Navigation", () => {
    beforeEach(() => {
        cy.intercept('**/socket.io/**', { statusCode: 200, body: {} });
        cy.on('uncaught:exception', () => false);

        // Mock login
        cy.intercept("POST", "**/login", {
            statusCode: 200,
            body: { 
                token: "fake-jwt-token",
                user: { username: "test", email: "test@email.com" }
            }
        });

        // Mock GraphQL
        cy.intercept("POST", "**/graphql", (req) => {
            const query = req.body.query || '';

            // Mock documents
            if (query.includes("documents") && !query.includes("myDocuments")) {
                req.reply({
                    statusCode: 200,
                    body: { data: { documents: [] } }
                });
            }
            // Mock myDocuments
            else if (query.includes("myDocuments")) {
                req.reply({
                    statusCode: 200,
                    body: { data: { myDocuments: [] } }
                });
            }
        });
    });

    it("displays correct elements when not logged in", () => {
        cy.visit("/ssr-editor-frontend/");

        cy.get('.logo-container')
            .should('be.visible')
            .contains('SSR Editor');

        cy.contains('button.doc-menu-btn', 'All Docs').should('be.visible');

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

        cy.get('.logo-container')
            .should('be.visible')
            .contains('SSR Editor');

        cy.contains('button.doc-menu-btn', 'All Docs').should('be.visible');

        cy.contains('button.doc-menu-btn', 'My Docs').should('be.visible');

        cy.contains('button.doc-menu-btn', 'New').should('be.visible');

        cy.get('.user-info')
            .should('be.visible')
            .within(() => {
                cy.get('.username').should('contain', 'test');
                cy.get('.user-email').should('contain', 'test@email.com');
            });

        cy.get('button.logout-button')
            .should('be.visible')
            .contains('Logout');
    });

    it("can navigate between pages using header buttons", () => {
        cy.visit("/ssr-editor-frontend/login");
        cy.get('input[type="email"]').type("test@email.com", { delay: 50 });
        cy.get('input[type="password"]').type("test", { delay: 50 });
        cy.get('button[type="submit"]').click();

        cy.url().should("include", "/my-docs", { timeout: 10000 });

        cy.contains('button.doc-menu-btn', 'All Docs').click();
        cy.url().should("include", "/docs");

        cy.contains('button.doc-menu-btn', 'My Docs').click();
        cy.url().should("include", "/my-docs");

        cy.contains('button.doc-menu-btn', 'New').click();
        cy.url().should("include", "/create");

        cy.get('.logo-container').click();
        cy.url().should("include", "/docs");
    });

    it("can logout using header logout button", () => {
        cy.visit("/ssr-editor-frontend/login");
        cy.get('input[type="email"]').type("test@email.com", { delay: 50 });
        cy.get('input[type="password"]').type("test", { delay: 50 });
        cy.get('button[type="submit"]').click();

        cy.url().should("include", "/my-docs", { timeout: 10000 });

        cy.get('.user-info').should('be.visible');

        cy.get('button.logout-button').click();

        cy.url().should("match", /(login|docs)/);

        cy.get('button.login-button', { timeout: 5000 })
            .should('be.visible')
            .contains('Login');

        cy.contains('button.doc-menu-btn', 'My Docs').should('not.exist');
    });
});