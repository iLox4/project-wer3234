import { Button } from '@ui5/webcomponents-react'
import './ActionButton.css'

type ActionButtonProps = {
    handleClick: () => void,
    isDisabled: boolean,
    label: string
}

const ActionButton = ({ handleClick, isDisabled, label }: ActionButtonProps) => {
    return (
        <Button 
            className='actionButton' 
            onClick={handleClick} 
            disabled={isDisabled} 
            design='Emphasized'
            >{label}
        </Button>
    )
}

export default ActionButton;