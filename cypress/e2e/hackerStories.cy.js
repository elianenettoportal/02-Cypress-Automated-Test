import { faker } from '@faker-js/faker'

describe('Hacker Stories', () => {
  const initialTerm = 'React';
  const newTerm = 'Cypress';
  const searchInitialTerm = {
    method: 'GET',
    pathname: '**/search',
    query: {
      query: initialTerm,
      page: '0'
    }
  }

  context.skip('Hitting the real API VERSION 2*********', () => {
    const newSearch = 'Cypress';
    let searchInitialTerm2 = {
      method: 'GET',
      pathname: '**/search',
      query: {
        query: 'redux',
        page: '0'
      }
    }

    beforeEach(() => {
      searchInitialTerm2.query.page = '0';
      cy.intercept(searchInitialTerm2).as('getStories');
      cy.visit('/');
      cy.wait('@getStories');
      window.localStorage.setItem('searchQuery', searchInitialTerm2.query.query);
    })

    it('shows 100 stories, then the next 100 after clicking "More"', () => {
      searchInitialTerm2.query.page = '1';
      cy.intercept(searchInitialTerm2).as('getNextStories');
      cy.get('.table-row').should('have.length', 100);
      cy.contains('More').should('be.visible').click();
      cy.wait('@getNextStories');

      // Assertion
      cy.get('.table-row').should('have.length', 200)
    })

    it('searches via the last searched term', () => {
      searchInitialTerm2.query.query = newSearch;
      searchInitialTerm2.query.page = '0';
      window.localStorage.setItem('searchQuery', searchInitialTerm2.query.query);
      cy.intercept(searchInitialTerm2).as('getNewTermStories');
      cy.searchInputXpath().clear().should('be.visible').type(`${newSearch}{enter}`);
      cy.wait('@getNewTermStories');

       // Assertion
      expect(window.localStorage.getItem('searchQuery')).to.eq(newSearch);
      cy.get('.table-row').should('have.length', 100);
      cy.get('.table-row').first().should('be.visible').and('contain', newSearch);
      cy.get('.table-row').last().should('be.visible').and('contain', newSearch);
    });
  });

  context('Hitting the real API', () => {
    beforeEach(() => {
      searchInitialTerm.query.page = '0'
      cy.intercept(searchInitialTerm).as('getStories');
      cy.visit('/');
      cy.wait('@getStories');
    })

    it('shows 20 stories, then the next 20 after clicking "More"', () => {
      searchInitialTerm.query.page = '1';
      cy.intercept(searchInitialTerm).as('getNextStories');
      cy.get('.item').should('have.length', 20);
      cy.contains('More').should('be.visible').click();
      cy.wait('@getNextStories');

      // Assertion
      cy.get('.item').should('have.length', 40)
    })

    it('searches via the last searched term', () => {
      cy.intercept('GET', `**/search?query=${newTerm}&page=0`).as('getNewTermStories');
      cy.get('#search').clear().should('be.visible').type(`${newTerm}{enter}`);
      cy.wait('@getNewTermStories');

      //load from localstorage
      cy.getLocalStorage('search').should('be.equal', newTerm);

      cy.get(`button:contains(${initialTerm})`).should('be.visible').click();
      cy.wait('@getStories');

      //load from localstorage
      cy.getLocalStorage('search').should('be.equal', initialTerm);

      // Assertion
      cy.get('.item').should('have.length', 20);
      cy.get('.item').first().should('be.visible').and('contain', initialTerm);
      cy.get(`button:contains(${newTerm})`).should('be.visible');
    });
  });

  context('Mocking the API', () => {
    context('Footer and List of stories', () => {
      beforeEach(() => {
        cy.intercept('GET', `**/search?query=${initialTerm}&page=0`, { fixture: 'stories' }).as('getStories');
        cy.visit('/');
        cy.wait('@getStories');
      })

      it('shows the footer', () => {
        cy.get('footer').should('be.visible').and('contain', 'Icons made by Freepik from www.flaticon.com');
      });

      context('List of stories', () => {
        const storiesMocked= require('../fixtures/stories.json');

        it('shows the right data for all rendered stories', () => {
          // Assertion
          cy.get('.item').first().should('be.visible')
              .and('contain', storiesMocked.hits[0].title)
              .and('contain', storiesMocked.hits[0].title)
              .and('contain', storiesMocked.hits[0].points)
              .and('contain', storiesMocked.hits[0].author)
              .and('contain', storiesMocked.hits[0].num_comments);
          cy.get(`.item a:contains(${storiesMocked.hits[0].title})`)
              .should('have.attr', 'href', storiesMocked.hits[0].url);

          cy.get('.item').last().should('be.visible')
              .and('contain', storiesMocked.hits[1].title)
              .and('contain', storiesMocked.hits[1].title)
              .and('contain', storiesMocked.hits[1].points)
              .and('contain', storiesMocked.hits[1].author)
              .and('contain', storiesMocked.hits[1].num_comments);
          cy.get(`.item a:contains(${storiesMocked.hits[1].title})`)
              .should('have.attr', 'href', storiesMocked.hits[1].url);
        });

        it('shows less one story after dimissing the first story', () => {
          cy.get('.button-small').first().should('be.visible').click();
          cy.get('.item').should('have.length', 1);
        });

        context('Order by', () => {
          it('orders by title', () => {
            //click to order by asc
            cy.get('.list-header-button:contains(Title)').should('be.visible').click();

            // Assertion
            cy.get('.item').first().should('be.visible').and('contain', storiesMocked.hits[0].title);
            cy.get(`.item a:contains(${storiesMocked.hits[0].title})`)
              .should('have.attr', 'href', storiesMocked.hits[0].url);

            //click to order by desc
            cy.get('.list-header-button:contains(Title)').click();

            // Assertion
            cy.get('.item').first().should('be.visible').and('contain', storiesMocked.hits[1].title);
            cy.get(`.item a:contains(${storiesMocked.hits[1].title})`)
              .should('have.attr', 'href', storiesMocked.hits[1].url);
          });

          it('orders by author', () => {
            //click to order by author asc
            cy.get('.list-header-button:contains(Author)').should('be.visible').click();
            // Assertion
            cy.get('.item').first().should('be.visible').and('contain', storiesMocked.hits[0].author);

            //click to order by desc
            cy.get('.list-header-button:contains(Author)').click();
            // Assertion
            cy.get('.item').first().should('be.visible').and('contain', storiesMocked.hits[1].author);
          });

          it('orders by comments', () => {
            //click to order by comments asc
            cy.get('.list-header-button:contains(Comments)').should('be.visible').click();
            // Assertion
            cy.get('.item').first().should('be.visible').and('contain', storiesMocked.hits[1].num_comments);

            //click to order by desc
            cy.get('.list-header-button:contains(Comments)').click();
            // Assertion
            cy.get('.item').first().should('be.visible').and('contain', storiesMocked.hits[0].num_comments);
          });

          it('orders by points', () => {
            //click to order by points asc
            cy.get('.list-header-button:contains(Points)').should('be.visible').click();
            // Assertion
            cy.get('.item').first().should('be.visible').and('contain', storiesMocked.hits[0].points);

            //click to order by desc
            cy.get('.list-header-button:contains(Points)').click();
            // Assertion
            cy.get('.item').first().should('be.visible').and('contain', storiesMocked.hits[1].points);
          });
        })
      })
    })

    context('Search', () => {
      beforeEach(() => {
        cy.intercept('GET', `**/search?query=${initialTerm}&page=0`, { fixture: 'empty' }).as('getEmptyStories');
        cy.intercept('GET', `**/search?query=${newTerm}&page=0`, { fixture: 'stories' }).as('getStories');
        cy.visit('/');
        cy.wait('@getEmptyStories');
        cy.get('#search').clear(); 
      });

      it('shows no story when none is returned',()=>{
        // Assertion
        cy.get('.item').should('not.exist');
      });

      it('types and hits ENTER', () => {
        cy.get('#search').should('be.visible').type(`${newTerm}{enter}`);
        cy.wait('@getStories');

         //load from localstorage
        cy.getLocalStorage('search').should('be.equal', newTerm);

        // Assertion
        cy.get('.item').should('have.length', 2);
        cy.get(`button:contains(${initialTerm})`).should('be.visible');
      });

      it('types and clicks the submit button', () => {
        cy.get('#search').should('be.visible').type(newTerm);
        cy.contains('Submit').should('be.visible').click();
        cy.wait('@getStories');

        //load from localstorage
        cy.getLocalStorage('search').should('be.equal', newTerm);

        // Assertion
        cy.get('.item').should('have.length', 2);
        cy.get(`button:contains(${initialTerm})`).should('be.visible');
      });

      context('Last searches', () => {
        it('shows a max of 5 buttons for the last searched terms', () => {
          cy.intercept('GET', '**/search**',{ fixture: 'empty' }).as('getRandomStories')

          // use lodash to run 6 times
          Cypress._.times(6, () => {
            const fakerWord = faker.lorem.word();
            cy.get('#search').clear().type(`${fakerWord}{enter}`);
            cy.wait('@getRandomStories');

            //load from localstorage
            cy.getLocalStorage('search').should('be.equal', fakerWord);
          });

          //Com Cypress, podemos "escopar" a partir de qual elemento faremos a seleção, o que pode ajudar na legibilidade dos testes.
          //before -> cy.get('.last-searches button').should('have.length', 5);
          //after using within
          cy.get('.last-searches')
            .within(()=>{
              cy.get('button').should('have.length',5);
            })
        });
      });
    });
  });
});

