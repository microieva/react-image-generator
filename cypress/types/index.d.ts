declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to generate images
     */
    generateImage(prompt: string, style?: string, size?: number): Chainable<Element>;
    
    /**
     * Custom command to wait for image generation
     */
    waitForImageGeneration(): Chainable<Element>;
  }
}