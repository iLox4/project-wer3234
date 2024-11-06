import generateTestWb from "./wb-generators/generate-wb";
import { sendMessageWS, logErrorProcessingWBMessage } from "../../../src/utils";
import { setCsvHeaders, preprocessRichText } from "../../../src/generate-csvs-utils/csv-utils";
import { generateCsvObjectDefinition } from "../../../src/generate-csvs-utils/csv-managment";

// Mock dependencies
jest.mock('./../../../src/utils', () => ({
    sendMessageWS: jest.fn(),
    logErrorProcessingWBMessage: jest.fn()
}));
  
jest.mock('../../../src/generate-csvs-utils/csv-utils', () => ({
    setCsvHeaders: jest.fn(),
    preprocessRichText: jest.fn((value) => value)
}));

describe('generate csv Object Definition', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should generate CSV object definition correctly', async () => {
        const langs = [
          { code: 'en_US' },
          { code: 'fr_FR' },
        ];
        const mandatoryCells = ['A5', 'B5'];
        const valueCells = ['D5', 'G5'];
        const wsList = ['Objects', 'Position Object'];

        const { wbs, addedValues } = await generateTestWb(langs, wsList, mandatoryCells, valueCells);
        const logUuid = 'test-log-uuid';

        const result = await generateCsvObjectDefinition(wbs, langs, logUuid);
        const csvString = result.toString();

        // Verify if values are in result
        for (const addedValue of addedValues) {
            expect(csvString).toContain(addedValue);
        }

        // Verify that dependencies were called correctly
        expect(sendMessageWS).toHaveBeenCalledWith(
         'Generating (8 of 9): Object Definition.csv',
         logUuid
        );
        expect(setCsvHeaders).toHaveBeenCalledTimes(2);
        expect(preprocessRichText).toHaveBeenCalled();
    });

    it('should handle missing Objects worksheet', async () => {
        const langs = [{ code: 'en_US' }];
        const mandatoryCells = ['A5', 'B5'];
        const valueCells = ['D5', 'G5'];
        const wsList = ['Objects', 'Position Object'];

        const { wbs, addedValues } = await generateTestWb(langs, wsList, mandatoryCells, valueCells);
    
        const logUuid = 'test-log-uuid';
    
        const result = await generateCsvObjectDefinition(wbs, langs, logUuid);
        const csvString = result.toString();
    
        // Verify if values are in result
        for (const addedValue of addedValues) {
            expect(csvString).toContain(addedValue);
        }

        // Verify that dependencies were called correctly
        expect(sendMessageWS).toHaveBeenCalledWith(
         'Generating (8 of 9): Object Definition.csv',
         logUuid
        );
        expect(setCsvHeaders).toHaveBeenCalledTimes(2);
        expect(preprocessRichText).toHaveBeenCalled();
    });

    it('should handle missing both worksheet', async () => {
        const langs = [{ code: 'en_US' }];
        const mandatoryCells = ['A5', 'B5'];
        const valueCells = ['D5', 'G5'];
        const { wbs } = await generateTestWb(langs, [], mandatoryCells, valueCells);
    
        const logUuid = 'test-log-uuid';
    
        await generateCsvObjectDefinition(wbs, langs, logUuid);
    
        // Verify that error was logged
        expect(logErrorProcessingWBMessage).toHaveBeenCalledWith(
          logUuid,
          expect.any(Error),
          'en_US'
        );
    });

    it('should handle missing id and send a message', async () => {
        const langs = [{ code: 'en_US' }];
        const mandatoryCells = ['B5'];
        const valueCells = ['D5', 'G5'];
        const wsList = ['Objects'];

        const { wbs } = await generateTestWb(langs, wsList, mandatoryCells, valueCells);
    
        const logUuid = 'test-log-uuid';
    
        await generateCsvObjectDefinition(wbs, langs, logUuid);
    
        // Verify that a message was sent about missing data
        expect(sendMessageWS).toHaveBeenCalledWith(
          'Missing data at row 5 in language en_US in worksheet Objects',
          logUuid
        );
    });

    it('should handle missing fieldName and send a message', async () => {
        const langs = [{ code: 'en_US' }];
        const mandatoryCells = ['A5'];
        const valueCells = ['D5', 'G5'];
        const wsList = ['Objects'];

        const { wbs } = await generateTestWb(langs, wsList, mandatoryCells, valueCells);
    
        const logUuid = 'test-log-uuid';
    
        await generateCsvObjectDefinition(wbs, langs, logUuid);
    
        // Verify that a message was sent about missing data
        expect(sendMessageWS).toHaveBeenCalledWith(
          'Missing data at row 5 in language en_US in worksheet Objects',
          logUuid
        );
    });
});