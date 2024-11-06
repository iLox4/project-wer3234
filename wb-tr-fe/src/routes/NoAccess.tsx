import { Title } from '@ui5/webcomponents-react'
import './NoAccess.css'
import { useTranslation } from 'react-i18next'

const NoAccess = () => {
    const { t } = useTranslation()
    return (
        <div className='textWrapper'>
            <Title level='H1' size='H1'>{t('noRightsText')}</Title>
        </div>
    )
}

export default NoAccess