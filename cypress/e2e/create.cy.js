/// <reference types="cypress" />

describe("Create Document", () => {
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

        //
        cy.intercept("POST", "**/graphql", (req) => {
            const query = req.body.query || '';

            // Mock myDocuments
            if (query.includes("myDocuments")) {
                req.reply({
                    statusCode: 200,
                    body: { data: { myDocuments: [] } }
                });
            }
            // Mock addDocument
            else if (query.includes("addDocument")) {
                const titleMatch = query.match(/title:\s*"([^"]+)"/);
                const contentMatch = query.match(/content:\s*"([^"]+)"/);
                
                req.reply({
                    statusCode: 200,
                    body: {
                        data: {
                            addDocument: {
                                id: "mock-id-123",
                                title: titleMatch ? titleMatch[1] : "Test Doc",
                                content: contentMatch ? contentMatch[1] : "Test Content",
                                author: ["test"],
                                created_at: Date.now().toString(),
                                comments: []
                            }
                        }
                    }
                });
            }
        });
    });

    it("user can create a new document", () => {
        const docTitle = `Test Doc ${Date.now()}`;

        cy.visit("/ssr-editor-frontend/login");
        cy.get('input[type="email"]').type("test@email.com", { delay: 50 });
        cy.get('input[type="password"]').type("test", { delay: 50 });
        cy.get('button[type="submit"]').click();

        cy.url().should("include", "/my-docs", { timeout: 10000 });

        cy.contains('button', 'New').click();
        cy.url().should("include", "/create");

        cy.get('input#doc-title', { timeout: 10000 })
            .should('be.visible')
            .type(docTitle);

        cy.get('.ql-editor')
            .should('be.visible')
            .type("Test Content");

        cy.get('button.save-button').click();

        cy.url().should("include", "/my-docs", { timeout: 10000 });
    });
});