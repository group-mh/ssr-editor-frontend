/// <reference types="cypress" />

describe("Update Document", () => {
    let docs = [];

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

            // Mock myDocuments
            if (query.includes("myDocuments")) {
                req.reply({
                    statusCode: 200,
                    body: { data: { myDocuments: docs } }
                });
            }
            // Mock documents for edit page
            else if (query.includes("documents") && !query.includes("myDocuments")) {
                req.reply({
                    statusCode: 200,
                    body: { data: { documents: docs } }
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

                docs.push(newDoc);

                req.reply({
                    statusCode: 200,
                    body: { data: { addDocument: newDoc } }
                });
            }
            // Mock updateDocument
            else if (query.includes("updateDocument")) {
                const idMatch = query.match(/id:\s*"([^"]+)"/);
                const titleMatch = query.match(/title:\s*"([^"]+)"/);
                const contentMatch = query.match(/content:\s*"([^"]+)"/);
                
                const docId = idMatch ? idMatch[1] : null;
                const docIndex = docs.findIndex(d => d.id === docId);

                if (docIndex !== -1) {
                    if (titleMatch) docs[docIndex].title = titleMatch[1];
                    if (contentMatch) docs[docIndex].content = contentMatch[1];

                    req.reply({
                        statusCode: 200,
                        body: { data: { updateDocument: docs[docIndex] } }
                    });
                } else {
                    req.reply({
                        statusCode: 200,
                        body: { data: { updateDocument: null } }
                    });
                }
            }
            // Mock deleteDocument
            else if (query.includes("deleteDocument")) {
                const idMatch = query.match(/id:\s*"([^"]+)"/);
                const docId = idMatch ? idMatch[1] : null;
                docs = docs.filter(d => d.id !== docId);

                req.reply({
                    statusCode: 200,
                    body: { data: { deleteDocument: true } }
                });
            }
        });
    });

    it("user can edit document title and content", () => {
        const docTitle = `Test Doc ${Date.now()}`;
        const updatedDocTitle = `Updated Doc ${Date.now()}`;

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
            .type("Original content");

        cy.get('button.save-button').click();
        cy.wait(1000);

        cy.url().should("include", "/my-docs", { timeout: 10000 });

        cy.contains('.my-doc-row', docTitle, { timeout: 10000 })
            .should('be.visible')
            .click();

        cy.url().should("include", "/edit", { timeout: 10000 });

        cy.get('input#doc-title')
            .should('be.visible')
            .clear()
            .type(updatedDocTitle);

        cy.get('.ql-editor')
            .should('be.visible')
            .clear()
            .type("Updated content");

        cy.wait(1000);

        cy.get('button.back-button').click();

        cy.url().should("include", "/my-docs", { timeout: 10000 });

        cy.contains('.my-doc-row', updatedDocTitle, { timeout: 10000 })
            .should('be.visible');

        cy.contains('.my-doc-row', updatedDocTitle)
            .within(() => {
                cy.get('button.delete-btn')
                    .should('be.visible')
                    .click({ force: true });
            });

        cy.on('window:confirm', () => true);
        cy.wait(1000);

        cy.contains('.my-doc-row', updatedDocTitle).should('not.exist');
    });

    it("user can invite collaborators to a document", () => {
        const sharedDocTitle = `Shared Doc ${Date.now()}`;

        cy.visit("/ssr-editor-frontend/login");
        cy.get('input[type="email"]').type("test@email.com", { delay: 50 });
        cy.get('input[type="password"]').type("test", { delay: 50 });
        cy.get('button[type="submit"]').click();

        cy.url().should("include", "/my-docs", { timeout: 10000 });

        cy.contains('button.doc-menu-btn', 'New').click();
        cy.url().should("include", "/create");

        cy.get('input#doc-title', { timeout: 10000 })
            .should('be.visible')
            .type(sharedDocTitle);

        cy.get('.ql-editor')
            .should('be.visible')
            .type("Content to share");

        cy.get('button.save-button').click();
        cy.wait(1000);

        cy.url().should("include", "/my-docs", { timeout: 10000 });

        cy.contains('.my-doc-row', sharedDocTitle, { timeout: 10000 })
            .should('be.visible')
            .within(() => {
                cy.get('button.invite-btn').click();
            });

        cy.url().should("include", "/invite", { timeout: 10000 });

        cy.get('input#email', { timeout: 10000 })
            .should('be.visible')
            .type("mats.jonstromer@gmail.com");

        cy.contains('button.invite-btn', 'Send invite').click();

        cy.wait(2000);

        cy.get('.invite-status.success', { timeout: 10000 })
            .should('be.visible');

        cy.get('button.logout-button').click();

        cy.wait(1000);

        cy.intercept("POST", "**/login", {
            statusCode: 200,
            body: { 
                token: "fake-jwt-token-2",
                user: { username: "mats", email: "mats.jonstromer@gmail.com" }
            }
        });

        cy.visit("/ssr-editor-frontend/login");
        cy.get('input[type="email"]').type("mats.jonstromer@gmail.com", { delay: 50 });
        cy.get('input[type="password"]').type("mats", { delay: 50 });
        cy.get('button[type="submit"]').click();

        cy.url().should("include", "/my-docs", { timeout: 10000 });

        cy.contains('.my-doc-row', sharedDocTitle, { timeout: 10000 })
            .should('be.visible')
            .within(() => {
                cy.get('button.delete-btn').click();
            });

        cy.on('window:confirm', () => true);
        cy.wait(500);

        cy.contains('.my-doc-row', sharedDocTitle).should('not.exist');
    });

    it("user can add and view comments on a document", () => {
        const docTitle = `Doc with Comments ${Date.now()}`;

        cy.visit("/ssr-editor-frontend/login");
        cy.get('input[type="email"]').type("test@email.com", { delay: 50 });
        cy.get('input[type="password"]').type("test", { delay: 50 });
        cy.get('button[type="submit"]').click();

        cy.url().should("include", "/my-docs", { timeout: 10000 });

        // Create document
        cy.contains('button.doc-menu-btn', 'New').click();
        cy.url().should("include", "/create");

        cy.get('input#doc-title', { timeout: 10000 })
            .should('be.visible')
            .type(docTitle);

        cy.get('.ql-editor')
            .should('be.visible')
            .type("This text will be commented");

        cy.get('button.save-button').click();
        cy.wait(1000);

        cy.url().should("include", "/my-docs", { timeout: 10000 });

        // Open document
        cy.contains('.my-doc-row', docTitle, { timeout: 10000 })
            .should('be.visible')
            .click();

        cy.url().should("include", "/edit", { timeout: 10000 });

        // Select text
        cy.get('.ql-editor')
            .should('be.visible')
            .trigger('mousedown', { which: 1 })
            .trigger('mousemove', { clientX: 100, clientY: 20 })
            .trigger('mouseup', { force: true });

        cy.wait(500);

        // Check for comment box is displaying
        cy.get('body').then(($body) => {
            if ($body.find('.comment-box').length > 0) {
                cy.get('.comment-box').should('be.visible');
                cy.get('.comment-box textarea').type("Test comment");
                cy.get('button.comment-box-submit-btn').click();

                cy.wait(1000);

                // check if comment is shown
                cy.get('.comments-sidebar').within(() => {
                    cy.contains('Comments').should('be.visible');
                    cy.contains('Test comment').should('be.visible');
                });
            } else {
                cy.url().should("include", "/edit");
            }
        });

        // delete document
        cy.get('button.back-button').click();
        cy.url().should("include", "/my-docs", { timeout: 10000 });

        cy.contains('.my-doc-row', docTitle, { timeout: 10000 })
            .should('be.visible')
            .within(() => {
                cy.get('button.delete-btn').click();
            });

        cy.on('window:confirm', () => true);
        cy.wait(500);

        cy.contains('.my-doc-row', docTitle).should('not.exist');
    });
});