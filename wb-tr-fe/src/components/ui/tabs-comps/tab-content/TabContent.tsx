import { Title, MessageStrip } from '@ui5/webcomponents-react'
import './TabContent.css'

type TabContentProps = { 
    children: React.ReactNode | React.ReactNode[], 
    title?: string
    infoMessage?: React.ReactNode | string 
}

const TabContent = ({ children, title, infoMessage}: TabContentProps) => {
    return (
        <div className='tabWrapper'>
            {title && <Title>{title}</Title>}
            {infoMessage && <MessageStrip>{infoMessage}</MessageStrip>}
            {children}
        </div>
    )
}

export default TabContent