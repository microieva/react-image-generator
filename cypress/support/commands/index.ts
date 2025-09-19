import { env } from '../env';

Cypress.Commands.add('visitWelcomePage', () => {
  cy.visit(env.localUrl);
  cy.wait(300);
  cy.getByTestId('welcome-container').should('be.visible');
});

Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

Cypress.Commands.add('assertWelcomeContainerVisible', () => {
  cy.getByTestId('welcome-container').should('be.visible');
});

Cypress.Commands.add('assertGoToButtonVisible', () => {
  cy.getByTestId('go-to-generate-button').should('be.visible');
});

Cypress.Commands.add('assertWelcomeLayoutCorrect', () => {
  cy.getByTestId('welcome-box')
    .should('be.visible')
    .and('have.css', 'text-align', 'start')
    .and('have.css', 'display', 'flex')
    .and('have.css', 'flex-direction', 'row');
});

Cypress.Commands.add('assertGenerateButtonVisible', (expectedText:string, shouldBeDisabled:boolean) => {
  cy.getByTestId('generate-submit-button')
    .should('be.visible')
    .and('contain', expectedText)
    .and('be.disabled');

    cy.getByTestId('generate-submit-button')
      .should('be.visible')
      .and('contain', expectedText);

  if (shouldBeDisabled === false) {
    cy.getByTestId('generate-submit-button')
      .should('be.visible')
      .and('be.enabled');
  } else {
    cy.getByTestId('generate-submit-button')
      .should('be.visible')
      .and('be.disabled');
  }
});

Cypress.Commands.add('clickGenerateButton', () => {
  cy.getByTestId('generate-submit-button').should('be.visible').click();
});
Cypress.Commands.add('clickGoToButton', () => {
  cy.getByTestId('go-to-generate-button').should('be.visible').click();
});
Cypress.Commands.add('clickResetButton', () => {
  cy.getByTestId('generate-reset-button').should('be.visible').click();
});
Cypress.Commands.add('clickRetryButton', () => {
  cy.getByTestId('generate-retry-button').should('be.visible').click();
});
Cypress.Commands.add('clickCancelButton', () => {
  cy.getByTestId('generate-cancel-button').should('be.visible').click();
});
Cypress.Commands.add('assertNavigationToGenerate', () => {
  cy.url().should('include', '/generate');
  cy.go('back');
});

Cypress.Commands.add('assertWelcomePageComplete', () => {
  cy.assertWelcomeContainerVisible();
  cy.assertWelcomeLayoutCorrect();
  cy.assertWelcomeTitleCorrect();
  cy.assertWelcomeDescriptionCorrect();
  cy.assertGoToButtonVisible();
});

Cypress.Commands.add('typePrompt', (prompt: string) => {
  cy.get('[data-testid="generate-prompt-input"]')
    .find('textarea') 
    .first()
    .clear()
    .type(prompt);
});

Cypress.Commands.add('clearPrompt', () => {
  cy.get('[data-testid="generate-prompt-input"]')
    .find('textarea') 
    .first()
    .clear();
});
Cypress.Commands.add('assertWelcomePageAccessible', () => {
  cy.getByTestId('welcome-container')
    .should('have.attr', 'role', 'main')
    .and('have.attr', 'aria-label', 'Welcome section');

  cy.getByTestId('welcome-title')
    .should('have.prop', 'tagName', 'H1')
    .and('have.attr', 'id', 'welcome-title')
    .and('contain', 'Welcome!');

  cy.getByTestId('welcome-description')
    .should('have.attr', 'id', 'welcome-description')
    .and('have.attr', 'aria-live', 'polite')
    .and('contain', 'image generator');

  cy.getByTestId('go-to-generate-button')
    .should('have.attr', 'aria-label', 'Go to image generation page')
    .and('have.attr', 'role', 'button')
    .and('have.attr', 'tabindex', '0')
    .and('have.attr', 'aria-describedby', 'welcome-description')
    .and('contain', 'Go to Generate')
    .and('be.enabled');

  cy.getByTestId('welcome-container')
    .should('have.attr', 'aria-labelledby', 'welcome-title');

  cy.getByTestId('welcome-box')
    .should('have.attr', 'aria-describedby', 'welcome-description');

  cy.getByTestId('go-to-generate-button')
    .focus()
    .should('be.focused')
    .and('have.css', 'outline')
    .and('not.equal', 'none');

  // Test that all interactive elements are focusable
  cy.get('button, [tabindex]').each(($el) => {
    cy.wrap($el).should('be.visible');
  });

  cy.log('Welcome page accessibility tests passed!');
});
Cypress.Commands.add('testKeyboardNavigation', () => {
  cy.getByTestId('go-to-generate-button')
    .focus()
    .should('be.focused')
    .and('be.visible');

  cy.focused().realPress('Enter');
  cy.url().should('include', '/generate');
  cy.go('back');

  cy.getByTestId('go-to-generate-button')
    .focus()
    .realPress('Space');
  cy.url().should('include', '/generate');
});

