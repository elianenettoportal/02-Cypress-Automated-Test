# Cypress Automation

This is a learning project for a Udemy course<br>
* Course github https://github.com/wlsf82/curso-cypress-avancado/tree/main
* Instructor of Udemy https://walmyr.dev.
* Repository https://github.com/wlsf82/curso-cypress-avancado/tree/main/lessons

1. Create a nodejs project
   npm init

2. Create the npm Project and Install Cypress and others Dev Dependencies
- standardjs -> JavaScript styles - npm i standardjs
- faker -> Generate massive amounts of fake (but realistic) data for testing and development. npm i @faker-js/faker
- cypress localstorage commands -> Extends Cypress' cy commands with localStorage methods.<br>
Allows preserving localStorage between tests and spec files, and disabling - localStorage - npm i cypress-localstorage-commands
- cypress -> npm install cypress
- Install all in once:
 > npm i @faker-js/faker cypress cypress-plugin-api cypress-localstorage-commands standardjs -D

3. Configure package json
   Configure scripts
      "scripts": {
      "lint": "npx standard",
      "lint:fix": "npx standard --fix",
      "test": "cypress run",
      "cy:open": "cypress open" // open cypress in a iterative mode
   }
4. Create Cypress config used to store any configuration specific to Cypress.

5. Create the support folder. https://docs.cypress.io/guides/references/configuration
   Keep cypress supportFile default path config. It expects a file matching cypress/support/e2e.{js,jsx,ts,tsx} to exist.<br>
   Path to file to load before spec files load. This file is compiled and bundled. (Pass false to disable)<br>
   It is processed and loaded automatically before your test files.<br>
   This is a great place to put global configuration and behavior that modifies Cypress.<br>

6. Create plugins https://docs.cypress.io/guides/tooling/plugins-guide
   Plugins enable you to tap into, modify, or extend the internal behavior of Cypress.<br>
   You can change the location of this file or turn off loading the plugins file with the 'pluginsFile' configuration option.<br>

7. Create e2e - The tests folder

8. Run tests
   > npm test
   - Open cypress in iterative mode
   > npm run cy:open 
