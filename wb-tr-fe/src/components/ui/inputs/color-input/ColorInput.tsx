import { ReactNode, useRef, useState } from 'react'
import { ColorPalettePopover, Button, Ui5CustomEvent, ColorPalettePopoverDomRef, ColorPaletteItem, ButtonDomRef } from '@ui5/webcomponents-react'
import { ColorPaletteItemClickEventDetail } from '@ui5/webcomponents/dist/ColorPalette.js'
import { defaultColors } from '../../../../constants'
import '@ui5/webcomponents/dist/features/ColorPaletteMoreColors.js'
import './ColorInput.css'
import InputLabelWrapper from '../input-with-label-wrapper/InputLabelWrapper'

type ColorInputProps = {
    setSelectedColor: (color: string) => void
    selectedColor: string
    label: string
}

const ColorInput = ({ setSelectedColor, selectedColor, label }: ColorInputProps) => {
    const [isPopOverOpen, setIsPopOverOpen] = useState(false)
    const buttonRef = useRef<ButtonDomRef>(null)
    
    const handleColorPick = (e: Ui5CustomEvent<ColorPalettePopoverDomRef, ColorPaletteItemClickEventDetail>) => {
        setSelectedColor(e.detail.color)
    }

    const colorsInPalette: ReactNode[] = []
    for (const [colorType, color] of Object.entries(defaultColors)) {
        colorsInPalette.push(<ColorPaletteItem value={color} key={colorType}/>)
    }
    
    return (
        <InputLabelWrapper label={label}>
            <div className='colorPreview' style={{backgroundColor: selectedColor}}></div>
            <Button icon='palette' ref={buttonRef} onClick={() => setIsPopOverOpen(true)}/>
            <ColorPalettePopover showMoreColors={true} onItemClick={handleColorPick} open={isPopOverOpen} opener={buttonRef.current as ButtonDomRef} onClose={() => setIsPopOverOpen(false)}>
                {colorsInPalette}
            </ColorPalettePopover>
        </InputLabelWrapper>
    )
}

export default ColorInput