/// <reference types="cypress" />

describe("Docs page (stubbed)", () => {
    const ORIGINAL = { _id: "1", title: "Doc A", content: "New Document" };
    const UPDATED = { ...ORIGINAL, title: "Doc A (updated)", };

    beforeEach(() => {
        cy.on("uncaught:exception", (err) => {
            if (/reading 'document'/.test(err.message)) return false;
        });       

        cy.intercept(
            { method: "GET", url: "**/docs*"}, 
            { statusCode: 200, body: { data: [ORIGINAL] } }
        ).as("getDocs");
    });

    it("user can update an existing document", () => {
        cy.visit("/");
        cy.wait("@getDocs");

        //cy.location("pathname").should("eq", "/docs");

        cy.contains("Doc A").parents(".card").within(() => {
            cy.contains("Edit").click();
        });

        cy.intercept(
            { method: "PUT", url: "**/docs/1"}, 
            { statusCode: 200, body: { data: UPDATED } }
        ).as("putDoc");

        cy.intercept(
            { method: "GET", url: "**/docs*"}, 
            { statusCode: 200, body: { data: [UPDATED] } }
        ).as("getDocsAfterUpdate");

        cy.get('input[name="title"]').clear().type(UPDATED.title);

        cy.get("button.create-btn").click();

        cy.wait("@putDoc").its("request").then(({ body, method, url }) => {
            expect(method).to.eq("PUT");
            expect(url).to.match(/\/docs\/1$/);
            expect(body).to.have.property("title", UPDATED.title);
            expect(body).to.not.have.property("_id");
            
        });

        cy.wait("@getDocsAfterUpdate");
        cy.contains(UPDATED.title).should("be.visible");
        cy.get(".list .card").should("have.length", 1);
        cy.get(".list .card h2").eq(0).should("have.text", UPDATED.title);


    });
    });