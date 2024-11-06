import { sendMessageWS, logErrorProcessingWBMessage } from "../../../src/utils";
import { setCsvHeaders, preprocessRichText } from "../../../src/generate-csvs-utils/csv-utils";
import { generateCsvFoTranslation } from "../../../src/generate-csvs-utils/csv-managment";
import generateTestWb from "./wb-generators/generate-wb";

// Mock dependencies
jest.mock('./../../../src/utils', () => ({
    sendMessageWS: jest.fn(),
    logErrorProcessingWBMessage: jest.fn()
}));
  
jest.mock('../../../src/generate-csvs-utils/csv-utils', () => ({
    setCsvHeaders: jest.fn(),
    preprocessRichText: jest.fn((value) => value)
}));

describe('generate csv FoTranslation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should generate CSV alert message correctly', async () => {
        const langs = [
          { code: 'en_US' },
          { code: 'fr_FR' },
        ];
        const mandatoryCells = ['A5'];
        const valueCells = ['C5', 'D5', 'F5'];
        const wsList = ['Frequency'];

        const { wbs, addedValues } = await generateTestWb(langs, wsList, mandatoryCells, valueCells);
        const logUuid = 'test-log-uuid';

        const result = await generateCsvFoTranslation(wbs, langs, logUuid);
        const csvString = result.toString();

        // Verify if values are in result
        for (const addedValue of addedValues) {
            expect(csvString).toContain(addedValue);
        }

        // Verify that dependencies were called correctly
        expect(sendMessageWS).toHaveBeenCalledWith(
         'Generating (2 of 9): FoTranslation.csv',
         logUuid
        );
        expect(setCsvHeaders).toHaveBeenCalledWith(
         langs,
         ['value'],
         expect.any(Array)
        );
        expect(preprocessRichText).toHaveBeenCalled()
    });

    it('should handle missing worksheet', async () => {
        const langs = [{ code: 'en_US' }];
        const mandatoryCells = ['A5'];
        const valueCells = ['C5', 'D5', 'F5'];

        const { wbs } = await generateTestWb(langs, [], mandatoryCells, valueCells);
    
        const logUuid = 'test-log-uuid';
    
        await generateCsvFoTranslation(wbs, langs, logUuid);
    
        // Verify that error was logged
        expect(logErrorProcessingWBMessage).toHaveBeenCalledWith(
          logUuid,
          expect.any(Error),
          'en_US'
        );
    });

    it('should handle missing externalCode and send a message', async () => {
        const langs = [{ code: 'en_US' }];
        const valueCells = ['C5', 'D5', 'F5'];
        const wsList = ['Frequency'];

        const { wbs } = await generateTestWb(langs, wsList, [], valueCells);
    
        const logUuid = 'test-log-uuid';
    
        await generateCsvFoTranslation(wbs, langs, logUuid);
    
        // Verify that a message was sent about missing data
        expect(sendMessageWS).toHaveBeenNthCalledWith<[string, string]>(2, 'Missing data at row 5 in language en_US in worksheet Frequency', logUuid);
    });

    it('should handle missing externalCodeDesc', async () => {
        const langs = [
          { code: 'en_US' }
        ];
        const mandatoryCells = ['A5'];
        const valueCells = ['C5', 'F5'];
        const wsList = ['Frequency'];

        const { wbs } = await generateTestWb(langs, wsList, mandatoryCells, valueCells);
        const logUuid = 'test-log-uuid';

        const result = await generateCsvFoTranslation(wbs, langs, logUuid);
        const csvString = result.toString();

        // Verify that externalCode desc value is not in result
        expect(csvString.includes('CODE Description1 en_US')).toBeFalsy();
    });
});