it('shows a "Loading ..." state before showing the results', () => {
  cy.intercept('GET', '**/search**',{ delay: 1000, fixture:'stories' }).as('getDelaytedStories');
  cy.visit('/');
  cy.assertLoadingIsShownAndHidden();
  cy.wait('@getDelaytedStories');
  
  //Assertion
  cy.get('.item').should('have.length', 2)
})

context('Errors', () => {
  it('shows "Something went wrong ..." in case of a server error', () => {
    cy.intercept('GET', '**/search**', { statusCode: 500 }).as('getServerFailure');
    cy.visit('/');
    cy.wait('@getServerFailure');

    // Assertion
    cy.get('p:contains(Something went wrong ...)').should('be.visible');
  })

  it('shows "Something went wrong ..." in case of a network error', () => {
    cy.intercept('GET', '**/search**', { forceNetworkError: true }).as('getNetworkFailure');
    cy.visit('/');
    cy.wait('@getNetworkFailure');

    // Assertion
    cy.get('p:contains(Something went wrong ...)').should('be.visible');
  })
})

// it('types and submits the form directly', () => {
//   cy.get('form input[type="text"]').should('be.visible').clear().type('cypress');
//   //cy.get('form').submit();
//   cy.wait('@getNewTermStories');

//   // Assertion
//   cy.get('.item').should('have.length', 20);
// });