Cypress.Commands.add('visitGeneratePage', () => {
  cy.visit(`${env.localUrl}/generate`);
  cy.wait(300);
  cy.getByTestId('generate-container').should('be.visible');
});

Cypress.Commands.add('assertGeneratePageInitialState', () => {
  cy.assertGenerateContainerVisible();
  cy.assertGoBackButtonVisible();
  cy.assertGenerateLayoutCorrect();
  cy.assertGenerateTitleCorrect();
  cy.assertGenerateDescriptionCorrect();
  cy.assertGenerateTextareaVisible();
  cy.assertGenerateButtonVisible('Generate Image', true);
});

Cypress.Commands.add('assertGenerateContainerVisible', () => {
  cy.getByTestId('generate-container').should('be.visible');
});

Cypress.Commands.add('assertGenerateLayoutCorrect', () => {
  cy.getByTestId('generate-paper')
    .should('be.visible')
    .and('have.css', 'min-height')
});

Cypress.Commands.add('assertGenerateTitleCorrect', (expectedText = 'Image Generator') => {
  cy.getByTestId('generate-title')
    .should('be.visible')
    .and('contain', expectedText)
    .and('have.prop', 'tagName', 'H1');
});

Cypress.Commands.add('assertWelcomeTitleCorrect', (expectedText = 'Welcome to My App') => {
  cy.getByTestId('welcome-title')
    .should('be.visible')
    .and('contain', expectedText)
    .and('have.prop', 'tagName', 'H1');
});

Cypress.Commands.add('assertGenerateDescriptionCorrect', (expectedText = 'Create a prompt describing your image and expect the unexpected! ') => {
  cy.getByTestId('generate-description')
    .should('be.visible')
    .and('contain', expectedText)
    .and('have.prop', 'tagName', 'P');
});
Cypress.Commands.add('assertWelcomeDescriptionCorrect', (expectedText = 'This is a tiny image generator built with React client and FastAPI server and Stable Diffusion2.1') => {
  cy.getByTestId('welcome-description')
    .should('be.visible')
    .and('contain', expectedText)
    .and('have.prop', 'tagName', 'P');
});
Cypress.Commands.add('assertGoBackButtonVisible', () => {
  cy.getByTestId('generate-go-back-button')
    .should('be.visible')
    .and('contain', 'Back')
    .and('be.enabled');
});
Cypress.Commands.add('assertRetryButtonVisible', () => {
  cy.getByTestId('generate-retry-button')
    .should('be.visible')
    .and('contain', 'Retry')
    .and('be.enabled');
});
Cypress.Commands.add('clickGoBackButton', () => {
  cy.getByTestId('generate-go-back-button').click();
});

Cypress.Commands.add('assertNavigationBackToWelcome', () => {
  cy.url().should('eq', env.localUrl + '/');
});

