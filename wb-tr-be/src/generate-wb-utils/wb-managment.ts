import { FileProps } from '../types';
import ExcelJS, { Workbook } from 'exceljs';
import color from 'color';
import { applyStylesToCell } from './cell-managment';
import JSZip from 'jszip';
import { sendMessageWS } from '../utils';
import { deduplicatePicklistValues, initCoverSheet, initInstructionsSheet } from './wb-managment-utils';

export function createWorkbook(fileProps: FileProps) {
    const workbook = new ExcelJS.Workbook();

    workbook.creator = "PwC";
    workbook.lastModifiedBy = "PwC";
    workbook.created = new Date();
    workbook.modified = new Date();

    const sheetProps = {
        properties: {
            tabColor: {
                argb: color(fileProps.colors.primary).hex().replace("#", "").toUpperCase()
            }
        }
    }

    const coverSheet = workbook.addWorksheet("Cover Sheet", sheetProps);
    const instructionSheet = workbook.addWorksheet("Instructions", sheetProps);

    initCoverSheet(workbook, coverSheet, fileProps);
    initInstructionsSheet(instructionSheet, fileProps);

    return workbook;
}

export function updateWorkbook(wb: Workbook, conf: Record<string, any>, lang: string, data: Record<string, any>[], sfMappings: Record<string, any>, styles: Record<string, any>) {
    const ws = wb.addWorksheet(conf.sheet_name);
    let lastHeaderRow = 0;

    if (conf.table_header) {
        ws.getCell("A1").value = conf.table_header;
        ws.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
        applyStylesToCell(ws.getCell("A1"), styles, conf.table_header_styles);
        ws.mergeCells("A1:" + ws.getColumn(conf.columns.length).letter + "1");
        lastHeaderRow = 2
    }

    conf.columns.forEach((col: Record<string, any>, i: number) => {
        const columnHeaderCell = ws.getCell(ws.getColumn(i + 1).letter + (lastHeaderRow + 1));
        const columnSubheaderCell = ws.getCell(ws.getColumn(i + 1).letter + (lastHeaderRow + 2)); 
        
        columnHeaderCell.value = col.column_header
        columnSubheaderCell.value = col.column_subheader

        applyStylesToCell(columnHeaderCell, styles, col.column_header_styles);
        applyStylesToCell(columnSubheaderCell, styles, col.column_subheader_styles);

        if (col.data_source_column) {
            data.forEach((row, ri) => {
                let value;
                if (col.data_source_column_alt) {
                    if (row[col.data_source_column]) {
                        value = row[col.data_source_column];
                    } else {
                        value = row[col.data_source_column_alt];
                    }
                } else {
                    value = row[col.data_source_column];
                }

                const rowIndex = lastHeaderRow + 3 + ri;

                if (col.data_source_mapping) {
                    for (const { source, target } of col.data_source_mapping) {
                        if (value == source) {
                            value = target;
                        }
                    }
                } else if (col.sf_mapping) {
                    for (const { group, key } of col.sf_mapping) {
                        if (sfMappings[group] && sfMappings[group][value] && sfMappings[group][value][key]) {
                            value = sfMappings[group][value][key];
                        }
                    }
                }
                ws.getCell(ws.getColumn(i + 1).letter + rowIndex).value = value
                applyStylesToCell(ws.getCell(ws.getColumn(i + 1).letter + rowIndex), styles, ["inactive"]);
            });
        } else if (col.translation_source_column) {
            if (col.sf_mapping) {
                data.forEach((row, ri) => {
                    const value = row[col.translation_source_column];

                    const rowIndex = lastHeaderRow + 3 + ri;

                    for (const { group, key } of col.sf_mapping) {
                        if (sfMappings[group] && sfMappings[group][value] && sfMappings[group][value][key + "." + lang]) {
                            ws.getCell(ws.getColumn(i + 1).letter + rowIndex).value = sfMappings[group][value][key + "." + lang];
                            applyStylesToCell(ws.getCell(ws.getColumn(i + 1).letter + rowIndex), styles, []);
                        }
                    }
                });
            } else {
                const transCol = col.translation_source_column + "." + lang;

                data.forEach((row, ri) => {
                    const value = row[transCol] ?? "";
                    const rowIndex = lastHeaderRow + 3 + ri;

                    ws.getCell(ws.getColumn(i + 1).letter + rowIndex).value = value
                    applyStylesToCell(ws.getCell(ws.getColumn(i + 1).letter + rowIndex), styles, []);
                });
            }
        }

        if (col.column_hidden) {
            ws.getColumn(i + 1).hidden = true;
        }
    });

    lastHeaderRow += 2;

    if (conf.sheet_name === "Picklist values") {
        wb = deduplicatePicklistValues(wb, conf, styles);
    }

    return wb;
}

export async function generateWorkbooks(workbooks: Record<string, any>, clientName: string, logUuid: string) {
    sendMessageWS("Saving workbooks", logUuid);

    const xlsxs = await Object.keys(workbooks).reduce<Promise<Record<string, Buffer>>>(async (wbsP, lang) => {
        const wbs = await wbsP;
        wbs[lang] = await workbooks[lang].xlsx.writeBuffer();
        return wbs;
    }, Promise.resolve({}));

    clientName = clientName ? clientName + "_" : "";

    const zip = Object.keys(xlsxs).reduce((zip, lang) => {
        zip.file(clientName + "Translation_Workbook_" + lang + ".xlsx", xlsxs[lang]);
        return zip;
    }, new JSZip());

    return await zip.generateAsync({
        type: "nodebuffer",
        compression: "DEFLATE"
    });
}

export function addSheetToWorkbook(wb: Workbook, conf: Record<string, any>, styles: Record<string, any>) {
    const ws = wb.addWorksheet(conf.sheet_name);
    let lastHeaderRow = 0;

    if (conf.table_header) {
        ws.getCell("A1").value = conf.table_header;
        ws.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
        applyStylesToCell(ws.getCell("A1"), styles, conf.table_header_styles);
        ws.mergeCells("A1:" + ws.getColumn(conf.columns.length).letter + "1");
        lastHeaderRow = 2
    }

    conf.columns.forEach((col: Record<string, any>, i: number) => {
        ws.getCell(ws.getColumn(i + 1).letter + (lastHeaderRow + 1)).value = col.column_header
        ws.getCell(ws.getColumn(i + 1).letter + (lastHeaderRow + 2)).value = col.column_subheader

        applyStylesToCell(ws.getCell(ws.getColumn(i + 1).letter + (lastHeaderRow + 1)), styles, col.column_header_styles);
        applyStylesToCell(ws.getCell(ws.getColumn(i + 1).letter + (lastHeaderRow + 2)), styles, col.column_subheader_styles);

        if (col.column_hidden) {
            ws.getColumn(i + 1).hidden = true;
        }
    });

    lastHeaderRow += 2

    return wb
}