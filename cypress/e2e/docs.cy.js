/// <reference types="cypress" />

describe("Docs page", () => {
    let allDocs = [];

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

            // Mock documents All Docs
            if (query.includes("documents") && !query.includes("myDocuments")) {
                req.reply({
                    statusCode: 200,
                    body: { data: { documents: allDocs } }
                });
            }
            // Mock myDocuments
            else if (query.includes("myDocuments")) {
                req.reply({
                    statusCode: 200,
                    body: { data: { myDocuments: allDocs } }
                });
            }
            // Mock addDocument
            else if (query.includes("addDocument")) {
                const titleMatch = query.match(/title:\s*"([^"]+)"/);
                const contentMatch = query.match(/content:\s*"([^"]+)"/);
                
                const newDoc = {
                    id: `mock-id-${Date.now()}`,
                    title: titleMatch ? titleMatch[1] : "Test Doc",
                    content: contentMatch ? contentMatch[1] : "Test Content",
                    author: ["test"],
                    created_at: Date.now().toString(),
                    comments: []
                };

                allDocs.push(newDoc);

                req.reply({
                    statusCode: 200,
                    body: { data: { addDocument: newDoc } }
                });
            }
        });
    });

    it("user can view all documents in the database", () => {
        cy.visit("/ssr-editor-frontend/");

        cy.url().should("include", "/");

        cy.contains('.title-column', 'Title').should('be.visible');
        cy.contains('.author-column', 'Author').should('be.visible');
        cy.contains('.created-column', 'Created').should('be.visible');

        cy.get('body').then(($body) => {
            if ($body.find('.docs-empty').length > 0) {
                cy.contains('.docs-empty', 'No documents in the database')
                    .should('be.visible');
            } else {
                cy.get('.doc-row')
                    .should('have.length.at.least', 1)
                    .first()
                    .within(() => {
                        cy.get('.title-column').should('be.visible');
                        cy.get('.author-column').should('be.visible');
                        cy.get('.created-column').should('be.visible');
                    });
            }
        });
    });

    it("created document appears in All Docs list", () => {
        const docTitle = `Test Doc ${Date.now()}`;

        cy.visit("/ssr-editor-frontend/login");
        cy.get('input[type="email"]').type("test@email.com", { delay: 50 });
        cy.get('input[type="password"]').type("test", { delay: 50 });
        cy.get('button[type="submit"]').click();

        cy.url().should("include", "/my-docs", { timeout: 10000 });

        cy.contains('button.doc-menu-btn', 'New').click();
        cy.url().should("include", "/create");

        cy.get('input#doc-title', { timeout: 10000 })
            .should('be.visible')
            .type(docTitle);

        cy.get('.ql-editor')
            .should('be.visible')
            .type("Test Content");

        cy.get('button.save-button').click();
        cy.wait(1000);

        cy.url().should("include", "/my-docs", { timeout: 10000 });

        cy.contains('button.doc-menu-btn', 'All Docs').click();

        cy.url().should("include", "/docs");

        cy.contains('.doc-row', docTitle, { timeout: 10000 })
            .should('be.visible')
            .within(() => {
                cy.get('.title-column').should('contain', docTitle);
                cy.get('.author-column').should('be.visible');
                cy.get('.created-column').should('be.visible');
            });
    });
});