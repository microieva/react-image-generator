describe('Generate Page', () => {
  beforeEach(() => {
    cy.visitGeneratePage();
  });
  context('When visiting..', () => {
    context('Initial State', () => {
      it('should load with correct initial state', () => {
        cy.assertGenerateLayoutCorrect(); 
        cy.assertGoBackButtonVisible();      
        cy.assertGenerateTextareaVisible();
        cy.assertGenerateButtonVisible('Generate Image', true);
        cy.assertGenerateCancelButtonVisible(false);
        cy.assertGenerateProgressBarVisible(false);
        cy.assertGenerateResetButtonVisible(false);
      });
      it('should have proper ARIA attributes and semantic HTML', () => {
        cy.assertGeneratePageAccessible();
      });
    });
    context('Form Validation', () => {
      it('should enable submit button when valid prompt is entered', () => {
        cy.typePrompt('A beautiful landscape');
        cy.getByTestId('generate-submit-button').should('be.enabled')
      });

      it('should disable submit button when prompt is empty', () => {
        cy.typePrompt('A beautiful landscape');
        cy.clearPrompt();
        cy.getByTestId('generate-submit-button').should('be.disabled')
      });

      it('should disable submit button when prompt is only whitespace', () => {
        cy.typePrompt('   ');
        cy.getByTestId('generate-submit-button').should('be.disabled')
      });
    });

    context('Navigation', () => {
      it('should navigate back to welcome page on go back button click', () => {
        cy.clickGoBackButton();
        cy.assertNavigationBackToWelcome();
      });

      it('should navigate back using keyboard', () => {
      cy.visitGeneratePage();
      cy.testKeyboardNavigationBack({ testAllKeys: true, testFocusOrder: true});
      cy.assertNavigationBackToWelcome();
      });
    });

    context('Accessibility compliance', () => {
      it('should have proper ARIA attributes and semantic HTML', () => {
        cy.assertGeneratePageAccessible();
      });
    });

    context('Responsive layout', () => {
      const viewports = [
        { width: 320, height: 568, name: 'mobile', expectedFlexDirection: 'column-reverse' },
        { width: 768, height: 1024, name: 'tablet', expectedFlexDirection: 'column-reverse' },
        { width: 1280, height: 800, name: 'desktop', expectedFlexDirection: 'row' },
        { width: 1920, height: 1080, name: 'large', expectedFlexDirection: 'row' }
      ];

      viewports.forEach((viewport) => {
        it(`should have ${viewport.expectedFlexDirection} flex direction on ${viewport.name}`, () => {
          cy.viewport(viewport.width, viewport.height);
          cy.visitGeneratePage();
          
          cy.getByTestId('generate-container')
            .should('have.css', 'flex-direction', viewport.expectedFlexDirection);
        });
      });
    });

    context('Content validation', () => {
      it('should display exact title text', () => {
        cy.assertGenerateTitleCorrect('Image Generator');
      });

      it('should display exact description text', () => {
        cy.assertGenerateDescriptionCorrect(
          'Welcome! This is your dedicated space for content generation.'
        );
      });

      it('should display exact button text', () => {
        cy.assertGoBackButtonVisible();
        cy.assertGenerateButtonVisible('Generate Image', true);
        cy.assertGenerateTextareaVisible();
      });
    });
  })
  context('Generation Flow', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/generate').as('generateRequest');
    });
    
    context('Generation start', ()=> {
      afterEach(() => {
        cy.wait(500);
        cy.clickCancelButton();
      })
      it('should make POST request to generate endpoint when button is clicked - and receive expected response', () => { 
        cy.typePrompt('A beautiful landscape');
        cy.clickGenerateButton();
        cy.wait('@generateRequest').then((interception) => {
          expect(interception.request.method).to.equal('POST');
          expect(interception.request.body).to.deep.equal({
            prompt: 'A beautiful landscape'
          });  
          expect(interception.response?.statusCode).to.equal(200);
          expect(interception.response?.body).to.have.property('task_id');
          expect(interception.response?.body.task_id).to.be.a('string');
        });
      })
    })
    context('Generation progress', ()=> {
      it('should display generation progress UI correctly during successful generation', () => {
        cy.typePrompt('A beautiful landscape');
        cy.clickGenerateButton();
        cy.wait(500)
        cy.assertGenerateProgressBarVisible(true);
        cy.contains('0% complete').should('be.visible');
        cy.get('[role="progress-bar"]').should('have.attr', 'aria-valuenow', '0');
        // -----wait & cancel only for dev
        cy.wait(1000)
        cy.clickCancelButton();
        //cy.verifyProgressBarUpdates([5,50,100], {timeout:500000}); -- only for prod
    
        // // Verify completion -- only for prod
        // cy.get('img[alt="Generated"]').should('be.visible');
        // cy.getByTestId('generate-reset-button').should('be.visible');
      });
    })
    context('Generation cancel', ()=> {
      it('should successfuly cancel generation when cancel button is clicked', ()=> {
        cy.typePrompt('A beautiful landscape');
        cy.clickGenerateButton();
        cy.wait('@generateRequest');
        cy.assertGenerateCancelButtonVisible(true);
        cy.clickCancelButton();
        cy.assertGeneratePageInitialState();
      })
      // it('should successfuly reset UI when reset is clicked', ()=> { ---- only for prod
      //   cy.getByTestId('generate-reset-button').should('be.visible');
      //   cy.clickResetButton();
      //   cy.get('img[alt="Generated"]').should('not.exist');
      //   //cy.assertGenerationState();
      // })
    })
  });
})
