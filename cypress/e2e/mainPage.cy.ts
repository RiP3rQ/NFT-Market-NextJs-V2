describe("Main Page E2E Test", () => {
  // Go to Main Page before each test
  beforeEach(() => {
    cy.visit("/");
  });
  // Check Header on Main Page
  it("Check Header", () => {
    // Logo Check
    cy.getDataTest("header_title").should("exist").contains("Rynek NFT");
    cy.getDataTest("header_subtitle").should("exist").contains("© RIP3RQ");

    // Right Side Buttons Check
    cy.getDataTest("theme-toggle-button").should("exist");
    cy.getDataTest("currency-add-button").should("not.exist");
    cy.getDataTest("connect-wallet-button").should("exist");
  });

  // Check Routing on Main Page
  it("Check Navbar", () => {
    cy.getDataTest("create-nft-button").should("exist");
    cy.getDataTest("marketplace-button").should("exist");
    cy.getDataTest("collections-button").should("exist");
    cy.getDataTest("inventory-button").should("exist");

    cy.getDataTest("create-nft-button").click();
    cy.url().should("include", "/dodaj");
    cy.wait(500);

    cy.getDataTest("marketplace-button").click();
    cy.url().should("include", "/");
    cy.wait(500);

    cy.getDataTest("collections-button").click();
    cy.url().should("include", "/kolekcje");
    cy.wait(500);

    cy.getDataTest("inventory-button").click();
    cy.url().should("include", "/ekwipunek");
    cy.wait(500);
  });
});
