import { Langs, UnzippedFileMap } from "../../../../src/types";
import ExcelJS from 'exceljs';

export default async function generateTestWb(langs: Langs, wsToAdd: string[], mandatoryCells: string[], valueCells: string[]) {
    const wbs: UnzippedFileMap = {};
    const addedValues: string[] = [];

    // Create workbooks with data for each language
    for (const lang of langs) {
        const workbook = new ExcelJS.Workbook();
        wsToAdd.forEach(wsName => {
            const worksheet = workbook.addWorksheet(wsName);

            mandatoryCells.forEach((cell, idx) => {
                worksheet.getCell(cell).value = `CODE_${idx}_${lang.code}`;
                addedValues.push(`CODE_${idx}_${lang.code}`);
            });

            valueCells.forEach((cell, idx) => {
                worksheet.getCell(cell).value = `VALUE_${idx}_${lang.code}`;
                addedValues.push(`VALUE_${idx}_${lang.code}`);
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        wbs[lang.code] = buffer as Buffer;
    }
  
    return { wbs, addedValues };
}