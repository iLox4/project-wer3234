import React from 'react'
import ImportWbContent from '../../../src/components/generateCSVTabs/ImportWbContent'

describe('ImportWbContent.tsx', () => {
    it('renders without errors', () => {
        const handleFileChange = cy.stub()
    
        cy.mount(
          <ImportWbContent
            handleFileChange={handleFileChange}
          />
        );
    
        // Check that the title is rendered
        cy.contains('1. Import Files').should('exist')
    
        cy.get('ui5-file-uploader').should('exist')
    })

    it('calls handleFileChange when a file is selected', () => {
        const handleFileChange = cy.stub().as('handleFileChange')
        const setClientName = cy.stub()
    
        cy.mount(
          <ImportWbContent
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
    })
})