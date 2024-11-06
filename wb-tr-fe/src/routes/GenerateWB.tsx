import { memo, useState } from 'react'
import { FileUploaderDomRef, Tab, TabContainer, TabContainerDomRef, Ui5CustomEvent } from '@ui5/webcomponents-react'
import ImportCSVContent from '../components/generateWBTabs/ImportCSVContent'
import { defaultColors, defaultFileProps } from '../constants'
import PropertiesSetContent from '../components/generateWBTabs/PropertiesSetContent'
import GenerateFileContent from '../components/common-tabs/GenerateFileContent'
import { FileUploaderChangeEventDetail } from '@ui5/webcomponents/dist/FileUploader.js'
import { TabContainerTabSelectEventDetail } from '@ui5/webcomponents/dist/TabContainer.js'
import ActionButton from '../components/ui/buttons/ActionButton'
import { useTranslation } from 'react-i18next'

export type PickedColorsType = {
    primary: string,
    secondary: string,
    primaryText: string,
    secondaryText: string
}

export type FilePropsType = {
    languageCodes: string[],
    objects: string,
    pickList: string
}

export type FilePropsValue = boolean & string[] & string

const GenerateWB = memo(() => {
    const [ selectedTab, setSelectedTab ] = useState('imp-csv')
    const [ selectedFile, setSelectedFile ] = useState<File | null>(null)
    const [ clientName, setClientName ] = useState<null | string>(null)
    const [ pickedColors, setPickedColors ] = useState<PickedColorsType>(defaultColors)
    const [ fileProps, setFileProps ] = useState<FilePropsType>(defaultFileProps)

    const { t } = useTranslation()

    const handleTabSelect = (e: Ui5CustomEvent<TabContainerDomRef, TabContainerTabSelectEventDetail>) => {
        setSelectedTab(e.detail.tab.id)
    }

    const handleFileChange = (e: Ui5CustomEvent<FileUploaderDomRef, FileUploaderChangeEventDetail>) => {
        const selectedFile = e.target.files?.[0] || null
        setSelectedFile(selectedFile)
    }

    const handlePickColor = (colorType: keyof PickedColorsType, pickedColor: string) => {
        setPickedColors(prevColors => {
            const newColors = { ...prevColors }
            newColors[colorType] = pickedColor
            return newColors
        })
    }

    const handleSetFileProps = (propName: keyof FilePropsType, propValue: FilePropsValue) => {
        setFileProps(prevProps => {
            const newProps = { ...prevProps }
            newProps.languageCodes = [...prevProps.languageCodes]
            newProps[propName] = propValue
            return newProps
        })
    }

    const fileProperties = {
        clientName,
        colors: pickedColors,
        otherProps: fileProps
    }

    return (
        <TabContainer
            onTabSelect={handleTabSelect}
            contentBackgroundDesign='Solid'
            headerBackgroundDesign='Solid'
            tabLayout="Inline"
            id='filePropsDef'>
                <Tab icon='upload' text={'1. ' + t('importFilesTitle')} id='imp-csv' selected={selectedTab === 'imp-csv'}>
                    <ImportCSVContent handleFileChange={handleFileChange} setClientName={setClientName} />
                    <ActionButton handleClick={() => setSelectedTab('set-file-props')} isDisabled={!selectedFile} label={t('nextStep')}/>
                </Tab>
                <Tab icon='customize' text={'2. ' + t('definePropsTitle')} disabled={!selectedFile} id='set-file-props' selected={selectedTab === 'set-file-props'}>
                    <PropertiesSetContent pickedColors={pickedColors} setPickedColor={handlePickColor} setFileProps={handleSetFileProps} />
                    <ActionButton handleClick={() => setSelectedTab('gen-wb')} isDisabled={!selectedFile || fileProps.languageCodes.length === 0} label={t('nextStep')}/>
                </Tab>
                <Tab icon='download' text={'3. ' + t('generateFilesTitle')} disabled={!selectedFile || fileProps.languageCodes.length === 0} id='gen-wb' selected={selectedTab === 'gen-wb'}>
                    <GenerateFileContent title={'3. ' + t('generateFilesTitle')} fileProperties={fileProperties} mode='csv' file={selectedFile} />
                </Tab>
        </TabContainer>
    )
})

export default GenerateWB