import { FileProps, Langs, UnzippedFileMap, WorkbookMap } from './types';
import { sendGeneratedFiles, sendMessageWS } from './utils';
import { createWorkbook, updateWorkbook, generateWorkbooks, addSheetToWorkbook } from './generate-wb-utils/wb-managment';
import { csvGetEventReasons, loadConfig, loadSourceData, preprocessFiles } from './generate-wb-utils/wb-utils';
import { setColumnWidths } from './generate-wb-utils/cell-managment';
import { generateImports } from './generate-csvs-utils/csv-utils';
import { generateCsvs } from './generate-csvs-utils/csv-managment';

export async function generateCsvsHandler(wbs: UnzippedFileMap, sessionId: string, langs: Langs) {
    try {
        const csvs = await generateCsvs(wbs, langs, sessionId);
        const zip = await generateImports(csvs, sessionId);
        sendGeneratedFiles(zip, sessionId);
    } catch (error: any) {
        console.error(`ERROR: generating files for session: ${sessionId}`, error);
        sendMessageWS('generate csvs failed', sessionId, false, true);
    }
}

export async function generateWbsHandler(csvs: UnzippedFileMap, sessionId: string, fileProps: FileProps) {
    try {
        const config = loadConfig(fileProps);

        await preprocessFiles(csvs);
        
        sendMessageWS('Initializing workbooks', sessionId, true);

        const workbooks = fileProps.otherProps.languageCodes.reduce<WorkbookMap>((workbooks, langCode) => {
            workbooks[langCode] = createWorkbook(fileProps);
            return workbooks
        }, {});

        const sfMappings = {
            pay_component: {},
            pay_component_group: {},
            event_reasons: await csvGetEventReasons(csvs)
        };

        let i = 1;
        for (const conf of config.config) {
            if (conf.source) {
                sendMessageWS("Processing (" + i++ + " of " + config.config.length + "): " + conf.source.files.map((spec: any) => spec.source_file).join(", ") + " -> " + conf.target.sheet_name, sessionId);
                const importData = await loadSourceData(conf.source, csvs);
                for (const langCode of fileProps.otherProps.languageCodes) {
                    workbooks[langCode] = updateWorkbook(workbooks[langCode], conf.target, langCode, importData, sfMappings, config.styles);
                }
            } else {
                sendMessageWS("Processing (" + i++ + " of " + config.config.length + "): " + conf.target.sheet_name, sessionId)
                for (const langCode of fileProps.otherProps.languageCodes) {
                    workbooks[langCode] = addSheetToWorkbook(workbooks[langCode], conf.target, config.styles);
                }
            }
        }

        for (const langCode of fileProps.otherProps.languageCodes) {
            workbooks[langCode] = setColumnWidths(workbooks[langCode]);
        }

        const zip = await generateWorkbooks(workbooks, fileProps.clientName, sessionId);
        sendGeneratedFiles(zip, sessionId);
    } catch (error: any) {
        console.error(`ERROR: generating files for session: ${sessionId}`, error);
        sendMessageWS('generate wbs failed', sessionId, false, true);
    }
}