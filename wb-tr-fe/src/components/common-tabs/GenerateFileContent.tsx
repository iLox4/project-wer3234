import TabContent from '../ui/tabs-comps/tab-content/TabContent'
import ActionButton from '../ui/buttons/ActionButton'
import useGenerateFile from '../../hooks/useGenerateFile'
import { BusyIndicator, List, ListItemStandard, MessageStrip } from '@ui5/webcomponents-react'
import { FilePropsType, PickedColorsType } from '../../routes/GenerateWB'
import useSocket from '../../hooks/useSocket'
import { useTranslation } from 'react-i18next'

type GenerateFileProps = {
    file: File | null
    title: string
    fileProperties?: {
        clientName: string | null,
        colors: PickedColorsType,
        otherProps: FilePropsType
    }
    mode: 'csv' | 'wb'
    // added for testing to inject mocked hooks
    generateFileHook?: typeof useGenerateFile
    socketHook?: typeof useSocket
}

// only for development
const generatedUUid = crypto.randomUUID()

const GenerateFileContent = ({ title, fileProperties, mode, file, generateFileHook = useGenerateFile, socketHook = useSocket }: GenerateFileProps) => {
    const { handleGenerateFile, communicationState } = generateFileHook(mode);
    const { messages, isGenerating } = socketHook(generatedUUid);
    const { t } = useTranslation()

    const isLoading = communicationState.isLoading
    const errorMessage = <MessageStrip design='Critical'>{t('fileGeneratedFailedInfoMessage')}</MessageStrip>

    const messagesList = <List headerText={t('generatingProcess')}>
        {messages.map(message => {
            return <ListItemStandard key={message}>{message}</ListItemStandard>
        })}
    </List>

    return (
        <TabContent
            title={title}
            infoMessage={t('generateFileInfoMessage')}>
                <ActionButton label={t('generate')} isDisabled={isLoading || isGenerating} handleClick={() => handleGenerateFile(file as File, generatedUUid, fileProperties)} />
                { isLoading && <BusyIndicator active /> }
                { communicationState.isError && errorMessage }
                { messages.length > 0 && messagesList }
        </TabContent>
    )
}

export default GenerateFileContent