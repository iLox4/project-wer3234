import { CsvWS, Langs, Translations, UnzippedFileMap } from '../types';
import { logErrorProcessingWBMessage, sendMessageWS } from '../utils';
import { preprocessRichText, setCsvHeaders } from './csv-utils';
import ExcelJS, { Worksheet } from 'exceljs';
import { stringify } from 'csv-stringify/sync';

export async function generateCsvs(wbs: UnzippedFileMap, langs: Langs, logUuid: string) {
    return {
        "Alert Message.csv": await generateCsvAlertMessage(wbs, langs, logUuid),
        "FoTranslation.csv": await generateCsvFoTranslation(wbs, langs, logUuid),
        "HRIS Element.csv": await generateCsvHrisElement(wbs, langs, logUuid),
        "HRIS Element-HRIS Fields.csv": await generateCsvHrisFields(wbs, langs, logUuid),
        "Localized HRIS Element.csv": await generateCsvLocalHrisElement(wbs, langs, logUuid),
        "Localized HRIS Element-Localized HRIS Fields.csv": await generateCsvLocalHrisFields(wbs, langs, logUuid),
        "Message Definition.csv": await generateCsvMessageDefinition(wbs, langs, logUuid),
        "Object Definition.csv": await generateCsvObjectDefinition(wbs, langs, logUuid),
        "Picklist-Values.csv": await generateCsvPicklistValues(wbs, langs, logUuid)
    };
}

export async function generateCsvAlertMessage(wbs: UnzippedFileMap, langs: Langs, logUuid: string) {
    sendMessageWS("Generating (1 of 9): Alert Message.csv", logUuid, true);
    const langsValueNames = ['alertHeaderLocalized', 'alertDescriptionLocalized'];
    const csv: CsvWS = [
        ["[OPERATOR]", "externalCode"],
        ["Supported operators: Delimit, Clear and Delete", "External Code"]
    ];

    setCsvHeaders(langs, langsValueNames, csv);

    const translations: Translations = {};

    // Load all workbooks in parallel
    await Promise.all(
        langs.map(async (lang) => {
            try {
                const wb = new ExcelJS.Workbook();
                await wb.xlsx.load(wbs[lang.code]);
                const ws = wb.getWorksheet('Alert Messages');

                if (!ws) throw new Error(`worksheet "Alert Messages" not found in workbook for language ${lang.code}`);
                
                ws.eachRow((row, ri) => {
                    if (ri < 5) return;
        
                    const externalCode = preprocessRichText(row.getCell("A").value) as string;
                    const alertHeaderLocalized = preprocessRichText(row.getCell("E").value);
                    const alertDescriptionLocalized = preprocessRichText(row.getCell("G").value);

                    if (!externalCode) {
                        sendMessageWS(`Missing data at row ${ri} in language ${lang.code} in worksheet ${ws.name}`, logUuid);
                        return;
                    }
        
                    if (!translations[externalCode]) translations[externalCode] = {};
                    translations[externalCode]["alertHeaderLocalized." + lang.code] = alertHeaderLocalized;
                    translations[externalCode]["alertDescriptionLocalized." + lang.code] = alertDescriptionLocalized;
                });
            } catch (error: any) {
                logErrorProcessingWBMessage(logUuid, error, lang.code);
            }
        })
    )

    // Build the CSV data rows
    for (const externalCode of Object.keys(translations)) {
        const row = [null, externalCode];

        for (const lang of langs) {
            row.push(translations[externalCode][`alertHeaderLocalized.${lang.code}`] || '');
        }
        for (const lang of langs) {
            row.push(translations[externalCode][`alertDescriptionLocalized.${lang.code}`] || '');
        }

        csv.push(row);
    }

    return Buffer.from(stringify(csv));
}

