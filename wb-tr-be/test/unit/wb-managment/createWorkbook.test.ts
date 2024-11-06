import { Workbook } from "exceljs";
import { createWorkbook } from "../../../src/generate-wb-utils/wb-managment";
import { initCoverSheet, initInstructionsSheet } from "../../../src/generate-wb-utils/wb-managment-utils";
import { FileProps } from "../../../src/types";

jest.mock('../../../src/generate-wb-utils/wb-managment-utils', () => ({
    initCoverSheet: jest.fn(),
    initInstructionsSheet: jest.fn()
}));

describe('createWorkbook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create workbook, set creator/modifier, create worksheets with right tab color and call initCoverSheet and initInstructionsSheet', () => {
        // ARRANGE
        const fileProps = { colors: { primary: '#0000ff' } } as unknown as FileProps;
        const colorToExpect = '0000FF';
        
        // ACT
        const wb = createWorkbook(fileProps);

        // ASSERT
        expect(wb).toBeInstanceOf(Workbook);

        const coverSheet = wb.getWorksheet('Cover Sheet');
        const instructionsSheet = wb.getWorksheet('Instructions');

        expect(coverSheet).toBeDefined();
        expect(instructionsSheet).toBeDefined();

        expect(coverSheet?.properties.tabColor.argb).toBe(colorToExpect);
        expect(instructionsSheet?.properties.tabColor.argb).toBe(colorToExpect);

        expect(initCoverSheet).toHaveBeenCalled();
        expect(initInstructionsSheet).toHaveBeenCalled();
    });
});