import React from 'react'
import GenerateFileContent from '../../../src/components/common-tabs/GenerateFileContent'

describe('GenerateFileContent.tsx', () => {
  it('renders the Generate button and handles click', () => {
    const mockHandleGenerateFile = cy.stub().as('handleGenerateFile')
    const mockCommunicationState = {
      isLoading: false,
      isError: false,
    }
    const mockUseGenerateFile = () => ({
      handleGenerateFile: mockHandleGenerateFile,
      communicationState: mockCommunicationState,
    })

    const mockMessages = []
    const mockIsGenerating = false
    const mockUseSocket = () => ({
      messages: mockMessages,
      isGenerating: mockIsGenerating,
    })

    const file = new File(['file content'], 'test.csv', { type: 'text/csv' });
    const title = 'Test Title';
    const fileProperties = {
      clientName: 'Client A',
      colors: {},
      otherProps: {},
    };
    const mode = 'csv'

    cy.mount(
      <GenerateFileContent
        file={file}
        title={title}
        fileProperties={fileProperties}
        mode={mode}
        socketHook={mockUseSocket}
        generateFileHook={mockUseGenerateFile}
      />
    );

    cy.get('.actionButton').should('not.be.disabled').click()
    cy.get('@handleGenerateFile').should('have.been.calledWith', file, Cypress.sinon.match.string, fileProperties)
  })

  it('disables the Generate button when loading', () => {
    cy.window().then((win) => {
      // Mock implementations
      const mockCommunicationState = {
        isLoading: true,
        isError: false,
      }
      const mockUseGenerateFile = () => ({
        handleGenerateFile: cy.stub(),
        communicationState: mockCommunicationState,
      })

      const mockUseSocket = () => ({
        messages: [],
        isGenerating: false,
      })

      cy.mount(
        <GenerateFileContent
          file={null}
          title='Test Title'
          mode='csv'
          generateFileHook={mockUseGenerateFile}
          socketHook={mockUseSocket}
        />
      );

      cy.get('.actionButton').should('be.disabled')
      cy.get('ui5-busy-indicator').should('exist')
    })
  })

  it('shows an error message if generateFile request failed', () => {
    const mockCommunicationState = {
      isLoading: false,
      isError: true,
    }

    const mockUseGenerateFile = () => ({
      handleGenerateFile: cy.stub(),
      communicationState: mockCommunicationState,
    })

    const mockUseSocket = () => ({
      messages: [],
      isGenerating: false,
    })

    cy.mount(
      <GenerateFileContent
        file={null}
        title="Test Title"
        mode="csv"
        generateFileHook={mockUseGenerateFile}
        socketHook={mockUseSocket}
      />
    )

    cy.get('ui5-message-strip').should('exist')
  })

  it('displays messages when avaible', () => {
    const mockUseGenerateFile = () => ({
      handleGenerateFile: cy.stub(),
      communicationState: {
        isLoading: false,
        isError: false,
      },
    })

    const mockMessages = ['Message 1', 'Message 2']
    const mockUseSocket = () => ({
      messages: mockMessages,
      isGenerating: false,
    })

    cy.mount(
      <GenerateFileContent
        file={null}
        title="Test Title"
        mode="csv"
        generateFileHook={mockUseGenerateFile}
        socketHook={mockUseSocket}
      />
    );

    cy.contains('Message 1').should('exist')
    cy.contains('Message 2').should('exist')
  })
})