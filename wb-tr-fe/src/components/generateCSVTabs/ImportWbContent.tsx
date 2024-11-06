import { Button, FileUploader, FileUploaderDomRef, Ui5CustomEvent } from '@ui5/webcomponents-react'
import TabContent from '../ui/tabs-comps/tab-content/TabContent'
import { FileUploaderChangeEventDetail } from '@ui5/webcomponents/dist/FileUploader.js'
import { importWBInfoMessage } from '../../constants'
import TabGridWrapper from '../ui/tabs-comps/tab-grid/grid-wrapper/TabGridWrapper'
import TabGridWrapperItem from '../ui/tabs-comps/tab-grid/grid-item/TabGridItemWrapper'
import { useTranslation } from 'react-i18next'

type ImportWbContentProps = {
    handleFileChange: (e: Ui5CustomEvent<FileUploaderDomRef, FileUploaderChangeEventDetail>) => void,
}

const ImportWbContent = ({ handleFileChange }: ImportWbContentProps) => {
    const { t } = useTranslation()

    return (
        <TabContent 
            title={'1. ' + t('importFilesTitle')} 
            infoMessage={importWBInfoMessage}>
                <TabGridWrapper>
                    <TabGridWrapperItem>
                        <FileUploader accept='.zip' onChange={handleFileChange}>
                            <Button>Browse...</Button>
                        </FileUploader>
                    </TabGridWrapperItem>
                </TabGridWrapper>
        </TabContent>
    )
}

export default ImportWbContent