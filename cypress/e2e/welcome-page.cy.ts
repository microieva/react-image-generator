describe('Welcome Page', () => {
  context('When visiting.. ', () => {
    beforeEach(() => {
      cy.visitWelcomePage();
    });
    context('Navigation functionality', () => {
      it('should navigate to generate page on button click', () => {
        cy.assertWelcomePageComplete()
        cy.clickGoToButton();
        cy.assertNavigationToGenerate();
      });

      it('should have generate image button disabled', () => {
        cy.clickGoToButton();
        cy.assertNavigationToGenerate();
        cy.wait(500); 
        cy.getByTestId('generate-submit-button')
          .should('be.disabled')
          .and('have.attr', 'disabled') 
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

    context('Responsive design', () => {
      const viewports = [
        { width: 320, height: 568, name: 'mobile' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 1280, height: 800, name: 'desktop' },
        { width: 1920, height: 1080, name: 'large' }
      ];

      viewports.forEach((viewport) => {
        it(`should display correctly on ${viewport.name} viewport`, () => {
          cy.viewport(viewport.width, viewport.height);
          cy.visitWelcomePage();
          
          cy.assertWelcomePageComplete();
          cy.getByTestId('welcome-box')
            .should('have.css', 'min-height', `${viewport.height}px`);
        });
      });
    });

    context('Content validation', () => {
      it('should display exact title text', () => {
        cy.assertWelcomeTitleCorrect('Welcome to My App');
      });

      it('should display exact description text', () => {
        cy.assertWelcomeDescriptionCorrect(
          'This is a tiny image generator built with React client and FastAPI server and Stable Diffusion2.1'
        );
      });

      it('should display exact button text', () => {
        cy.assertGoToButtonVisible('Go to Generate');
      });
    });
  });
});