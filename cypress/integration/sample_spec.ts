/// <reference types="cypress" />

describe('sample test', () => {
  it('プラスボタンがある', () => {
    cy.visit('/');
    cy.contains('plus').should('exist');
  });
});

export {};
