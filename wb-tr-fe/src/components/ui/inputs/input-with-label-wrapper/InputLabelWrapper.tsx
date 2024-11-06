import { ReactNode } from 'react'
import './InputLabelWrapper.css'
import { Label } from '@ui5/webcomponents-react'
import '@ui5/webcomponents/dist/Popover.js'

type InputLabelWraperProps = {
    children: ReactNode | ReactNode[]
    label: string
    popOverInfoContent?: ReactNode
}

const InputLabelWrapper = ({ children, label }: InputLabelWraperProps) => {
    return (
        <div className='inputLabelWrapper'>
            <Label>{label}</Label>
            {children}
        </div>
    )
}

export default InputLabelWrapper