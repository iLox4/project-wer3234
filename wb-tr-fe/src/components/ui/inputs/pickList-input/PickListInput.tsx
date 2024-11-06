import { Option, Select, SelectDomRef, Ui5CustomEvent } from '@ui5/webcomponents-react'
import { SelectChangeEventDetail } from '@ui5/webcomponents/dist/Select.js'
import { pickListSelectOptions } from '../../../../constants'

type PickListInputProps = {
    setSelectedPickList: (object: string) => void
    id?: string
}

const PickListInput = ({ setSelectedPickList, id }: PickListInputProps) => {
    const handlePickListSelect = (event: Ui5CustomEvent<SelectDomRef, SelectChangeEventDetail>) => {
        setSelectedPickList(event.detail.selectedOption.dataset.id as string)
    }

    return (
        <Select onChange={handlePickListSelect} id={id}>
            {pickListSelectOptions.map((item) => 
                <Option key={item.id} data-id={item.id}>
                    {item.text}
                </Option>)
            }
        </Select>
    )
}

export default PickListInput