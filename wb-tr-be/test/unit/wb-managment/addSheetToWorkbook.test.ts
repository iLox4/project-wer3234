import { Workbook, Worksheet } from "exceljs";
import { addSheetToWorkbook } from "../../../src/generate-wb-utils/wb-managment";
import { applyStylesToCell } from "../../../src/generate-wb-utils/cell-managment";
import { addSheetToWbHappyDayConst, addSheetToWbNoTbHeaderConst } from "./constants";

jest.mock('../../../src/generate-wb-utils/cell-managment', () => ({
    applyStylesToCell: jest.fn()
}));
  
  describe('addSheetToWorkbook', () => {
    it('should add a new sheet with correct headers, subheaders, and styles', () => {
      // ARRANGE
      const wb = new Workbook();
      const { conf, styles } = addSheetToWbHappyDayConst; 
  
      // ACT
      const updatedWb = addSheetToWorkbook(wb, conf, styles);
  
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
      expect(applyStylesToCell).toHaveBeenCalledWith(
        (ws as Worksheet).getCell('B3'),
        styles,
        ['headerStyle']
      );
      expect(applyStylesToCell).toHaveBeenCalledWith(
        (ws as Worksheet).getCell('B4'),
        styles,
        ['subheaderStyle']
      );
  
      // Check that column 2 is hidden
      expect((ws as Worksheet).getColumn(2).hidden).toBe(true);
      expect((ws as Worksheet).getColumn(1).hidden).toBe(false);
    });

    it('should handle cases where table_header is not provided', () => {
        // Arrange
        const wb = new Workbook();
        const { conf, styles } = addSheetToWbNoTbHeaderConst;
    
        // Act
        const updatedWb = addSheetToWorkbook(wb, conf, styles);
    
        // Assert
        const ws = updatedWb.getWorksheet('No Header Sheet');
    
        // Check that the worksheet exists
        expect(ws).toBeDefined();
    
        // Since there's no table_header, the headers should start from row 1
        expect((ws as Worksheet).getCell('A1').value).toBe('Header1');
        expect((ws as Worksheet).getCell('A2').value).toBe('Subheader1');
        expect((ws as Worksheet).getCell('B1').value).toBe('Header2');
        expect((ws as Worksheet).getCell('B2').value).toBe('Subheader2');
    
        // Verify that applyStylesToCell was called correctly
        expect(applyStylesToCell).toHaveBeenCalledWith(
          (ws as Worksheet).getCell('A1'),
          styles,
          ['headerStyle']
        );
        expect(applyStylesToCell).toHaveBeenCalledWith(
          (ws as Worksheet).getCell('A2'),
          styles,
          ['subheaderStyle']
        );
        expect(applyStylesToCell).toHaveBeenCalledWith(
          (ws as Worksheet).getCell('B1'),
          styles,
          ['headerStyle']
        );
        expect(applyStylesToCell).toHaveBeenCalledWith(
          (ws as Worksheet).getCell('B2'),
          styles,
          ['subheaderStyle']
        );
    
        // Check that columns are not hidden
        expect((ws as Worksheet).getColumn(1).hidden).toBe(false);
        expect((ws as Worksheet).getColumn(2).hidden).toBe(false);
    });
});