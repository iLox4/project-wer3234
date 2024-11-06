import { CsvWS } from '../types';
import { CellRichTextValue, CellValue } from 'exceljs';
import { sendMessageWS } from '../utils';
import JSZip from 'jszip';
import { importPropsContent, importSeqContent } from '../constants';

/** FORMAT LANGUAGE CODE FUNCTION */
export function formatLanCode(lanCode: string) {
    const parts = lanCode.split('_');
    return parts[0] + (parts.length > 1 ? ('_' + parts[1].toUpperCase()) : '');
}

/** SET CSV HEADERS FUNCTION */
export function setCsvHeaders(langs: Array<Record<string, string>>, langsValueNames: string[], csv: CsvWS) {
    langsValueNames.forEach(langsValName => {
        for (const lang of langs) {
            csv[0].push(`${langsValName}.${lang.code}`);
            csv[1].push(lang.code);
        }
    });
}

/** PREPROCESS RICH TEXT FUNCTIONS:START */
export function preprocessRichText(value: CellValue) {
    if (isRichValue(value)) {
        return _richToString(value);
    }
    return value;
}

function isRichValue(value: CellValue): value is CellRichTextValue {
    return Boolean(value && Array.isArray((value as CellRichTextValue).richText));
}

function _richToString(rich: CellRichTextValue) {
    return rich.richText.map(({ text }) => text).join('');
}
/** PREPROCESS RICH TEXT FUNCTIONS:END */

/** GENERATE IMPORTS FUNCTIONS:START */
export async function generateImports (csvs: Record<string, Buffer>, logUuid: string) {
    sendMessageWS("Saving CSVs for import", logUuid);

    const zip = _addPropFilesToZip(Object.keys(csvs).reduce((zip, file) => {
        zip.file(file, csvs[file]);
        return zip;
    }, new JSZip()));

    return await zip.generateAsync({
        type: "nodebuffer",
        compression: "DEFLATE"
    });
}

function _addPropFilesToZip(zip: JSZip) {
    zip.file("import.properties", importPropsContent);
    zip.file("import_sequence.csv", importSeqContent);

    return zip;
}
/** GENERATE IMPORTS FUNCTIONS:END */