import { Workbook } from "exceljs";

export type UnzippedFileMap = Record<string, Buffer>;

export type Langs = Array<Record<string, string>>;

export type FileProps = {
    clientName: string,
    colors: { 
        primary: string,
        secondary: string,
        primaryText: string,
        secondaryText: string
    },
    otherProps: {
        languageCodes: string[],
        objects: 'all' | 'preselected' | 'onlyPosition',
        pickList: 'all' | 'preselected'
    }
}

export type WorkbookMap = Record<string, Workbook>

export type SourceFilter = {
    column_name: string,
    filter: RegExp
}

export type CsvWS = Array<Array<string | null>>

export type Translations = Record<string, any>