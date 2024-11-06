import { SideNavigation, SideNavigationItem } from '@ui5/webcomponents-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { generateCSVpath } from '../main';
import './SideNav.css';
import { useScopeContext } from '../store/ScopeContextProvider';
import { useTranslation } from 'react-i18next';



const SideNav = ({ isColapsed }: { isColapsed: boolean }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const { scope } = useScopeContext()
    const { t } = useTranslation()

    const isGenerateTrActive = location.pathname === '/'
    const isGenerateCSVActive = location.pathname === ('/' + generateCSVpath)

    const handleNavigateToGenWb = () => {
        if (!scope.includes('GenerateWb')) {
            return
        }
        navigate('/')
    }

    const handleNavigateToGenCsv = () => {
        if (!scope.includes('GenerateCsv')) {
            return
        }
        navigate('/' + generateCSVpath)
    }

    return <SideNavigation collapsed={isColapsed}>
        <SideNavigationItem icon='attachment-zip-file' text={t('generateWbNavText')} onClick={handleNavigateToGenWb} selected={isGenerateTrActive} disabled={!scope.includes('GenerateWb')} />
        <SideNavigationItem icon='excel-attachment' text={t('generateCsvNavText')} onClick={handleNavigateToGenCsv} selected={isGenerateCSVActive} disabled={!scope.includes('GenerateCsv')} />
    </SideNavigation>
}

export default SideNav;