import { CellValue, ImagePosition, Workbook, Worksheet } from "exceljs";
import { applyStylesToCell } from "./cell-managment";
import { FileProps } from "../types";
import { createWbPrimaryFillCols, createWbWhiteFillCols, initInstructSheetInstructions, initInstructSheetRules } from "../constants";
import color from "color";
import resources from "../resources";

/** UPDATE WB FUNCTIONS:START */
export function deduplicatePicklistValues(wb: Workbook, conf: Record<string, any>, styles: Record<string, any>) {
    const ows = wb.getWorksheet("Picklist values");
    const optsByUniqId: Record<string, any> = {};

    
    if (ows) {
        ows.eachRow({ includeEmpty: false }, (row, ri) => {
            if (ri < 5) return;

            const optId = row.getCell("D").value as string;
            if (!optId) return;

            const cells = row.values as CellValue[];
            const rowObj = {
                "Portlet External Code": cells[1],
                "Field": cells[2],
                "Picklist Code": cells[3],
                "Option ID": cells[4],
                "values.externalCode": cells[5],
                "Custom translation needed?": cells[6],
                "values.label.en_US": cells[7],
                "Translation - Picklist value": cells[8],
                "Comment": cells[9]
            };
            
            if (optsByUniqId[optId]) {
                optsByUniqId[optId]["Portlet External Code"].push(rowObj["Portlet External Code"]);
                optsByUniqId[optId]["Field"].push(rowObj["Field"]);
            } else {
                optsByUniqId[optId] = rowObj;
                optsByUniqId[optId]["Portlet External Code"] = [optsByUniqId[optId]["Portlet External Code"]];
                optsByUniqId[optId]["Field"] = [optsByUniqId[optId]["Field"]];
            }
        });
    
        wb.removeWorksheet(ows.id);
    }
    

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

    const rows = Object.keys(optsByUniqId).reduce<Array<string | string[]>>((rows, optId) => {
        const opt = optsByUniqId[optId];

        opt["Portlet External Code"] = opt["Portlet External Code"].map((extCode: string) => {
            return (extCode ? extCode.replace(/_[A-Z]{3}/, "_XXX") : extCode)
        });
        opt["Portlet External Code"] = [...new Set(opt["Portlet External Code"])].sort().join(", ");
        opt["Field"] = [...new Set(opt["Field"])].sort().join(", ");

        rows.push([
            opt["Portlet External Code"], opt["Field"], opt["Picklist Code"],
            opt["Option ID"], opt["values.externalCode"], opt["Custom translation needed?"],
            opt["values.label.en_US"], opt["Translation - Picklist value"], opt["Comment"]
        ]);

        return rows;
    }, []);

    ws.addRows(rows);

    return wb;
}
/** UPDATE WB FUNCTIONS:END */

/** CREATE WB FUNCTIONS:START */
export function initCoverSheet(workbook: Workbook, coverSheet: Worksheet, fileProps: FileProps) {
    coverSheet.properties.defaultRowHeight = 14.25;
    createWbWhiteFillCols.forEach(col => {
        for (let row = 1; row < 218; row++) {
            coverSheet.getCell(`${col}${row}`).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFFF" }
            };
        }
    });
    createWbPrimaryFillCols.forEach(col => {
        for (let row = 5; row < 23; row++) {
            coverSheet.getCell(`${col}${row}`).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: color(fileProps.colors.primary).hex().replace("#", "").toUpperCase() }
            };
        }
    });

    const sapSFImage = workbook.addImage({
        base64: resources.sapsfImg,
        extension: "png"
    });
    const sapImage = workbook.addImage({
        base64: resources.sapImg,
        extension: "jpeg"
    });
    const pwcImage = workbook.addImage({
        base64: resources.pwcImg,
        extension: "png"
    });

    // must retype here because of ts error
    coverSheet.addImage(sapSFImage, {
        tl: { col: 0.02 , row: 1.2 },
        br: { col: 4.45, row: 2.88 }
    } as unknown as ImagePosition);
    coverSheet.addImage(sapImage, {
        tl: { col: 12.37 , row: 0.9 },
        br: { col: 13.93, row: 3.36 }
    } as unknown as ImagePosition);
    coverSheet.addImage(pwcImage, {
        tl: { col: 11.9 , row: 23.2 },
        br: { col: 14, row: 29.2 }
    } as unknown as ImagePosition);

    coverSheet.mergeCells("B6:N22");
    coverSheet.getCell("B6").alignment = {
        vertical: "top",
        horizontal: "left",
        wrapText: true
    };
    coverSheet.getCell("B6").font = {
        name: "Arial",
        family: 2,
        size: 28,
        color: { argb: color(fileProps.colors.primaryText).hex().replace("#", "").toUpperCase() },
        bold: true
    };
    coverSheet.getCell("B6").value = "Employee Central \n\nTranslation Workbook";
}

