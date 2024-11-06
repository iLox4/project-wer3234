import { useState, useEffect, createContext, ReactNode, useContext } from 'react'
import axios from 'axios'

type ScopeContextProviderProps = { children: ReactNode | ReactNode[] }
type ScopeContextValue = { scope: string[], isLoading: boolean }

const ScopeContext = createContext<ScopeContextValue>({ scope: [], isLoading: true })

const ScopeContextProvider = ({ children }: ScopeContextProviderProps) => {
    const [ scope, setScope ] = useState<string[]>([])
    const [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        axios.get('/api/getUserRoles', { withCredentials: true })
            .then(response => {
                setScope(response.data)
                setIsLoading(false)
            })
            .catch(e => {
                console.error('Getting roles failed:', e)
                setIsLoading(false)
            })
    }, [])

    return (
        <ScopeContext.Provider value={{ scope, isLoading }}>
            {children}
        </ScopeContext.Provider>
    )
}

export default ScopeContextProvider

export const useScopeContext = () => {
    const scope = useContext(ScopeContext)
    return scope
}