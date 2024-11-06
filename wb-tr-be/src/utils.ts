import path from 'path';
import unzipper from 'unzipper';
import { io } from '../app';
import { csvList, csvForMatching } from './constants';
import { formatLanCode } from './generate-csvs-utils/csv-utils';
import { Langs, UnzippedFileMap } from './types';

/** EXTRACT WORKBOOKS FUNCTION */
export async function extractWorkbooks(zipBuffer: Buffer, langs: Langs) {
    const files: UnzippedFileMap = {};

    try {
        const directory = await unzipper.Open.buffer(zipBuffer);

        for (const entry of directory.files) {
            const { path: entryPath, type } = entry;

            if (type === 'File') {
                const fileName = path.basename(entryPath);
                const match = fileName.trim().toLowerCase().match(/translation_workbook_([a-z]{2}_[a-z]{2})\.xlsx$/i);

                if (match) {
                    const locale = formatLanCode(match[1]);
                    const content = await entry.buffer();
                    files[locale] = content;

                    langs.push({code: locale})
                }
            }
        }

        if (langs.length > 0) {
            return files;
        } else {
            throw new Error('No valid workbooks found in the archive');
        }
    } catch (error: any) {
        throw error;
    }
}

/** EXTRACT CSVs FUNCTION */
export async function extractCSVs(zipBuffer: Buffer) {
    const files: UnzippedFileMap = {};
    const processedCsv: Record<string, boolean> = {};

    try {
        const directory = await unzipper.Open.buffer(zipBuffer);

        for (const entry of directory.files) {
            const { path: entryPath, type } = entry;

            if (type === 'File') {
                const fileName = path.basename(entryPath);
                const mathcingIdx = csvForMatching.indexOf(fileName.replace(/ /g, '').toLowerCase());

                if (mathcingIdx !== -1 && !processedCsv[fileName]) {
                    const content = await entry.buffer();
                    files[csvList[mathcingIdx]] = content;
                    processedCsv[fileName] = true;
                }
            }
        }

        if (Object.keys(processedCsv).length === csvList.length) {
            return files;
        } else {
            throw new Error('Some csvs are missing in the file');
        }
    } catch (error: any) {
        throw error;
    }
}

/** MESSAGING WS:START */
export function sendMessageWS(message: string, sessionId: string, isStart: boolean = false, isError: boolean = false) {
    io.to(sessionId).emit('infoMessage', { message, isStart, isError });
    console.log(`INFO: sent message to session: ${sessionId}`);
}

export function sendGeneratedFiles(zipBuffer: Buffer, sessionId: string) {
    io.to(sessionId).emit('fileGenerated', zipBuffer);
    console.log(`INFO: file sent to session: ${sessionId}`);
}

export function logErrorProcessingWBMessage(sessionId: string, error: any, lang: string) {
    console.error(`ERROR: processing WorkBook of session ${sessionId} for lang ${lang} failed`, error);
    sendMessageWS(`processing WorkBook for lang ${lang} failed`, sessionId);
}
/** MESSAGING WS:END */