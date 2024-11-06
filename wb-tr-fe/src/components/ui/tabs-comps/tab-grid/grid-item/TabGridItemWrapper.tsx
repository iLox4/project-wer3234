import { Title } from '@ui5/webcomponents-react'
import './TabGridItemWrapper.css'

type TabGridItemWrapperProps = {
    children: React.ReactNode | React.ReactNode[]
    title?: string
}

const TabGridWrapperItem = ({ children, title }: TabGridItemWrapperProps) => {
    return (
        <div className='gridItem'>
            {title && <Title>{title}</Title>}
            <div className='gridItemContent'>
                {children}
            </div>
        </div>
    )
}

export default TabGridWrapperItem