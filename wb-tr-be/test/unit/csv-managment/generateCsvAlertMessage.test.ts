import { sendMessageWS, logErrorProcessingWBMessage } from "../../../src/utils";
import { setCsvHeaders, preprocessRichText } from "../../../src/generate-csvs-utils/csv-utils";
import { generateCsvAlertMessage } from "../../../src/generate-csvs-utils/csv-managment";
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

describe('generate csv Alert Message', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should generate CSV alert message correctly', async () => {
        const langs = [
          { code: 'en_US' },
          { code: 'fr_FR' },
        ];
        const mandatoryCells = ['A5'];
        const valueCells = ['E5', 'G5'];
        const wsList = ['Alert Messages'];

        const { wbs, addedValues } = await generateTestWb(langs, wsList, mandatoryCells, valueCells);
        const logUuid = 'test-log-uuid';

        const result = await generateCsvAlertMessage(wbs, langs, logUuid);
        const csvString = result.toString();

        // Verify if values are in result
        for (const addedValue of addedValues) {
            expect(csvString).toContain(addedValue);
        }

        // Verify that dependencies were called correctly
        expect(sendMessageWS).toHaveBeenCalledWith(
         'Generating (1 of 9): Alert Message.csv',
         logUuid,
         true
        );
        expect(setCsvHeaders).toHaveBeenCalledWith(
         langs,
         ['alertHeaderLocalized', 'alertDescriptionLocalized'],
         expect.any(Array)
        );
        expect(preprocessRichText).toHaveBeenCalled()
    });

    it('should handle missing worksheet', async () => {
        const langs = [{ code: 'en_US' }];
        const mandatoryCells = ['A5'];
        const valueCells = ['E5', 'G5'];

        const { wbs } = await generateTestWb(langs, [], mandatoryCells, valueCells);
    
        const logUuid = 'test-log-uuid';
    
        await generateCsvAlertMessage(wbs, langs, logUuid);
    
        // Verify that error was logged
        expect(logErrorProcessingWBMessage).toHaveBeenCalledWith(
          logUuid,
          expect.any(Error),
          'en_US'
        );
    });

    it('should handle missing externalCode and send a message', async () => {
        const langs = [{ code: 'en_US' }];
        const valueCells = ['E5', 'G5'];
        const wsList = ['Alert Messages'];

        const { wbs } = await generateTestWb(langs, wsList, [], valueCells);
    
        const logUuid = 'test-log-uuid';
    
        await generateCsvAlertMessage(wbs, langs, logUuid);
    
        // Verify that a message was sent about missing data
        expect(sendMessageWS).toHaveBeenCalledWith(
          'Missing data at row 5 in language en_US in worksheet Alert Messages',
          logUuid
        );
    });
});