export async function generateCsvFoTranslation(wbs: UnzippedFileMap, langs: Langs, logUuid: string) {
    sendMessageWS("Generating (2 of 9): FoTranslation.csv", logUuid);
    const langsValueNames = ['value'];
    const csv: CsvWS = [
        ["[OPERATOR]", "externalCode"],
        ["Supported operators: Delimit, Clear and Delete", "externalCode"]
    ];

    setCsvHeaders(langs, langsValueNames, csv);

    const translations: Translations = {};

    // Helper function to process a worksheet
    const processWorksheet = (ws: Worksheet, langCode: string) => {
        ws.eachRow((row, ri) => {
            if (ri < 5) return;

            const externalCode = preprocessRichText(row.getCell("A").value) as string;
            const value = preprocessRichText(row.getCell("C").value) as string;

            if (!externalCode) {
                sendMessageWS(`Missing data at row ${ri} in language ${langCode} in worksheet ${ws.name}`, logUuid);
                return;
            }

            if (!translations[externalCode]) translations[externalCode] = {};
            translations[externalCode][`value.${langCode}`] = value;

            const externalCodeDesc = preprocessRichText(row.getCell("D").value) as string;
            const valueDesc = preprocessRichText(row.getCell("F").value);

            if (externalCodeDesc) {
                if (!translations[externalCodeDesc]) translations[externalCodeDesc] = {};
                translations[externalCodeDesc][`value.${langCode}`] = valueDesc;
            }
        });
    };

    // Load and process all workbooks concurrently
    await Promise.all(langs.map(async (lang) => {
        try {
            let isWs = false;
            const wb = new ExcelJS.Workbook();
            await wb.xlsx.load(wbs[lang.code]);

            const worksheets = [
                wb.getWorksheet("Event Reasons"),
                wb.getWorksheet("Frequency"),
                wb.getWorksheet("Pay Component Groups"),
                wb.getWorksheet("Pay Components"),
            ];

            worksheets.forEach(worksheet => {
                if (worksheet) {
                    processWorksheet(worksheet, lang.code);
                    isWs = true;
                }
            });

            if (!isWs) throw new Error(`no worksheets was found in workbook for language ${lang.code}`);
        } catch (error: any) {
            logErrorProcessingWBMessage(logUuid, error, lang.code);
        }
    }));

    // Build the CSV content
    for (const externalCode of Object.keys(translations)) {
        const row = [null, externalCode];
        for (const lang of langs) {
            row.push(translations[externalCode][`value.${lang.code}`] || '');
        }
        csv.push(row);
    }

    return Buffer.from(stringify(csv));
}

export async function generateCsvHrisElement(wbs: UnzippedFileMap, langs: Langs, logUuid: string) {
    sendMessageWS("Generating (3 of 9): HRIS Element.csv", logUuid);
    const langsValueNames = ['externalName'];
    const csv: CsvWS = [
        ["[OPERATOR]", "externalCode"],
        ["Supported operators: Delimit, Clear and Delete", "Identifier"]
    ];

    setCsvHeaders(langs, langsValueNames, csv);

    const translations: Translations = {};

    // Process each language workbook
    await Promise.all(
        langs.map(async lang => {
            try {
                const wb = new ExcelJS.Workbook();
                await wb.xlsx.load(wbs[lang.code]);

                const ws = wb.getWorksheet("Global Template Fields");
        
                if (!ws) throw new Error(`worksheet "Global Template Fields" not found in workbook for language ${lang.code}`);

                // Read each row starting from row 5
                ws.eachRow((row, ri) => {
                    if (ri < 5) return;

                    const externalCode = preprocessRichText(row.getCell("C").value) as string;
                    const externalName = preprocessRichText(row.getCell("B").value);

                    if (!externalCode) {
                        sendMessageWS(`Missing data at row ${ri} in language ${lang.code} in worksheet ${ws.name}`, logUuid);
                        return;
                    }

                    if (!translations[externalCode]) {
                        translations[externalCode] = {};
                    }
                    translations[externalCode][`externalName.${lang.code}`] = externalName;
                });
            } catch (error: any) {
                logErrorProcessingWBMessage(logUuid, error, lang.code);
            }
        })
    );

    // Build CSV rows
    for (const externalCode of Object.keys(translations)) {
        const row = [null, externalCode];

        for (const lang of langs) {
            const externalName = translations[externalCode][`externalName.${lang.code}`] || '';
            row.push(externalName);
        }

        csv.push(row);
    }

    return Buffer.from(stringify(csv));
}

