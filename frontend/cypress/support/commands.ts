/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

Cypress.Commands.add("resetDb", () => {
  // send request to reset the database
  cy.request("POST", `${Cypress.env('BACKEND_URL') as string}/test/reset`);
});

Cypress.Commands.add("createUser", (email: string, password: string) => {
  // send create user request
  cy.request("POST", `${Cypress.env('BACKEND_URL') as string}/api/user/`, {
    email,
    password,
  });
});

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session(
    email,
    () => {
      // Intercept API calls related to todos to ensure they complete before proceeding
      cy.intercept('GET', '/api/todo').as('getTodos');

      cy.visit('/login');
      cy.get('input[name=email]').type(email);
      cy.get('input[name=password]').type(`${password}{enter}`, { log: false });

      // Attend le chargement initial des todos
      cy.wait('@getTodos');
      
      cy.url().should('include', '/');
      cy.get('h2').contains('Nouvelle tâche').should('exist');
    },
    {
      validate: () => {
        cy.window().then((win) => {
          expect(win.localStorage.getItem('token')).to.be.a('string');
        });
      },
    }
  )
});

Cypress.Commands.add('todo', (todoText: string) => {
  // Ajoute une nouvelle tâche
  cy.get('[id="date"]').click();
  cy.get('.dp__calendar').find('.dp__cell_inner').contains('25').click();
  cy.get('[id="date"]').invoke('val').should('match', /^\d{2}\/\d{2}\/\d{4}$/);
  cy.get('[id="new-todo-input"] > div').clear();
  cy.get('[id="new-todo-input"] > div').type(todoText);
  cy.get('[data-testid="new-todo-submit-btn"]').click();
  cy.get('[data-testid="todo-list"]').should('contain', todoText);
});


  
// Augment Cypress types to include our custom commands so their string names are accepted.
declare global {
  namespace Cypress {
    interface Chainable {
      resetDb(): Chainable;
      createUser(email: string, password: string): Chainable;
      login(email: string, password: string): Chainable;
      todo(todoText: string): Chainable;
    }
  }
}

export {};

