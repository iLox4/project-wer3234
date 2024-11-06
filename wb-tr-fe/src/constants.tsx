import { MultiComboBoxItem, Text } from '@ui5/webcomponents-react'
import i18next from './i18n'

/** DEFAULT STATES:START */
export const defaultColors = {
    primary: '#d04a02',
    secondary: '#eb8c00',
    primaryText: 'white',
    secondaryText: 'black'
}

export const defaultFileProps = {
    languageCodes: [],
    objects: 'all',
    pickList: 'all'
}
/** DEFAULT STATES:END */ 

/** INFO MESSAGES:START */
export const importCSVInfoMessage = <Text>{i18next.t('importCsvInfo')}<br/>
    <b>Alert Message</b><br/>
    <b>Fo Translation</b><br/>
    <b>Message Definition</b><br/>
    <b>HRIS Element</b><br/>
    <b>HRIS Element - HRIS fields</b><br/>
    <b>Localized HRIS Element</b><br/>
    <b>Localized HRIS Element - Localized HRIS Fields</b><br/>
    <b>Object Definition</b><br/>
    <b>Picklist Values</b></Text>

export const importWBInfoMessage = <Text>{i18next.t('importWbInfo')}<br/>{i18next.t('example')} <b>workbooks_cs_CZ.xlsx</b></Text>

export const propertiesSetInfoMessage = <Text>{i18next.t('propertiesSetInfo')}</Text>
/** INFO MESSAGES:END */

/** HELPER COMPONENTS:START */
export const objectSelectOptions = [
    { id: 'all', text: 'All Objects' },
    { id: 'preselected', text: 'Preselected Objects (?)' },
    { id: 'onlyPosition', text: 'Only Position' }
] 

export const pickListSelectOptions = [
    { id: 'all', text: 'All Picklists Values' },
    { id: 'active', text: 'Only Active Picklists' }
]

