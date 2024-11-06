import './ColorPreview.css'

type ColorPreivewProps = {
    backgroundColor: string,
    fontColor: string,
    textItems: string[]
}

const ColorPreview = ({backgroundColor, fontColor, textItems}: ColorPreivewProps) => {
    const textElements = textItems.map(textItem => <div key={textItem}>{textItem}</div>)

    return (
        <div className='colorPreviewWrapper' style={{backgroundColor, color: fontColor}}>
            {textElements}
        </div>
    )
}

export default ColorPreview