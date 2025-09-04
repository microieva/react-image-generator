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
      cy.testKeyboardNavigationBack({ testAllKeys: true, testFocusOrder: true});
      cy.assertNavigationBackToWelcome();
      });
    });

    context('Accessibility compliance', () => {
      beforeEach(() => {
        cy.visitGeneratePage();
      });

      it('should have proper ARIA attributes and semantic HTML', () => {
        cy.assertGeneratePageAccessible();
      });

      it('should be navigable back to welcome page via keyboard', () => {
        cy.testKeyboardNavigationBack();
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
          cy.visitGeneratePage();  
          cy.assertGeneratePageInitialState();
          cy.getByTestId('generate-container')
            .should('have.css', 'min-height', `${viewport.height}px`);
        });
      });
    });

    context('Content validation', () => {
      beforeEach(() => {
        cy.visitGeneratePage();
      });

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
    
    context('should successfuly launch generation on click', ()=> {
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
    context('should handle SSE stream events correctly', ()=> {
      it('should display UI correctly during successful generation', () => {
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
      // it('should successfuly reset UI when reset is clicked', ()=> { ---- only for prod
      //   cy.getByTestId('generate-reset-button').should('be.visible');
      //   cy.clickResetButton();
      //   cy.get('img[alt="Generated"]').should('not.exist');
      //   //cy.assertGenerationState();
      // })
      it('should successfuly cancel generation when cancel is clicked', ()=> {
        cy.typePrompt('A beautiful landscape');
        cy.clickGenerateButton();
        cy.wait('@generateRequest');
        cy.assertGenerateCancelButtonVisible(true);
        cy.clickCancelButton();
        cy.assertGeneratePageInitialState();
      })
    })
    context('Error Handing',()=>{
      let task_id:string;
      beforeEach(()=> {
        cy.visitGeneratePage();
      })
      afterEach(()=> {
          cy.request({
            method: 'POST',
            url: '**/cancel-generation',
            headers: { 'Content-Type': 'application/json' },
            body: { task_id: task_id },
            failOnStatusCode: false 
          })
      })
      context('Endpoint Error Handling', () => {
        it('should handle status 500', () => {
          cy.intercept('POST', '**/generate', {
            statusCode: 500
          }).as('serverError');

          cy.typePrompt('testing 500');
          cy.clickGenerateButton();

          cy.wait('@serverError').then(interception => {
            task_id = interception.response?.body.task_id;
            expect(interception.response?.statusCode).to.equal(500);
          });
          
          cy.get('[role="alert"]')
            .should('be.visible')
            .and('contain', 'Failed to start generation');
          
          cy.assertGenerateCancelButtonVisible(false);
          cy.assertRetryButtonVisible();
        });

        it('should handle 404', () => {
          cy.intercept('POST', '**/generate', {
            statusCode: 404
          }).as('notFoundError');

          cy.typePrompt('Testing 404');
          cy.clickGenerateButton();

          cy.wait('@notFoundError').then(interception => {
            task_id = interception.response?.body.task_id;
          });
          
          cy.get('[role="alert"]')
            .should('be.visible')
            //.and('contain', 'Endpoint not found');
            .and('contain', 'Failed to start generation');
          cy.assertGenerateCancelButtonVisible(false);
          cy.assertRetryButtonVisible();
        });

        it('should handle 400', () => {
          cy.intercept('POST', '**/generate', {
            statusCode: 400
          }).as('badRequestError');

          cy.typePrompt('Testing 400');
          cy.clickGenerateButton();

          cy.wait('@badRequestError').then(interception => {
            task_id = interception.response?.body.task_id;
          });;
          
          cy.get('[role="alert"]')
            .should('be.visible')
            //.and('contain', 'Invalid prompt format');
            .and('contain', 'Failed to start generation');
          cy.assertGenerateCancelButtonVisible(false);
          cy.assertRetryButtonVisible();
        });
      });
      context('Network Error Handling', () => {
        it('should handle network connection errors', () => {
          cy.intercept('POST', '**/generate', {
            forceNetworkError: true
          }).as('networkError');

          cy.typePrompt('Testing network connection error');
          cy.clickGenerateButton();

          cy.wait('@networkError').then(interception => {
            task_id = interception.response?.body.task_id;
          });
          
          cy.get('[role="alert"]')
            .should('be.visible')
            //.and('contain', 'Network error');
            .and('contain', 'Failed to start generation');
          cy.assertGenerateCancelButtonVisible(false);
          cy.assertRetryButtonVisible();
        });
      });
      context('SSE Error Handling', () => {
        beforeEach(()=>{
          cy.intercept('POST', '**/generate').as('generateRequest');
        })
        it('should handle SSE connection errors', () => {
          cy.intercept('GET', '**/generate-stream/*', {
            delay: 500, 
            forceNetworkError: true
          }).as('sseNetworkError');

          cy.typePrompt('Testing SSE network connection error');
          cy.clickGenerateButton();
          cy.wait('@generateRequest').then(interception => {
            task_id = interception.response?.body.task_id;
          });
          cy.wait('@sseNetworkError');
          
          cy.get('[role="alert"]')
            .should('be.visible')
            .and('contain', 'Connection failed');
        });

        it('should handle malformed SSE events', () => {
          cy.intercept('GET', '**/generate-stream/*',{
            fixture:'sse-events.txt'
          }).as('malformedSSE');

          cy.typePrompt('Testing malformed SSE event');
          cy.clickGenerateButton();

          cy.wait('@generateRequest').then(interception => {
            task_id = interception.request.body.task_id
          });
          cy.wait('@malformedSSE');
          
          cy.get('[role="alert"]')
            .should('be.visible')
            .and('contain', 'Connection failed');
          cy.assertGenerateCancelButtonVisible(false);
          cy.assertRetryButtonVisible();
        });
      });
      context('Error Recovery', () => {
        it('should allow retry after error', () => {
          let callCount = 0;
          
          cy.intercept('POST', '**/generate', (req) => {
            callCount++;  
            if (callCount === 1) {
              req.reply({
                statusCode: 500
              });
            } else {
              req.reply({
                statusCode: 200,
                body: { task_id: 'retry-task-123' }
              });
            }
          }).as('generateRequest');

          cy.typePrompt('Recovery test case 1 - click retry');
          cy.clickGenerateButton();
          cy.wait('@generateRequest').then((interception) => {
            expect(interception.response?.statusCode).to.equal(500);
          });
          
          cy.get('[role="alert"]').should('contain', 'Failed to start generation');
          cy.assertGenerateCancelButtonVisible(false);
          cy.assertRetryButtonVisible();
          cy.clickRetryButton();
          
          cy.wait('@generateRequest').then((interception) => {
            expect(interception.response?.statusCode).to.equal(200);
            expect(interception.response?.body.task_id).to.equal('retry-task-123');
          });
          
          cy.contains('0% complete').should('be.visible');
        });

        it('should reset state with retry and cancel after error', () => {
          cy.intercept('POST', '**/generate', {
            statusCode: 500,
            body: { error: 'Server error' }
          }).as('errorRequest');

          cy.typePrompt('A beautiful landscape');
          cy.clickGenerateButton();

          cy.wait('@errorRequest');
          
          cy.assertGenerateCancelButtonVisible(false);
          cy.assertRetryButtonVisible();
        });
      });
      context('Edge Case Error Handling', () => {
        it('should handle invalid JSON responses', () => {
          cy.intercept('POST', '**/generate', {
            statusCode: 200,
            body: 'invalid json' 
          }).as('invalidJsonResponse');

          cy.typePrompt('Testing invalid json res in POST generate');
          cy.clickGenerateButton();

          cy.wait('@invalidJsonResponse');
          
          cy.get('[role="alert"]')
            .should('be.visible')
            //.and('contain', 'Invalid response');
            .and('contain', 'Failed to start generation');

          cy.assertGenerateCancelButtonVisible(false);
          cy.assertRetryButtonVisible();
        });

        it('should handle CORS errors', () => {
          cy.intercept('POST', '**/generate', {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': 'null' 
            },
            body: { task_id: 'test-task-123' }
          }).as('corsError');

          cy.typePrompt('Test CORS error');
          cy.clickGenerateButton();

          cy.wait('@corsError');
          
          cy.get('[role="alert"]')
            .should('be.visible')
            .and('contain', 'Failed to start generation');
          cy.assertGenerateCancelButtonVisible(false);
          cy.assertRetryButtonVisible();
        });
      });
    })
  });
})
