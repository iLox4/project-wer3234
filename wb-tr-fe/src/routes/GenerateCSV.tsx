import { TabContainer, Tab, Ui5CustomEvent, FileUploaderDomRef, TabContainerDomRef } from '@ui5/webcomponents-react'
import ImportWbContent from '../components/generateCSVTabs/ImportWbContent'
import GenerateFileContent from '../components/common-tabs/GenerateFileContent'
import { memo, useState } from 'react'
import { FileUploaderChangeEventDetail } from '@ui5/webcomponents/dist/FileUploader.js'
import { TabContainerTabSelectEventDetail } from '@ui5/webcomponents/dist/TabContainer.js'
import ActionButton from '../components/ui/buttons/ActionButton'
import { useTranslation } from 'react-i18next'

const GenerateCSV = memo(() => {
    const [ selectedTab, setSelectedTab ] = useState('imp-wb')
    const [ selectedFile, setSelectedFile ] = useState<File | null>(null)
    const { t } = useTranslation()

    const handleFileChange = (e: Ui5CustomEvent<FileUploaderDomRef, FileUploaderChangeEventDetail>) => {
        const selectedFile = e.target.files?.[0] || null
        setSelectedFile(selectedFile)
    }

    const handleTabSelect = (e: Ui5CustomEvent<TabContainerDomRef, TabContainerTabSelectEventDetail>) => {
        setSelectedTab(e.detail.tab.id)
    }

    return (
        <TabContainer
            onTabSelect={handleTabSelect}
            contentBackgroundDesign='Solid'
            headerBackgroundDesign='Solid'
            tabLayout="Inline">
                <Tab icon='upload' text={'1. ' + t('importFilesTitle')} id='imp-wb' selected={selectedTab === 'imp-wb'}>
                    <ImportWbContent handleFileChange={handleFileChange} />
                    <ActionButton handleClick={() => setSelectedTab('gen-wb')} isDisabled={!selectedFile} label={t('nextStep')} />
                </Tab>
                <Tab icon='download' text={'2. ' + t('generateFilesTitle')} disabled={!selectedFile} id='gen-wb' selected={selectedTab === 'gen-wb'}>
                    <GenerateFileContent title={'2. ' + t('generateFilesTitle')} mode='wb' file={selectedFile} />
                </Tab>
        </TabContainer>
    )
})

export default GenerateCSV;