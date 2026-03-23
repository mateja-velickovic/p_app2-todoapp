describe('Page Profile', () => {
  beforeEach(() => {
    cy.resetDb();
    cy.createUser(Cypress.env('USER_EMAIL'),Cypress.env('USER_PASSWORD'));
    cy.login(Cypress.env('USER_EMAIL'),Cypress.env('USER_PASSWORD'));
    cy.visit('/');
  });

  it('Visiter la page profile', () => {
    cy.get('[data-testid="menu-button"]').click();     // open the menu
    cy.get('[data-testid="menu-profile"]').click();
    cy.contains('h1', 'Mon Profile');
    cy.get('[data-testid="profile-email"]').should('have.text', Cypress.env('USER_EMAIL'));
  });

  it('Met à jour le profil', () => {
    // Assure l’état connecté réutilisable
    //cy.login(Cypress.env('USER_EMAIL'), Cypress.env('USER_PASSWORD'));

    // On surveille les appels réseau
    cy.intercept('PATCH', '/api/user').as('updateProfile');

    // Ouvre le profil
    cy.visit('/');
    cy.get('h2').contains('Nouvelle tâche').should('exist');
    cy.get('[data-testid="menu-button"]').should('be.visible').click();
    cy.get('[data-testid="menu-profile"]').should('be.visible').click();


    // Renseigne les champs
    cy.get('input[name="name"]').clear();
    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="address"]').clear();
    cy.get('input[name="address"]').type('123 Main St');
    cy.get('input[name="zip"]').clear();
    cy.get('input[name="zip"]').type('12345');
    cy.get('input[name="location"]').clear();
    cy.get('input[name="location"]').type('Springfield');

    // Soumet et attend la réponse serveur
    cy.contains('button', 'Modifier').should('not.be.disabled').click();
    cy.wait('@updateProfile').its('response.statusCode').should('be.oneOf', [200, 204]);

    // Re-ouvre le profil pour vérifier (nouveau GET)
    cy.intercept('GET', '/profile').as('getProfileAfter');

  
    cy.get('[data-testid="menu-button"]').click();
    cy.get('[data-testid="menu-profile"]').click();

    // Attend la réponse du profil
    cy.wait('@getProfileAfter');

    // Vérifie les valeurs affichées
    cy.get('input[name="name"]').should('have.value', 'John Doe');
    cy.get('input[name="address"]').should('have.value', '123 Main St');
    cy.get('input[name="zip"]').should('have.value', '12345');
    cy.get('input[name="location"]').should('have.value', 'Springfield');
  });


  it("Supprimer le compte de l'utilisateur", () => {
    cy.get('[data-testid="menu-button"]').click();     // open the menu
    cy.get('[data-testid="menu-profile"]').click();
    cy.get('a').contains('Supprimer votre compte').click();
    cy.get('button').contains('Confirmer').click();
    cy.url().should('include', '/login');
  });
});