export const languagesComboBoxItems = [
    <MultiComboBoxItem
        text='bs_ID'
        key='bs_ID'
        additionalText='Bahasa Indonesia ‎(Indonesian)‎'
    />,
    <MultiComboBoxItem
        text='bs_BS'
        key='bs_BS'
        additionalText='Bahasa Melayu ‎(Malay)‎'
    />,    
    <MultiComboBoxItem
        text='ca_ES'
        key='ca_ES'
        additionalText='Català ‎(Catalan)‎'
    />,
    <MultiComboBoxItem
        text='cs_CZ'
        key='cs_CZ'
        additionalText='Čeština ‎(Czech)‎'
    />,
    <MultiComboBoxItem
        text='cy_GB'
        key='cy_GB'
        additionalText='Cymraeg ‎(Welsh)‎'
    />,
    <MultiComboBoxItem
        text='da_DK'
        key='da_DK'
        additionalText='Dansk ‎(Danish)‎'
    />,
    <MultiComboBoxItem
        text='et_EE'
        key='et_EE'
        additionalText='eesti keel ‎(Estonian)‎'
    />,    
    <MultiComboBoxItem
        text='de_DE'
        key='de_DE'
        additionalText='Deutsch ‎(German)‎'
    />,
    <MultiComboBoxItem
        text='en_GB'
        key='en_GB'
        additionalText='English UK ‎(English UK)‎'
    />,
    <MultiComboBoxItem
        text='en_US'
        key='en_US'
        additionalText='English US ‎(English US)‎'
    />,
    <MultiComboBoxItem
        text='es_MX'
        key='es_MX'
        additionalText='Español ‎(Mexico)‎'
    />,
    <MultiComboBoxItem
        text='es_ES'
        key='es_ES'
        additionalText='Español ‎(Spanish)‎'
    />,
    <MultiComboBoxItem
        text='fr_FR'
        key='fr_FR'
        additionalText='Français ‎(French)‎'
    />,
    <MultiComboBoxItem
        text='fr_CA'
        key='fr_CA'
        additionalText='Français canadien ‎(Canadian Frnch)‎'
    />,
    <MultiComboBoxItem
        text='hr_HR'
        key='hr_HR'
        additionalText='Hrvatski ‎(Croatian)‎'
    />,
    <MultiComboBoxItem
        text='it_IT'
        key='it_IT'
        additionalText='Italiano ‎(Italian)‎'
    />,
    <MultiComboBoxItem
        text='lv_LV'
        key='lv_LV'
        additionalText='Latviešu ‎(Latvian)‎'
    />,
    <MultiComboBoxItem
        text='lt_LT'
        key='lt_LT'
        additionalText='Lietuvių k ‎(Lithuanian)‎'
    />,
    <MultiComboBoxItem
        text='hu_HU'
        key='hu_HU'
        additionalText='Magyar ‎(Hungarian)‎'
    />,
    <MultiComboBoxItem
        text='nl_NL'
        key='nl_NL'
        additionalText='Nederlands ‎(Dutch)‎'
    />,
    <MultiComboBoxItem
        text='nb_NO'
        key='nb_NO'
        additionalText='Norsk bokmål ‎(Norwegian Bokmål‎'
    />,
    <MultiComboBoxItem
        text='pl_PL'
        key='pl_PL'
        additionalText='Polski ‎(Polish)‎'
    />,
    <MultiComboBoxItem
        text='pt_PT'
        key='pt_PT'
        additionalText='Português ‎(Portuguese)‎'
    />,
    <MultiComboBoxItem
        text='pt_BR'
        key='pt_BR'
        additionalText='Português do Brasil ‎(BrazilianPortuguese)‎'
    />,
    <MultiComboBoxItem
        text='ro_RO'
        key='ro_RO'
        additionalText='Română ‎(Romanian)‎'
    />,
    <MultiComboBoxItem
        text='de_CH'
        key='de_CH'
        additionalText='Schweizer Hochdeutsch ‎(Swiss Hgh German)‎'
    />,
    <MultiComboBoxItem
        text='sk_SK'
        key='sk_SK'
        additionalText='Slovenčina ‎(Slovak)‎'
    />,
    <MultiComboBoxItem
        text='sl_Sl'
        key='sl_Sl'
        additionalText='Slovenščina ‎(Slovenian)‎'
    />,
    <MultiComboBoxItem
        text='sr_RS'
        key='sr_RS'
        additionalText='Srpski ‎(Serbian)‎'
    />,
    <MultiComboBoxItem
        text='fi_FI'
        key='fi_FI'
        additionalText='Suomi ‎(Finnish)‎'
    />,
    <MultiComboBoxItem
        text='sv_SE'
        key='sv_SE'
        additionalText='Svenska ‎(Swedish)‎'
    />,
    <MultiComboBoxItem
        text='vi_VN'
        key='vi_VN'
        additionalText='Tiếng Việt ‎(Vietnamese)‎'
    />,
    <MultiComboBoxItem
        text='tr_TR'
        key='tr_TR'
        additionalText='Türkçe ‎(Turkish)‎'
    />,
    <MultiComboBoxItem
        text='el_GR'
        key='el_GR'
        additionalText='Ελληνικά ‎(Greek)‎'
    />,
    <MultiComboBoxItem
        text='bg_BG'
        key='bg_BG'
        additionalText='Български ‎(Bulgarian)‎'
    />,    
    <MultiComboBoxItem
        text='ru_RU'
        key='ru_RU'
        additionalText='Русский ‎(Russian)‎'
    />,
    <MultiComboBoxItem
        text='uk_UA'
        key='uk_UA'
        additionalText='Українська мова ‎(Ukrainian)‎'
    />,
    <MultiComboBoxItem
        text='iw_IL'
        key='iw_IL'
        additionalText='עִבְרִית ‎(Hebrew)‎'
    />,
    <MultiComboBoxItem
        text='ar_SA'
        key='ar_SA'
        additionalText='العربية ‎(Arabic)‎'
    />,
    <MultiComboBoxItem
        text='hi_IN'
        key='hi_IN'
        additionalText=' हिंदी ‎(Hindi)‎'
    />,
    <MultiComboBoxItem
        text='h_TH'
        key='h_TH' 
        additionalText='าไทย ‎(Thai)‎'
    />,
    <MultiComboBoxItem
        text='ko_KR'
        key='ko_KR'
        additionalText='한국어 ‎(Korean)‎'
    />,
    <MultiComboBoxItem
        text='ja_JP'
        key='ja_JP'
        additionalText='日本語 ‎(Japanese)‎'
    />,
    <MultiComboBoxItem
        text='zh_CN'
        key='zh_CN'
        additionalText='简体中文 ‎(Simplified Chinese)‎'
    />,
    <MultiComboBoxItem
        text='zh_TW'
        key='zh_TW'
        additionalText='繁體中文 ‎(Traditional Chinese)‎'
    />
]

export const preselectedObjsPopoverText = <><h3>Included objects:</h3><p>
    CustomPayType<br/>
    CustomPayTypeAssignment<br/>
    EmpCostDistribution<br/>
    EmpCostDistributionItem<br/>
    EmployeeTime<br/>
    PaymentInformationV3<br/>
    PaymentInformationDetailV3 (+ country spec.)<br/>
    PaymentMethodV3<br/>
    PaymentMethodAssignmentV3<br/>
    Position<br/>
    PositionMatrixRelationship<br/>
    WorkOrder<br/>
    + custom objects (cust_)</p>
</>
/** HELPER COMPONENTS:END */