export function initInstructionsSheet(instrSheet: Worksheet, fileProps: FileProps) {
    const rules = initInstructSheetRules;
    const instructions = initInstructSheetInstructions;

    instrSheet.getColumn("B").width = 34.57;
    instrSheet.getColumn("C").width = 71;

    instrSheet.mergeCells("B2:C2");
    instrSheet.getCell("B2").alignment = {
        vertical: "middle",
        horizontal: "left",
        wrapText: true
    };
    instrSheet.getCell("B2").font = {
        name: "Arial",
        family: 2,
        size: 10,
        color: { argb: color(fileProps.colors.primaryText).hex().replace("#", "").toUpperCase() },
        bold: true
    };
    instrSheet.getCell("B2").border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" }
    };
    instrSheet.getCell("B2").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: color(fileProps.colors.primary).hex().replace("#", "").toUpperCase() }
    };
    instrSheet.getCell("B2").value = "Rules";

    instrSheet.mergeCells(`B${2 + rules.length + 2}:C${2 + rules.length + 2}`);
    instrSheet.getCell(`B${2 + rules.length + 2}`).alignment = {
        vertical: "middle",
        horizontal: "left",
        wrapText: true
    };
    instrSheet.getCell(`B${2 + rules.length + 2}`).font = {
        name: "Arial",
        family: 2,
        size: 10,
        color: { argb: color(fileProps.colors.primaryText).hex().replace("#", "").toUpperCase() },
        bold: true
    };
    instrSheet.getCell(`B${2 + rules.length + 2}`).border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" }
    };
    instrSheet.getCell(`B${2 + rules.length + 2}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: color(fileProps.colors.primary).hex().replace("#", "").toUpperCase() }
    };
    instrSheet.getCell(`B${2 + rules.length + 2}`).value = "Instructions";

    for (let row = 3; row <= (2 + rules.length); row++) {
        instrSheet.mergeCells(`B${row}:C${row}`);
        instrSheet.getCell(`B${row}`).alignment = {
            vertical: "middle",
            horizontal: "left",
            wrapText: true
        };
        instrSheet.getCell(`B${row}`).font = {
            name: "Arial",
            family: 2,
            size: 10
        };
    }
    for (let row = 2 + rules.length + 3; row <= (2 + rules.length + 2 + instructions.length); row++) {
        instrSheet.getCell(`C${row}`).alignment = {
            vertical: "middle",
            horizontal: "left",
            wrapText: true
        };
        instrSheet.getCell(`B${row}`).font = {
            name: "Arial",
            family: 2,
            size: 10
        };
        instrSheet.getCell(`C${row}`).font = {
            name: "Arial",
            family: 2,
            size: 10
        };
    }

    rules.forEach((rule, index) => {
        instrSheet.getCell(`B${3 + index}`).value = rule[0];
        instrSheet.getRow(3 + index).height = rule[1] as number;
    });
    instructions.forEach((instr, index) => {
        instrSheet.getCell(`B${2 + rules.length + 3 + index}`).value = instr[0];
        instrSheet.getCell(`C${2 + rules.length + 3 + index}`).value = instr[1];
    });

    for (let row = 3; row <= (2 + rules.length); row++) {
        instrSheet.getCell(`B${row}`).border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
        };
    }
    for (let row = 2 + rules.length + 3; row <= (2 + rules.length + 2 + instructions.length); row++) {
        instrSheet.getCell(`B${row}`).border = {
            top: { style: "thin" },
            left: { style: "medium" },
            bottom: { style: row == (2 + rules.length + 2 + instructions.length) ? "medium" : "thin" },
            right: { style: "thin" }
        };
        instrSheet.getCell(`C${row}`).border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: row == (2 + rules.length + 2 + instructions.length) ? "medium" : "thin" },
            right: { style: "medium" }
        };
    }
}
/** CREATE WB FUNCTIONS:END */