export async function generateCsvHrisFields(wbs: UnzippedFileMap, langs: Array<Record<string, string>>, logUuid: string) {
    sendMessageWS("Generating (4 of 9): HRIS Element-HRIS Fields.csv", logUuid);

    const csv: CsvWS = [
        ["[OPERATOR]", "externalCode", "ecField.externalCode"],
        ["Supported operators: Delimit, Clear and Delete", "HRIS Element.Identifier", "Identifier"]
    ];

    // Add language columns to the CSV header
    setCsvHeaders(langs, ['ecField.externalName'], csv);

    const translations: Translations = {};

    // Load all workbooks in parallel
    await Promise.all(langs.map(async lang => {
        try {
            const wb = new ExcelJS.Workbook();
            await wb.xlsx.load(wbs[lang.code]);
            const ws = wb.getWorksheet("Global Template Fields");

            if (!ws) throw new Error(`worksheet "Global Template Fields" not found in workbook for language ${lang.code}`);

            ws.eachRow((row, ri) => {
                if (ri < 5) return;

                const externalCode = preprocessRichText(row.getCell("C").value) as string;
                const ecFieldExternalCode = preprocessRichText(row.getCell("D").value) as string;
                const ecFieldExternalName = preprocessRichText(row.getCell("G").value);

                if (!externalCode || !ecFieldExternalCode) {
                    sendMessageWS(`Missing data at row ${ri} in language ${lang.code} in worksheet ${ws.name}`, logUuid);
                    return;
                }

                if (!translations[externalCode]) translations[externalCode] = {};
                if (!translations[externalCode][ecFieldExternalCode]) translations[externalCode][ecFieldExternalCode] = {};
                translations[externalCode][ecFieldExternalCode][`ecField.externalName.${lang.code}`] = ecFieldExternalName;
            });
        } catch (error: any) {
            logErrorProcessingWBMessage(logUuid, error, lang.code);
        }
    }));

    // Build the CSV rows
    Object.entries(translations).forEach(([externalCode, ecFields]) => {
        Object.entries(ecFields).forEach(([ecFieldExternalCode, names]) => {
            const row = [null, externalCode, ecFieldExternalCode];

            langs.forEach(lang => {
                row.push((names as any)[`ecField.externalName.${lang.code}`] || '');
            });

            csv.push(row);
        });
    });

    return Buffer.from(stringify(csv));
}

export async function generateCsvLocalHrisElement(wbs: UnzippedFileMap, langs: Array<Record<string, string>>, logUuid: string) {
    sendMessageWS("Generating (5 of 9): Localized HRIS Element.csv", logUuid);

    const csv: CsvWS = [
        ["[OPERATOR]", "externalCode"],
        ["Supported operators: Delimit, Clear and Delete", "Identifier"]
    ];

    const translations: Translations = {};

    // Add headers for each language
    setCsvHeaders(langs, ['externalName'], csv);

    // Load all workbooks in parallel
    await Promise.all(
        langs.map(async lang => {
            try {
                const wb = new ExcelJS.Workbook();
                await wb.xlsx.load(wbs[lang.code]);
                const ws = wb.getWorksheet('Local Fields');

                if (!ws) throw new Error(`worksheet "Local Fields" not found in workbook for language ${lang.code}`);

                ws.eachRow((row, ri) => {
                    if (ri < 5) return;

                    const externalCode = preprocessRichText(row.getCell("D").value) as string;
                    const externalName = preprocessRichText(row.getCell("C").value || '');

                    if (!externalCode) {
                        sendMessageWS(`Missing data at row ${ri} in language ${lang.code} in worksheet ${ws.name}`, logUuid);
                        return;
                    }

                    if (!translations[externalCode]) translations[externalCode] = {};
                    translations[externalCode][`externalName.${lang.code}`] = externalName;
                });
            } catch (error: any) {
                logErrorProcessingWBMessage(logUuid, error, lang.code);
            }
        })
    );
    

    // Build CSV rows
    Object.keys(translations).forEach(externalCode => {
        const row = [null, externalCode];

        langs.forEach(lang => {
            row.push(translations[externalCode][`externalName.${lang.code}`] || '');
        });

        csv.push(row);
    });

    return Buffer.from(stringify(csv));
}