Cypress.Commands.add('assertGeneratePageAccessible', () => {
  cy.log('Testing generate page accessibility...');

  cy.getByTestId('generate-container')
    .should('have.attr', 'role', 'main')
    .and('have.attr', 'aria-label', 'Generate section');

  cy.getByTestId('generate-title')
    .should('have.prop', 'tagName', 'H1')
    .and('have.attr', 'id', 'generate-title')
    .and('contain', 'Image Generator');

  cy.getByTestId('generate-description')
    .should('have.attr', 'id', 'generate-description')
    .and('have.attr', 'aria-live', 'polite')
    .and('contain', 'dedicated space for content generation');

  cy.getByTestId('generate-go-back-button')
    .should('have.attr', 'aria-label', 'Go back to welcome page')
    .and('have.attr', 'role', 'button')
    .and('have.attr', 'tabindex', '0')
    .and('have.attr', 'aria-describedby', 'generate-description')
    .and('contain', 'Back')
    .and('be.enabled');

  cy.getByTestId('generate-container')
    .should('have.attr', 'aria-labelledby', 'generate-title');

  cy.getByTestId('generate-paper')
    .should('have.attr', 'aria-describedby', 'generate-description');

  cy.getByTestId('generate-submit-button')
    .should('have.attr', 'aria-label', 'Start generation')
    .and('have.attr', 'role', 'button')
    .and('have.attr', 'aria-describedby', 'generate-description')
    .and('contain', 'Generate Image')
    .and('be.disabled');
  
  cy.getByTestId('generate-prompt-input')
    .should('have.attr', 'aria-label', 'Image prompt input, describe your image')
    .and('have.attr', 'role', 'textbox')
    .and('have.attr', 'tabindex', '0')
    .focus()
    .should('be.focused')

   cy.getByTestId('generate-go-back-button')
    .focus()
    .should('be.focused')
    .and('have.css', 'outline')
    .and('not.equal', 'none');

  cy.getByTestId('generate-prompt-input')
    .focus()
    .should('be.focused')
    .and('have.css', 'outline')
    .and('not.equal', 'none');

  cy.log('Generate page accessibility tests passed!');
});

Cypress.Commands.add('testKeyboardNavigationBack', () => {
  cy.log('Testing keyboard navigation...');
  cy.getByTestId('generate-go-back-button')
    .focus()
    .should('be.focused')
    .and('be.visible');

  cy.focused().realPress('Enter');
  cy.url().should('eq', 'http://localhost:3000/');
  cy.go('back');

  cy.getByTestId('generate-go-back-button')
    .focus()
    .realPress('Space');
  cy.url().should('eq', 'http://localhost:3000/');
});

Cypress.Commands.add('assertGenerateTextareaVisible', (shouldBeVisible: boolean = true) => {
  if (shouldBeVisible) {
    cy.getByTestId('generate-prompt-input')
      .should('be.visible')
      .and('have.prop', 'tagName', 'DIV')
      .and('have.attr', 'role', 'textbox')
      .and('have.attr', 'aria-label', 'Image prompt input, describe your image')
      .find('textarea')
      .should('exist')    
  } else {
    cy.getByTestId('generate-prompt-input').should('not.exist');
  }
});

Cypress.Commands.add('assertGenerateCancelButtonVisible', (shouldBeVisible: boolean = true) => {
  if (shouldBeVisible) {
    cy.getByTestId('generate-cancel-button')
      .should('be.visible')
      .and('contain', 'Cancel');
  } else {
    cy.getByTestId('generate-cancel-button').should('not.exist');
  }
});

Cypress.Commands.add('assertGenerateResetButtonVisible', (shouldBeVisible: boolean = true) => {
  if (shouldBeVisible) {
    cy.getByTestId('generate-reset-button')
      .should('be.visible')
      .and('contain', 'New Generation');
  } else {
    cy.getByTestId('generate-reset-button').should('not.exist');
  }
});

Cypress.Commands.add('assertGenerateProgressBarVisible', (shouldBeVisible: boolean = true) => {
  if (shouldBeVisible) {
    cy.get('[role="progress-bar"]').should('be.visible');
  } else {
    cy.get('[role="progress-bar"]').should('not.exist');
  }
});