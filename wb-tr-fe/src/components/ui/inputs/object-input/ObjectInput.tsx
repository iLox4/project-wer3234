import { Option, OptionDomRef, Popover, Select, SelectDomRef, Ui5CustomEvent } from '@ui5/webcomponents-react'
import { SelectChangeEventDetail } from '@ui5/webcomponents/dist/Select.js'
import { useRef, useState } from 'react'
import { objectSelectOptions, preselectedObjsPopoverText } from '../../../../constants'

type ObjectInputProps = {
    setSelectedObject: (object: string) => void
    id?: string
}

const ObjectInput = ({ setSelectedObject, id }: ObjectInputProps) => {
    const optionRef = useRef<OptionDomRef>(null)
    const [ isPopoverOpen, setIsPopoverOpen ] = useState(false)

    const handleObejectSelect = (event: Ui5CustomEvent<SelectDomRef, SelectChangeEventDetail>) => {
        setSelectedObject(event.detail.selectedOption.dataset.id as string)
    }

    const hanldeMouseEnter = () => {
        if (optionRef.current) {
            setIsPopoverOpen(true)
        }
    }
    
    const handleMouseLeave = () => {
        if (optionRef.current) {
            setIsPopoverOpen(false)
        }
    }

    return (
        <>
            <Select onChange={handleObejectSelect} id={id}>
                {objectSelectOptions.map((item) => {
                    if (item.id === 'preselected') {
                        return (
                            <Option key={item.id} data-id={item.id} ref={optionRef} onMouseEnter={hanldeMouseEnter} onMouseLeave={handleMouseLeave}>
                                {item.text}
                            </Option>
                        )
                    }
                    return (
                        <Option key={item.id} data-id={item.id}>
                            {item.text}
                        </Option>
                    )
                })}
            </Select>
            <Popover open={isPopoverOpen} opener={optionRef.current as OptionDomRef}>{preselectedObjsPopoverText}</Popover>
        </>
    )
}

export default ObjectInput