export async function generateCsvLocalHrisFields(wbs: UnzippedFileMap, langs: Array<Record<string, string>>, logUuid: string) {
    sendMessageWS("Generating (6 of 9): Localized HRIS Element-Localized HRIS Fields.csv", logUuid);

    const csv: CsvWS = [
        ["[OPERATOR]", "externalCode", "ecField.externalCode"],
        ["Supported operators: Delimit, Clear and Delete", "HRIS Element.Identifier", "Identifier"]
    ];
    const translations: Translations = {};

    setCsvHeaders(langs, ['ecField.externalName'], csv);

    // Parallel processing of workbook files
    await Promise.all(langs.map(async (lang) => {
        try {
            const wb = new ExcelJS.Workbook();
            await wb.xlsx.load(wbs[lang.code]);
            const ws = wb.getWorksheet("Local Fields");

            if (!ws) throw new Error(`worksheet "Local Fields" not found in workbook for language ${lang.code}`);

            ws.eachRow((row, ri) => {
                if (ri < 5) return;

                const externalCode = preprocessRichText(row.getCell("D").value) as string;
                const ecFieldExternalCode = preprocessRichText(row.getCell("E").value) as string;
                const ecFieldExternalName = preprocessRichText(row.getCell("H").value);

                if (!externalCode || !ecFieldExternalCode) {
                    sendMessageWS(`Missing data at row ${ri} in language ${lang.code} in worksheet ${ws.name}`, logUuid);
                    return;
                }

                if (!translations[externalCode]) translations[externalCode] = {};
                if (!translations[externalCode][ecFieldExternalCode]) translations[externalCode][ecFieldExternalCode] = {};
                translations[externalCode][ecFieldExternalCode]["ecField.externalName." + lang.code] = ecFieldExternalName;
            });
        } catch (error: any) {
            logErrorProcessingWBMessage(logUuid, error, lang.code);
        }
    }));

    // Create the final CSV rows based on translations
    Object.keys(translations).forEach(externalCode => {
        Object.keys(translations[externalCode]).forEach(ecFieldExternalCode => {
            const row = [null, externalCode, ecFieldExternalCode];

            for (const lang of langs) {
                row.push(translations[externalCode][ecFieldExternalCode]["ecField.externalName." + lang.code]);
            }

            csv.push(row);
        });
    });

    return Buffer.from(stringify(csv));
};

export async function generateCsvMessageDefinition(wbs: UnzippedFileMap, langs: Array<Record<string, string>>, logUuid: string) {
    sendMessageWS("Generating (7 of 9): Message Definition.csv", logUuid);

    const csv: CsvWS = [
        ["[OPERATOR]", "externalCode"],
        ["Supported operators: Delimit, Clear and Delete", "External Code"],
    ];

    // Append language headers
    setCsvHeaders(langs, ['text'], csv);

    const translations: Translations = {};

    // Load all workbooks in parallel
    await Promise.all(
        langs.map(async (lang) => {
            try {
                const wb = new ExcelJS.Workbook();
                await wb.xlsx.load(wbs[lang.code]);
                const ws = wb.getWorksheet('Warning&Error Messages');

                if (!ws) throw new Error(`worksheet "Warning&Error Messages" not found in workbook for language ${lang.code}`);

                ws.eachRow((row, ri) => {
                    if (ri < 5) return;

                    const externalCode = preprocessRichText(row.getCell("A").value) as string;
                    const text = preprocessRichText(row.getCell("D").value);

                    if (!externalCode) {
                        sendMessageWS(`Missing data at row ${ri} in language ${lang.code} in worksheet ${ws.name}`, logUuid);
                        return;
                    }

                    if (!translations[externalCode]) {
                        translations[externalCode] = { externalCode };
                    }
                    translations[externalCode][`text.${lang.code}`] = text;
                });
            } catch (error: any) {
                logErrorProcessingWBMessage(logUuid, error, lang.code);logErrorProcessingWBMessage(logUuid, error, lang.code);
            }
        })
    );

    // Build CSV rows
    Object.keys(translations).forEach(externalCode => {
        const row = [null, externalCode];

        for (const lang of langs) {
            row.push(translations[externalCode]["text." + lang.code]);
        }

        csv.push(row);
    });

    return Buffer.from(stringify(csv));
};

