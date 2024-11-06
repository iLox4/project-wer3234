import generateTestWb from "./wb-generators/generate-wb";
import { sendMessageWS, logErrorProcessingWBMessage } from "../../../src/utils";
import { setCsvHeaders, preprocessRichText } from "../../../src/generate-csvs-utils/csv-utils";
import { generateCsvHrisElement } from "../../../src/generate-csvs-utils/csv-managment";

// Mock dependencies
jest.mock('./../../../src/utils', () => ({
    sendMessageWS: jest.fn(),
    logErrorProcessingWBMessage: jest.fn()
}));
  
jest.mock('../../../src/generate-csvs-utils/csv-utils', () => ({
    setCsvHeaders: jest.fn(),
    preprocessRichText: jest.fn((value) => value)
}));

describe('generate csv Hris Element', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should generate CSV hris element correctly', async () => {
        const langs = [
          { code: 'en_US' },
          { code: 'fr_FR' },
        ];
        const mandatoryCells = ['C5'];
        const valueCells = ['B5'];
        const wsList = ['Global Template Fields'];

        const { wbs, addedValues } = await generateTestWb(langs, wsList, mandatoryCells, valueCells);
        const logUuid = 'test-log-uuid';

        const result = await generateCsvHrisElement(wbs, langs, logUuid);
        const csvString = result.toString();

        // Verify if values are in result
        for (const addedValue of addedValues) {
            expect(csvString).toContain(addedValue);
        }

        // Verify that dependencies were called correctly
        expect(sendMessageWS).toHaveBeenCalledWith(
         'Generating (3 of 9): HRIS Element.csv',
         logUuid
        );
        expect(setCsvHeaders).toHaveBeenCalledWith(
         langs,
         ['externalName'],
         expect.any(Array)
        );
        expect(preprocessRichText).toHaveBeenCalled()
    });

    it('should handle missing worksheet', async () => {
        const langs = [{ code: 'en_US' }];
        const mandatoryCells = ['C5'];
        const valueCells = ['B5'];

        const { wbs } = await generateTestWb(langs, [], mandatoryCells, valueCells);
    
        const logUuid = 'test-log-uuid';
    
        await generateCsvHrisElement(wbs, langs, logUuid);
    
        // Verify that error was logged
        expect(logErrorProcessingWBMessage).toHaveBeenCalledWith(
          logUuid,
          expect.any(Error),
          'en_US'
        );
    });

    it('should handle missing externalCode and send a message', async () => {
        const langs = [{ code: 'en_US' }];
        const valueCells = ['B5'];
        const wsList = ['Global Template Fields'];

        const { wbs } = await generateTestWb(langs, wsList, [], valueCells);
    
        const logUuid = 'test-log-uuid';
    
        await generateCsvHrisElement(wbs, langs, logUuid);
    
        // Verify that a message was sent about missing data
        expect(sendMessageWS).toHaveBeenCalledWith(
          'Missing data at row 5 in language en_US in worksheet Global Template Fields',
          logUuid
        );
    });
});