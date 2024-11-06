import './TabGridWrapper.css'

type TabGridWrapperProps = {
    children: React.ReactNode | React.ReactNode[]
}

const TabGridWrapper = ({ children }: TabGridWrapperProps) => {
    return (
        <div className='gridWrapper'>
            {children}
        </div>
    )
}

export default TabGridWrapper