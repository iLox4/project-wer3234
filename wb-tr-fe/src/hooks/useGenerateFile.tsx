import { useState } from 'react'
import axios from 'axios'

//const apiUrl = import.meta.env.VITE_API_URL;

type CommunicationType = {
    isLoading: boolean,
    isError: boolean
}

const useGenerateFile = (mode: 'csv' | 'wb') => {
    const [ communicationState, setCommunicationState ] = useState<CommunicationType>({isError: false, isLoading: false})

    const handleGenerateFile = async (file: File, sessionId: string, props?: object) => {
        setCommunicationState({ isError: false, isLoading: true })
        let url = '/api/'
        url += mode === 'wb' ? 'upload-wb' : 'upload-csv'

        const formData = new FormData()
        formData.append('file', file)
        formData.append('sessionId', sessionId)
        if (mode === 'csv' && props) {
            formData.append('fileProps', JSON.stringify(props))
        }

        try {
            const response = await axios.post(url, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (response.status === 200) {
                setCommunicationState({ isLoading: false, isError: false })
            } else {
                setCommunicationState({ isLoading: false, isError: true })
            }
        } catch (e: any) {
            console.error(e)
            setCommunicationState({ isLoading: false, isError: true })
        }
    }

    return { handleGenerateFile, communicationState } 
}

export default useGenerateFile