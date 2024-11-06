import { Cell, Fill, Font, Workbook } from "exceljs";

export function applyStylesToCell(cell: Cell, styles: Record<string, any>, styleNames: string[]) {
    if (styles[""]) {
        for (const [style, settings] of Object.entries(styles[""])) {
            if (style === "font") {
                cell.style.font = settings as Partial<Font>;
            }
        }
    }
    for (const styleName of styleNames) {
        for (const [style, settings] of Object.entries(styles[styleName])) {
            if (style === "fill") {
                cell.fill = settings as Fill;
            }
            if (style === "font") {
                cell.style.font = settings as Partial<Font>;
            }
        }
    }
}

// Add loging for errors
export function setColumnWidths(wb: Workbook) {
    wb.eachSheet((ws) => {
        const dims: Record<string, number> = {};
        ws.eachRow({ includeEmpty: false }, (row) => {
            row.eachCell((cell) => {
                if (cell.value) {
                    const colLtr = ws.getColumn(cell.col).letter;
                    if (!dims[colLtr]) dims[colLtr] = 0;
                    dims[colLtr] = Math.max(dims[colLtr], cell.value.toString().length);
                }
            });
        });
        for (const [col, value] of Object.entries(dims)) {
            ws.getColumn(col).width = value;
        }
    });

    try {
        wb = correctPicklistColumnWidths(wb);
    } catch (error: any) {
        console.error('ERROR: Correcting Picklist column widhs failed', error);
    }
    

    return wb;
}

/** SET COLUMN WIDTHS FUNCTIONS:START */
function correctPicklistColumnWidths(wb: Workbook) {
    const ws = wb.getWorksheet("Picklist values");

    if (!ws) throw new Error('Picklist values worksheet was not found');

    ws.getColumn("A").width = 50;
    ws.getColumn("B").width = 50;

    return wb;
}
/** SET COLUMN WIDTHS FUNCTIONS:END */