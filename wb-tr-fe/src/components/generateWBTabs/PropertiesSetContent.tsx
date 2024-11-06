import TabGridWrapperItem from '../ui/tabs-comps/tab-grid/grid-item/TabGridItemWrapper'
import TabGridWrapper from '../ui/tabs-comps/tab-grid/grid-wrapper/TabGridWrapper'
import TabContent from '../ui/tabs-comps/tab-content/TabContent'
import ColorInput from '../ui/inputs/color-input/ColorInput'
import { FilePropsType, FilePropsValue, PickedColorsType } from '../../routes/GenerateWB'
import { languagesComboBoxItems, propertiesSetInfoMessage } from '../../constants'
import ColorPreview from '../ui/others/ColorPreview'
import { MultiComboBox, MultiComboBoxDomRef, Ui5CustomEvent } from '@ui5/webcomponents-react'
import { MultiComboBoxSelectionChangeEventDetail } from '@ui5/webcomponents/dist/MultiComboBox.js'
import ObjectInput from '../ui/inputs/object-input/ObjectInput'
import PickListInput from '../ui/inputs/pickList-input/PickListInput'
import { useTranslation } from 'react-i18next'

type PropertiesSetContentProps = {
    pickedColors: PickedColorsType
    setPickedColor: (colorType: keyof PickedColorsType, pickedColor: string) => void
    setFileProps: (propName: keyof FilePropsType, propValue: FilePropsValue) => void  
}

const PropertiesSetContent = ({ pickedColors, setPickedColor, setFileProps }: PropertiesSetContentProps) => {
    const { t } = useTranslation()

    const handleChooseLanguage = (e: Ui5CustomEvent<MultiComboBoxDomRef, MultiComboBoxSelectionChangeEventDetail>) => {
        const selectedValues = Array.from(e.detail.items).map((item: any) => item.text)
        setFileProps('languageCodes', selectedValues as FilePropsValue)
    }

    return (
        <TabContent
            title={'2. ' + t('definePropsTitle')}
            infoMessage={propertiesSetInfoMessage}>
                <TabGridWrapper>
                    <TabGridWrapperItem title={t('color')}>
                        <ColorInput label={t('primaryColor')} selectedColor={pickedColors.primary} setSelectedColor={(color: string) => { setPickedColor('primary', color) }}/>
                        <ColorInput label={t('secondaryColor')} selectedColor={pickedColors.secondary} setSelectedColor={(color: string) => { setPickedColor('secondary', color) }}/>
                        <ColorInput label={t('primaryFontColor')} selectedColor={pickedColors.primaryText} setSelectedColor={(color: string) => { setPickedColor('primaryText', color) }}/>
                        <ColorInput label={t('secondaryFontColor')} selectedColor={pickedColors.secondaryText} setSelectedColor={(color: string) => { setPickedColor('secondaryText', color) }}/>
                    </TabGridWrapperItem>
                    <TabGridWrapperItem title={t('colorPreview')}>
                        <div>
                            <ColorPreview backgroundColor={pickedColors.primary} fontColor={pickedColors.primaryText} textItems={['Object', 'Object Translation', 'Field Name']} />
                            <ColorPreview backgroundColor={pickedColors.secondary} fontColor={pickedColors.secondaryText} textItems={['Test Value 1', 'Test Value 2', 'Test Value 3']} />
                        </div>
                    </TabGridWrapperItem>
                    <TabGridWrapperItem title={t('lanCodes')}>
                        <MultiComboBox id='languageSelector' onSelectionChange={handleChooseLanguage}>
                            {languagesComboBoxItems}
                        </MultiComboBox>
                    </TabGridWrapperItem>
                    <TabGridWrapperItem title='Objects'>
                        <ObjectInput id='objectSelector' setSelectedObject={(object: string) => setFileProps('objects', object as FilePropsValue)}/>
                    </TabGridWrapperItem>
                    <TabGridWrapperItem title='Picklists'>
                        <PickListInput id='pickListSelector' setSelectedPickList={(pickList: string) => setFileProps('pickList', pickList as FilePropsValue)}/>
                    </TabGridWrapperItem>
                </TabGridWrapper>
        </TabContent>
    )
}

export default PropertiesSetContent