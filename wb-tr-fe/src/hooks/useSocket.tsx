import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const useSocket = (sessionId: string | null) => {
  const socketRef = useRef<Socket>()
  const [ messages, setMessages ] = useState<string[]>([])
  const [ isGenerating, setIsGenerating ] = useState(false)

  const handleAddMessage = (message: string) => {
    setMessages(prevMessages => {
        const newMessages = [...prevMessages]
        newMessages.push(message)
        return newMessages
    })
  }

  useEffect(() => {
    const socket = io('/', { query: { sessionId }, path: '/socket.io'})
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Connected to WS server')
    })

    socket.on('fileGenerated', (data) => {
        console.log('Received ZIP file')

        // Create a Blob from the received binary data
        const blob = new Blob([data], { type: 'application/zip' })
  
        // Create a link to download the Blob as a file
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'output.zip'
  
        // Append the link to the document and trigger a click
        document.body.appendChild(link)
        link.click()
  
        // Clean up
        document.body.removeChild(link)
        window.URL.revokeObjectURL(link.href)
        
        setIsGenerating(false) 
    })

    socket.on('infoMessage', ({ message, isError, isStart }) => {
        if (isStart) {
          setMessages([])
          setIsGenerating(true)
        }
        
        if (isError) {
          setIsGenerating(false)
        }

        handleAddMessage(message)
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from WS server')
    })

    return () => {
      socket.disconnect();
    }
  }, [sessionId])

  return { socket: socketRef.current, messages: messages, isGenerating }
};

export default useSocket;
