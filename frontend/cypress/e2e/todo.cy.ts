
describe('Page Todo', () => {
  beforeEach(() => {
    cy.resetDb();
    cy.createUser(Cypress.env('USER_EMAIL'),Cypress.env('USER_PASSWORD'));
    cy.login(Cypress.env('USER_EMAIL'),Cypress.env('USER_PASSWORD'));
    cy.visit('/');
  });

  it("S’assurer que l'on se trouve sur la page Todo", () => {
    cy.contains('h2', 'Nouvelle tâche');
  });

  it('Ajouter une nouvelle tâche', () => {
    // Ajoute une nouvelle tâche d'abord
    cy.todo('Learn Cypress');

    cy.get('[data-testid="todo-item"]').first().as('todo');

    // Vérifie que la première tâche a la classe "border-green-500" (non complétée)
    cy.get('@todo').first().should('have.class', 'border-green-500');
    cy.get('@todo').first().find('#toggle').invoke('val').should('equal', 'true');
  });


  // it('Marquer une tâche comme terminée', () => {
  //   // Ajoute une nouvelle tâche d'abord
  //   cy.todo('Learn Cypress');

  //   cy.get('[data-testid="todo-item"]').first().as('todo');

  //   // Coche la tâche
  //   cy.get('@todo').find('#toggle').check();

  //   // Vérifie que la tâche a la classe "border-gray-500" (complétée)
  //   cy.get('@todo').should('have.class', 'border-gray-500');
  //   cy.get('@todo').find('#toggle').invoke('val').should('equal', 'false');
  // });

  // Issue with SQLite and LIKE operator, test disabled for now
  // it('Search une tâche', () => {
  //   // Ajoute une nouvelle tâche d'abord
  //   cy.todo('Learn Cypress');
  //   cy.todo('Write Tests');
  //   cy.todo('Deploy Application');

  //   // Recherche une tâche
  //   cy.get('[data-testid="search-input"]').type('Write');

  //   // Vérifie que seule la tâche recherchée est affichée
  //   cy.get('[data-testid="todo-item"]').should('have.length', 1);
  //   cy.get('[data-testid="todo-item"]').first().should('contain.text', 'Write Tests');
  // });

  it('Supprimer une tâche', () => {
    // Ajoute une nouvelle tâche d'abord
    cy.todo('Learn Cypress');

    cy.get('[data-testid="todo-item"]').first().as('todo');

    cy.get('@todo').find('[data-testid="delete-todo"]').click();
    cy.get('[data-testid="todo-list"]').first().should('not.contain', 'Learn Cypress');
  });
});