export async function generateCsvObjectDefinition(wbs: UnzippedFileMap, langs: Array<Record<string, string>>, logUuid: string) {
    sendMessageWS("Generating (8 of 9): Object Definition.csv", logUuid);

    const csv: CsvWS = [
        ["[OPERATOR]", "id"],
        ["Supported operators: Delimit, Clear and Delete", "Code"]
    ];

    const translations: Translations = {};

    setCsvHeaders(langs, ['label'], csv);
    csv[0].push("fields.name");
    csv[1].push("Name");
    setCsvHeaders(langs, ['fields.label'], csv);

    await Promise.all(
        langs.map( async lang => {
            try {
                const wb = new ExcelJS.Workbook();
                await wb.xlsx.load(wbs[lang.code]);
                const ws = wb.getWorksheet("Objects") ? wb.getWorksheet("Objects") : wb.getWorksheet("Position Object");
        
                if (!ws) throw new Error(`worksheet not found in workbook for language ${lang.code}`);

                ws.eachRow((row, ri) => {
                    if (ri < 5) return;
        
                    const id = preprocessRichText(row.getCell("A").value) as string;
                    const fieldName = preprocessRichText(row.getCell("B").value) as string;
                    const label = preprocessRichText(row.getCell("D").value);
                    const fieldsLabel = preprocessRichText(row.getCell("G").value);

                    if (!id || !fieldName) {
                        sendMessageWS(`Missing data at row ${ri} in language ${lang.code} in worksheet ${ws.name}`, logUuid);
                        return;
                    }
        
                    if (!translations[id]) translations[id] = {};
                    if (!translations[id][fieldName]) translations[id][fieldName] = {};
                    translations[id][fieldName]["label." + lang.code] = label;
                    translations[id][fieldName]["fields.label." + lang.code] = fieldsLabel;
                });
            } catch (error: any) {
                logErrorProcessingWBMessage(logUuid, error, lang.code);logErrorProcessingWBMessage(logUuid, error, lang.code);
            }
        })
    );

    Object.keys(translations).forEach(id => {
        Object.keys(translations[id]).forEach(fieldName => {
            const row = [null, id];

            for (const lang of langs) {
                row.push(translations[id][fieldName]["label." + lang.code]);
            }

            row.push(fieldName);

            for (const lang of langs) {
                row.push(translations[id][fieldName]["fields.label." + lang.code]);
            }

            csv.push(row);
        });
    });

    return Buffer.from(stringify(csv));
}

export async function generateCsvPicklistValues(wbs: UnzippedFileMap, langs: Array<Record<string, string>>, logUuid: string) {
    sendMessageWS("Generating (9 of 9): Picklist-Values.csv", logUuid);

    const csv: CsvWS = [
        ["[OPERATOR]", "id", "effectiveStartDate", "values.externalCode"],
        ["Supported operators: Delimit, Clear and Delete", "Picklist.Code", "Picklist.Effective Start Date", "External Code"]
    ];
    const translations: Translations = {};

    setCsvHeaders(langs, ['values.label'], csv);

    await Promise.all(
        langs.map(async lang => {
            try {
                const wb = new ExcelJS.Workbook();
                await wb.xlsx.load(wbs[lang.code]);
                const ws = wb.getWorksheet("Picklist values");

                if (!ws) throw new Error(`worksheet "Picklist values" not found in workbook for language ${lang.code}`);

                ws.eachRow((row, ri) => {
                    if (ri < 5) return;

                    const id = preprocessRichText(row.getCell("C").value) as string;
                    const externalCode = preprocessRichText(row.getCell("E").value) as string;
                    const label = preprocessRichText(row.getCell("H").value);

                    if (!id || !externalCode) {
                        sendMessageWS(`Missing data at row ${ri} in language ${lang.code} in worksheet ${ws.name}`, logUuid);
                        return;
                    }

                    if (!translations[id]) translations[id] = {};
                    if (!translations[id][externalCode]) translations[id][externalCode] = {};
                    translations[id][externalCode]["values.label." + lang.code] = label;
                });
            } catch (error: any) {
                logErrorProcessingWBMessage(logUuid, error, lang.code);
            }
        })
    )
    
    Object.keys(translations).forEach(id => {
        Object.keys(translations[id]).forEach(externalCode => {
            const row = [null, id, "01/01/1900", externalCode];

            for (const lang of langs) {
                row.push(translations[id][externalCode]["values.label." + lang.code]);
            }

            csv.push(row);
        });
    });

    return Buffer.from(stringify(csv));
}