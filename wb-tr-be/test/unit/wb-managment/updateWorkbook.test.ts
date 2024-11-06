import { Workbook, Worksheet } from "exceljs";
import { updateWorkbook } from "../../../src/generate-wb-utils/wb-managment";
import { applyStylesToCell } from "../../../src/generate-wb-utils/cell-managment";
import { updateWbHappyDayConst, updateWbHiddenColumnConst, updateWbNoHeaderConst, updateWbNoTranslSrcColConst } from "./constants";
import { deduplicatePicklistValues } from "../../../src/generate-wb-utils/wb-managment-utils";

jest.mock('../../../src/generate-wb-utils/wb-managment-utils', () => ({
    deduplicatePicklistValues: jest.fn((wb, conf, styles) => wb)
}));

jest.mock('../../../src/generate-wb-utils/cell-managment', () => ({
    applyStylesToCell: jest.fn()
}));

describe('updateWorkbook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update the workbook correctly based on the configuration and data provided', () => {
        // ARRANGE
        const wb = new Workbook();
        const { data, conf } = updateWbHappyDayConst;  
    
        const sfMappings = {
            group1: {
            Value1: { 'key1.en': 'Mapped Value1 EN' },
            Value2: { 'key1.en': 'Mapped Value2 EN' },
            },
        };
    
        const styles = {
            headerStyle: { font: { bold: true } },
            subheaderStyle: { font: { italic: true } },
            inactive: { font: { color: { argb: 'FF999999' } } },
        };
    
        // ACT
        const updatedWb = updateWorkbook(wb, conf, 'en', data, sfMappings, styles);
    
        // ASSERT
        const ws = updatedWb.getWorksheet('Test Sheet');
    
        // Check that the worksheet exists
        expect(ws).toBeDefined();

        // Check the table header
        const tableHeaderCell = (ws as Worksheet).getCell('A1');
        expect(tableHeaderCell.value).toBe('Test Table Header');
        expect(tableHeaderCell.alignment).toEqual({
            horizontal: 'center',
            vertical: 'middle',
        });
        expect(applyStylesToCell).toHaveBeenCalledWith(
            tableHeaderCell,
            styles,
            conf.table_header_styles
        );
    
        // Check the column headers and subheaders
        expect((ws as Worksheet).getCell('A3').value).toBe('Header1');
        expect((ws as Worksheet).getCell('A4').value).toBe('Subheader1');
        expect((ws as Worksheet).getCell('B3').value).toBe('Header2');
        expect((ws as Worksheet).getCell('B4').value).toBe('Subheader2');
    
        // Check that applyStylesToCell is called for headers and subheaders
        expect(applyStylesToCell).toHaveBeenCalledWith(
            (ws as Worksheet).getCell('A3'),
            styles,
            ['headerStyle']
        );
        expect(applyStylesToCell).toHaveBeenCalledWith(
            (ws as Worksheet).getCell('A4'),
            styles,
            ['subheaderStyle']
        );
    
        // Check data cells for column 1
        expect((ws as Worksheet).getCell('A5').value).toBe('Alpha'); // Mapped from 'A' to 'Alpha'
        expect((ws as Worksheet).getCell('A6').value).toBe('Beta'); // Mapped from 'B' to 'Beta'
    
        // Check that applyStylesToCell is called for data cells
        expect(applyStylesToCell).toHaveBeenCalledWith(
            (ws as Worksheet).getCell('A5'),
            styles,
            ['inactive']
        );
        expect(applyStylesToCell).toHaveBeenCalledWith(
            (ws as Worksheet).getCell('A6'),
            styles,
            ['inactive']
        );
    
        // Check that column 2 is hidden
        expect((ws as Worksheet).getColumn(2).hidden).toBe(true);
    
        // Check data cells for column 2
        expect((ws as Worksheet).getCell('B5').value).toBe('Mapped Value1 EN');
        expect((ws as Worksheet).getCell('B6').value).toBe('Mapped Value2 EN');
    });

    it('should handle cases where table_header is not provided', () => {
        // ARRANGE
        const wb = new Workbook();
        const { conf, data } = updateWbNoHeaderConst;
        const sfMappings = {};
        const styles = {};
      
        // ACT
        const updatedWb = updateWorkbook(wb, conf, 'en', data, sfMappings, styles);
      
        // ASSERT
        const ws = updatedWb.getWorksheet('No Header Sheet');
        expect(ws).toBeDefined();
      
        // The first data row should start from row 1 since there's no table header
        expect((ws as Worksheet).getCell('A1').value).toBe('Header1');
        expect((ws as Worksheet).getCell('A2').value).toBe('Subheader1');
        expect((ws as Worksheet).getCell('A3').value).toBe('Test Data');
    });

    it('should handle columns with translation_source_column', () => {
        // ARRANGE
        const wb = new Workbook();
        const { conf, data } = updateWbNoTranslSrcColConst;
        const sfMappings = {};
        const styles = {};
      
        // ACT
        const updatedWb = updateWorkbook(wb, conf, 'en', data, sfMappings, styles);
      
        // ASSERT
        const ws = updatedWb.getWorksheet('Translation Sheet');
        expect((ws as Worksheet).getCell('A3').value).toBe('Hello');
        expect((ws as Worksheet).getCell('A4').value).toBe('Goodbye');
    });
    
    it('should respect the column_hidden property', () => {
        // Arrange
        const wb = new Workbook();
        const { conf, data } = updateWbHiddenColumnConst;
        const sfMappings = {};
        const styles = {};
      
        // Act
        const updatedWb = updateWorkbook(wb, conf, 'en', data, sfMappings, styles);
      
        // Assert
        const ws = updatedWb.getWorksheet('Column Hidden Sheet');
        expect((ws as Worksheet).getColumn(1).hidden).toBe(false);
        expect((ws as Worksheet).getColumn(2).hidden).toBe(true);
    });
    
    it('should call deduplicatePicklistValues when sheet_name is "Picklist values"', () => {
        // ARRANGE
        const wb = new Workbook();
        const conf = {
          sheet_name: 'Picklist values',
          columns: [],
        };
        const data: Array<Record<string, string>> = [];
        const sfMappings = {};
        const styles = {};
      
        // ACT
        updateWorkbook(wb, conf, 'en', data, sfMappings, styles);
      
        // ASSERT
        expect(deduplicatePicklistValues).toHaveBeenCalled();
    });  
});