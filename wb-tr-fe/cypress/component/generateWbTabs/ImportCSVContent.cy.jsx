import React from 'react';
import ImportCSVContent from '../../../src/components/generateWBTabs/ImportCSVContent'; // Update the path accordingly

// Import necessary UI5 web components
import '@ui5/webcomponents/dist/Input.js';
import '@ui5/webcomponents/dist/FileUploader.js';
import '@ui5/webcomponents/dist/Button.js';

describe('ImportCSVContent Component', () => {
  it('renders without errors', () => {
    const handleFileChange = cy.stub()
    const setClientName = cy.stub()

    cy.mount(
      <ImportCSVContent
        handleFileChange={handleFileChange}
        setClientName={setClientName}
      />
    );

    // Check that the title is rendered
    cy.contains('1. Import Files').should('exist')

    // Check that the FileUploader and Input are rendered
    cy.contains('File Upload(required)').should('exist')
    cy.contains('Client Name').should('exist')

    cy.get('ui5-input').should('exist')
    cy.get('ui5-file-uploader').should('exist')
  });

  it('calls handleFileChange when a file is selected', () => {
    const handleFileChange = cy.stub().as('handleFileChange')
    const setClientName = cy.stub()

    cy.mount(
      <ImportCSVContent
        handleFileChange={handleFileChange}
        setClientName={setClientName}
      />
    )

    // Simulate file selection
    cy.get('ui5-file-uploader').then(($el) => {
      const fileUploader = $el[0]
      const file = new File(['dummy content'], 'test.zip', {
        type: 'application/zip',
      });
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)

      // Access the input inside the shadow DOM
      const input = fileUploader.shadowRoot.querySelector('input[type="file"]')
      input.files = dataTransfer.files

      // Dispatch the change event
      input.dispatchEvent(new Event('change', { bubbles: true }))
    })

    // Assert that handleFileChange was called
    cy.get('@handleFileChange').should('have.been.called')
  });

  it('calls setClientName when input changes', () => {
    const handleFileChange = cy.stub()
    const setClientName = cy.stub().as('setClientName')

    cy.mount(
      <ImportCSVContent
        handleFileChange={handleFileChange}
        setClientName={setClientName}
      />
    )

    // Type into the input field
    cy.get('ui5-input')
      .shadow()
      .find('input')
      .type('Test Client')
      .blur()

    // Assert that setClientName was called with 'Test Client'
    cy.get('@setClientName').should('have.been.calledWith', 'Test Client')
  })
})
