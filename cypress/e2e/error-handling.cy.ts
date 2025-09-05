  describe('Error Handing',()=>{  
    context('Generate Page', ()=> {
      let task_id:string | null = null;
      beforeEach(()=>{
        cy.visitGeneratePage();
      })
      afterEach(()=> {
        if (task_id) {
          cy.request({
            method: 'POST',
            url: 'http://127.0.0.1:8000/cancel-generation',
            headers: { 'Content-Type': 'application/json' },
            body: { task_id: task_id },
            failOnStatusCode: false 
          })
        }
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
  
          cy.wait('@notFoundError', {timeout:1000}).then(interception => {
            task_id = interception.response?.body.task_id;
            expect(interception.response?.statusCode).to.equal(404);
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
            expect(interception.response?.statusCode).to.equal(400);
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
        beforeEach(()=> {
           cy.intercept('POST', '**/generate', {
            forceNetworkError: true
          }).as('networkError');
        })
        it('should handle network connection errors', () => {
          cy.typePrompt('Network connection error');
          cy.clickGenerateButton();
  
          cy.wait('@networkError')
          
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
          afterEach(()=> {
          cy.request({
            method: 'POST',
            url: 'http://127.0.0.1:8000/cancel-generation',
            headers: { 'Content-Type': 'application/json' },
            body: { task_id: task_id },
            failOnStatusCode: false 
          })
      })
        it('should handle SSE connection errors', () => {
          cy.intercept('GET', '**/generate-stream/*', {
            delay: 500, 
            forceNetworkError: true
          }).as('sseNetworkError');
  
          cy.typePrompt('Testing SSE network');
          cy.clickGenerateButton();
          cy.wait('@generateRequest').then(interception => {
            task_id = interception.response?.body.task_id;
          });
          cy.wait('@sseNetworkError');
          
          cy.get('[role="alert"]')
            .should('be.visible')
            .and('contain', 'Connection failed');
          cy.assertGenerateCancelButtonVisible(false);
          cy.assertRetryButtonVisible();
        });
  
        it('should handle malformed SSE events', () => {
          cy.intercept('GET', '**/generate-stream/*',{
            delay: 500, 
            fixture:'sse-events.txt'
          }).as('malformedSSE');
  
          cy.typePrompt('Testing malformed SSE event');
          cy.clickGenerateButton();
  
          cy.wait('@generateRequest').then(interception => {
            task_id = interception.response?.body.task_id
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
  })