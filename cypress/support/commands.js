import 'cypress-localstorage-commands';
import 'cypress-xpath';

Cypress.Commands.add('assertLoadingIsShownAndHidden', () => {
  cy.contains('Loading ...').should('be.visible')
  cy.contains('Loading ...').should('not.exist')
});

Cypress.Commands.add('searchInputXpath', ()=>{
  cy.xpath('//*[@id="root"]/div/div[1]/form/input').click();
});
