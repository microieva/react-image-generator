// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to generate an image with specific parameters
       * @example cy.generateImage('a cat', 'realistic', 512)
       */
      generateImage(
        prompt: string, 
        style?: string, 
        size?: number
      ): Chainable<Element>;
      
      /**
       * Custom command to wait for image generation to complete
       */
      waitForImageGeneration(): Chainable<Element>;
    }
  }
}

// Custom command for image generation
Cypress.Commands.add('generateImage', (prompt: string, style = 'realistic', size = 512) => {
  cy.get('[data-testid="prompt-input"]').type(prompt);
  cy.get('[data-testid="style-select"]').select(style);
  cy.get('[data-testid="size-input"]').clear().type(size.toString());
  cy.get('[data-testid="generate-button"]').click();
});

// Custom command to wait for image generation
Cypress.Commands.add('waitForImageGeneration', () => {
  cy.get('[data-testid="loading-spinner"]', { timeout: 30000 }).should('not.exist');
  cy.get('[data-testid="generated-image"]', { timeout: 30000 }).should('be.visible');
});

export {};