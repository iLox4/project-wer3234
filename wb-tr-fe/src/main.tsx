import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/AllIcons.js'
import './main.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './routes/Root.tsx'
import GenerateCSV from './routes/GenerateCSV.tsx'
import ScopeContextProvider from './store/ScopeContextProvider.tsx'
import './i18n'

export const generateCSVpath = 'generateCSV' 

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: generateCSVpath,
        element: <GenerateCSV />
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ScopeContextProvider>
        <RouterProvider router={router} />
      </ScopeContextProvider>
    </ThemeProvider>
  </StrictMode>,
)
