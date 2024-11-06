import { ReactNode, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ShellBar, Button, BusyIndicator, Option, Select, Ui5CustomEvent, SelectDomRef } from '@ui5/webcomponents-react'
import SideNav from '../components/SideNav'
import GenerateWB from './GenerateWB'
import './Root.css'
import { useScopeContext } from '../store/ScopeContextProvider'
import NoAccess from './NoAccess'
import i18n from '../i18n'
import { SelectChangeEventDetail } from '@ui5/webcomponents/dist/Select.js'

function Root() {
  const [ isMenuColapsed, setIsMenuColapsed ] = useState(false)
  const location = useLocation()
  const { scope, isLoading } = useScopeContext()
  const lanItems: ReactNode[] = []

  if (i18n.options.supportedLngs) {
    i18n.options.supportedLngs.forEach(lan => {
      if (lan !== 'cimode') {
        lanItems.push(
          <Option key={lan} value={lan} data-id={lan} selected={lan === i18n.language}>
            {lan.toUpperCase()}
          </Option>
        )
      }
    })
  }

  const handleLanguageChange = (event: Ui5CustomEvent<SelectDomRef, SelectChangeEventDetail>) => {
    const selectedLanguage = event.detail.selectedOption.value;
    i18n.changeLanguage(selectedLanguage);
  };

  const handleMenuBtnClick = () => {
    setIsMenuColapsed(prevState => !prevState)
  }

  const isRoot = location.pathname === '/'

  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setIsMenuColapsed(true)
    } else {
      setIsMenuColapsed(false)
    }
  }

  const handleSetContent = () => {
    if (isLoading) {
      return <BusyIndicator active />
    }

    const isNoAccess = (scope.length === 0) || (isRoot && !scope.includes('GenerateWb')) || (!isRoot && !scope.includes('GenerateCsv'))

    if (isNoAccess) {
      return <NoAccess />
    }

    return isRoot ? <GenerateWB /> : <Outlet />
  }
  
  let content = handleSetContent()

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <div className='app'>
    <ShellBar primaryTitle='Translation tool' className='shellBar'>
      <Button icon='menu' slot='startButton' onClick={handleMenuBtnClick}></Button>
      
      <Select
        onChange={handleLanguageChange}
        slot='profile'
        className='lanSelect'
      >
        {lanItems}
      </Select>
    </ShellBar>
    <SideNav isColapsed={isMenuColapsed} />
    <div className='content'>
      { content }
    </div>
  </div>
}

export default Root
