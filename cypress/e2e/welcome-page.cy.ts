describe('Welcome Page', () => {
  beforeEach(() => {
    cy.visitWelcomePage();
  });
  context('When visiting.. ', () => { 
    context('Navigation functionality', () => {
      it('should navigate to generate page on button click', () => {
        cy.clickGoToButton();
        cy.assertNavigationToGenerate();
      });
    });

    context('Accessibility compliance', () => {
      it('should have proper ARIA attributes and semantic HTML', () => {
        cy.assertWelcomePageAccessible();
      });

      it('should be navigable via keyboard', () => {
        cy.testKeyboardNavigation();
      });

      it('should have visible focus indicators', () => {
        cy.getByTestId('go-to-generate-button')
          .focus()
          .should('be.focused')
          .and('have.css', 'outline')
          .and('not.equal', 'none');
      });
    });

    context('Responsive layout', () => {
      const viewports = [
        { width: 320, height: 568, name: 'mobile', expectedFlexDirection: 'column' },
        { width: 768, height: 1024, name: 'tablet', expectedFlexDirection: 'column' },
        { width: 1280, height: 800, name: 'desktop', expectedFlexDirection: 'row' },
        { width: 1920, height: 1080, name: 'large', expectedFlexDirection: 'row' }
      ];

      viewports.forEach((viewport) => {
        it(`should have ${viewport.expectedFlexDirection} flex direction on ${viewport.name}`, () => {
          cy.viewport(viewport.width, viewport.height);
          cy.visitWelcomePage();
          
          cy.getByTestId('welcome-container')
            .should('have.css', 'flex-direction', viewport.expectedFlexDirection);
        });
      });
    });

    context('Content validation', () => {
      it('should display exact title text', () => {
        cy.assertWelcomeTitleCorrect('Welcome!');
      });

      it('should display exact description text', () => {
        cy.assertWelcomeDescriptionCorrect(
          'This is a tiny image generator built with React, FastAPI server and Stable Diffusion2.1'
        );
      });

      it('should display exact button text', () => {
        cy.assertGoToButtonVisible('Go to Generate');
      });
    });
  });
});