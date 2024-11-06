import TabContent from '../ui/tabs-comps/tab-content/TabContent'
import { Button, FileUploader, FileUploaderDomRef, Input, InputDomRef, Ui5CustomEvent } from '@ui5/webcomponents-react'
import { FileUploaderChangeEventDetail } from '@ui5/webcomponents/dist/FileUploader.js'
import TabGridWrapperItem from '../ui/tabs-comps/tab-grid/grid-item/TabGridItemWrapper'
import TabGridWrapper from '../ui/tabs-comps/tab-grid/grid-wrapper/TabGridWrapper'
import { importCSVInfoMessage } from '../../constants'
import { useTranslation } from 'react-i18next'

type ImportCSVContentProps = {
    handleFileChange: (e: Ui5CustomEvent<FileUploaderDomRef, FileUploaderChangeEventDetail>) => void,
    setClientName: React.Dispatch<React.SetStateAction<string | null>>
}

const ImportCSVContent = ({ handleFileChange, setClientName }: ImportCSVContentProps) => {
    const { t } = useTranslation()

    const handleChangeClientName = (e: Ui5CustomEvent<InputDomRef, never>) => {
        setClientName(e.target.value)
    }
    
    return (
        <TabContent
            title={'1. ' + t('importFilesTitle')}
            infoMessage={importCSVInfoMessage}>
                <TabGridWrapper>
                    <TabGridWrapperItem title={t('fileUpload')}>
                        <FileUploader accept='.zip' onChange={handleFileChange}>
                            <Button>Browse...</Button>
                        </FileUploader>
                    </TabGridWrapperItem>
                    <TabGridWrapperItem title={t('clientName')}>
                        <Input type='Text' name='Client Name' accessibleName='Client Name Input' showClearIcon={true} placeholder={t('clientNamePlaceholder')} onChange={handleChangeClientName} />
                    </TabGridWrapperItem>
                </TabGridWrapper>
        </TabContent>
    )
}

export default ImportCSVContent