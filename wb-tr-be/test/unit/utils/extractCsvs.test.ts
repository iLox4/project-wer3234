import JSZip from "jszip";
import { csvForMatching, csvList } from "../../../src/constants";
import { extractCSVs } from "../../../src/utils";

describe('extract Csvs', () => {
    it('should successfuly extract csvs if it gets all necessary csvs', async () => {
        const zip = new JSZip();
        for (const csvFileName of csvList) {
            zip.file(csvFileName, 'dummy content');
        } 

        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
        
        const result = await extractCSVs(zipBuffer);

        for (const csvFileName of csvList) {
            expect(result[csvFileName]).toBeDefined();
        }
    });

    it('should successfuly extract csvs if they are in subfolders', async () => {
        const zip = new JSZip();
        for (const [index, csvFileName] of csvList.entries()) {
            zip.file(`${index}_sub/${csvFileName}`, 'dummy content');
        } 

        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
        
        const result = await extractCSVs(zipBuffer);

        for (const csvFileName of csvList) {
            expect(result[csvFileName]).toBeDefined();
        }
    });

    it('should successfuly extract csvs if csvs names are in wrong format(missing/added space or lower and upper case switched)', async () => {
        const zip = new JSZip();
        for (const csvFileName of csvForMatching) {
            zip.file(csvFileName, 'dummy content');
        } 

        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
        
        const result = await extractCSVs(zipBuffer);

        for (const csvFileName of csvList) {
            expect(result[csvFileName]).toBeDefined();
        }
    });

    it('should throw an error if some of csvs are missing or have invalid name', async () => {
        const zip = new JSZip();
        for (const [index, csvFileName] of csvList.entries()) {
            if (index === 5) {
                zip.file('invalidFile.txt', 'dummy content');
            } else {
                zip.file(csvFileName, 'dummy content');
            }
        } 

        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
        
        await expect(extractCSVs(zipBuffer))
            .rejects
            .toThrowErrorMatchingInlineSnapshot('"Some csvs are missing in the file"');
    });
});