
import React from 'react'
import PropertiesSetContent from '../../../src/components/generateWBTabs/PropertiesSetContent'

// Import necessary UI5 web components
import '@ui5/webcomponents/dist/MultiComboBox.js'
import '@ui5/webcomponents/dist/ColorPalette.js'
import '@ui5/webcomponents/dist/ColorPicker.js'
import '@ui5/webcomponents/dist/Input.js'

describe('PropertiesSetContent Component', () => {
  const initialPickedColors = {
    primary: '#ff0000',
    secondary: '#00ff00',
    primaryText: '#0000ff',
    secondaryText: '#ffffff',
  };

  it('renders without errors', () => {
    const setPickedColor = cy.stub()
    const setFileProps = cy.stub()

    cy.mount(
      <PropertiesSetContent
        pickedColors={initialPickedColors}
        setPickedColor={setPickedColor}
        setFileProps={setFileProps}
      />
    );

    // Check that the title is rendered
    cy.contains('2. Properties Definition').should('exist')

    // Check that all TabGridWrapperItems are rendered
    cy.contains('Color').should('exist')
    cy.contains('Color Preview').should('exist')
    cy.contains('Language Codes(required)').should('exist')
    cy.contains('Objects').should('exist')
    cy.contains('Picklists').should('exist')
  });

  it('should renders colors inputs', () => {
    const setPickedColor = cy.stub().as('setPickedColor')
    const setFileProps = cy.stub()

    cy.mount(
      <PropertiesSetContent
        pickedColors={initialPickedColors}
        setPickedColor={setPickedColor}
        setFileProps={setFileProps}
      />
    )

    // Should render colors inputs
    cy.contains('Primary color:').should('exist')
    cy.contains('Secondary color:').should('exist')
    cy.contains('Primary font color:').should('exist')
    cy.contains('Secondary font color:').should('exist')
  })

  it('should allows selecting languages in MultiComboBox', () => {
    const setPickedColor = cy.stub()
    const setFileProps = cy.stub().as('setFileProps')

    cy.mount(
      <PropertiesSetContent
        pickedColors={initialPickedColors}
        setPickedColor={setPickedColor}
        setFileProps={setFileProps}
      />
    )

    // Language selector must exist
    cy.get('#languageSelector').as('multiComboBox')

    // Open the MultiComboBox dropdown
    cy.get('@multiComboBox')
      .shadow()
      .find('.inputIcon')
      .click()

    // Select the first option  
    cy.get('@multiComboBox')
      .shadow()
      .find('ui5-li')
      .first()
      .click()

    // Assert that setFileProps was called with 'languageCodes' and the selected languages
    cy.get('@setFileProps').should('have.been.calledWith', 'languageCodes', Cypress.sinon.match.array)
  })

  it('interacts with ObjectInput and calls setFileProps', () => {
    const setPickedColor = cy.stub()
    const setFileProps = cy.stub().as('setFileProps')

    cy.mount(
      <PropertiesSetContent
        pickedColors={initialPickedColors}
        setPickedColor={setPickedColor}
        setFileProps={setFileProps}
      />
    )

    // Object selector must exist
    cy.get('#objectSelector').as('objectSelect')

    // Open the select dropdown
    cy.get('@objectSelect')
      .shadow()
      .find('div[role="combobox"]')
      .click()

    // Select Only Position option
    cy.get('ui5-option[data-id=onlyPosition]')
      .shadow()
      .find('li')
      .click({ force: true })
   
    // Assert that setFileProps was called with the right arguments  
    cy.get('@setFileProps').should('have.been.calledWith', 'objects', 'onlyPosition')
  })

  it('interacts with PickListInput and calls setFileProps', () => {
    const setPickedColor = cy.stub()
    const setFileProps = cy.stub().as('setFileProps')

    cy.mount(
      <PropertiesSetContent
        pickedColors={initialPickedColors}
        setPickedColor={setPickedColor}
        setFileProps={setFileProps}
      />
    )

    // Object selector must exist
    cy.get('#pickListSelector').as('pickListSelect')

    // Open the select dropdown
    cy.get('@pickListSelect')
      .shadow()
      .find('div[role="combobox"]')
      .click()

    // Select Only Position option
    cy.get('ui5-option[data-id=active]')
      .shadow()
      .find('li')
      .click({ force: true })
   
    // Assures that setFileProps was called with the right arguments  
    cy.get('@setFileProps').should('have.been.calledWith', 'pickList', 'active')
  })
})
