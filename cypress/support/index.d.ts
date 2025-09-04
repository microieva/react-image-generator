declare namespace Cypress {
  interface Chainable {
    // // Core commands
    visitWelcomePage(): Chainable<void>;
    visitGeneratePage(): Chainable<void>;
    getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
    
    // // Assertion commands
    assertWelcomePageComplete(): Chainable<void>;
    assertWelcomeContainerVisible(): Chainable<void>;
    assertWelcomeLayoutCorrect(): Chainable<void>;
    assertWelcomeTitleCorrect(expectedText?: string): Chainable<void>;
    assertWelcomeDescriptionCorrect(expectedText?: string): Chainable<void>;
    assertGenerateButtonVisible(expectedText: string, shouldBeDisabled: boolean): Chainable<void>;
    assertGoToButtonVisible(expectedText?: string): Chainable<void>;
    assertGoBackButtonVisible(): Chainable<void>;
    assertNavigationToGenerate(): Chainable<void>;
    assertNavigationBackToWelcome(): Chainable<void>;
    assertRetryButtonVisible(): Chainable<void>;

    assertGeneratePageInitialState(): Chainable<void>;
    assertGenerateContainerVisible(): Chainable<void>;
    assertGenerateLayoutCorrect():Chainable<void>;
    assertGenerateTitleCorrect(expectedText?: string): Chainable<void>;
    assertGenerateDescriptionCorrect(expectedText?: string): Chainable<void>;
    assertGenerateTextareaVisible(shouldBeVisible?: boolean): Chainable<void>;
    assertGenerateCancelButtonVisible(shouldBeVisible?: boolean): Chainable<void>;
    assertGenerateProgressBarVisible(shouldBeVisible?: boolean): Chainable<void>;
    assertGenerateResetButtonVisible(shouldBeVisible?: boolean): Chainable<void>;
    
    // // Action commands
    clickGenerateButton(): Chainable<void>;
    clickGoToButton(): Chainable<void>;
    clickGoBackButton(): Chainable<void>;
    clickResetButton(): Chainable<void>;
    clickCancelButton(): Chainable<void>;
    clickRetryButton(): Chainable<void>;
    
    // // Accessibility commands
    assertWelcomePageAccessible(): Chainable<void>;
    testKeyboardNavigation(options?: {
      testAllKeys?: boolean;
      testFocusOrder?: boolean;
    }): Chainable<void>;
    typePrompt(prompt: string): Chainable<void>;
    clearPrompt(): Chainable<void>;

    assertGeneratePageAccessible(): Chainable<void>;
    testKeyboardNavigationBack(options?: {
      testAllKeys?: boolean;
      testFocusOrder?: boolean;
    }): Chainable<void>;

  }
}