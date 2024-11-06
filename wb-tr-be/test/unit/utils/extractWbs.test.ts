import JSZip from "jszip";
import { extractWorkbooks } from "../../../src/utils";
import { Langs } from "../../../src/types";

describe('extract Workbooks', () => {
    it('should successfuly extract wbs and languages if it have at least one valid xslx file', async () => {
        const zip = new JSZip();
        zip.file('translation_workbook_en_US.xlsx', 'dummy content');
        zip.file('translation_workbook.xlsx', 'dummy content');

        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
        const langs: Langs = [];

        const result = await extractWorkbooks(zipBuffer, langs);

        expect(result.en_US).toBeDefined();
        expect(langs.length).toBe(1);
        expect(langs[0].code).toBe('en_US');
    });

    it('should successfuly extract wbs and languages if file name is not lower case', async () => {
        const zip = new JSZip();
        zip.file('Translation_wOrkBook_EN_US.xlsx', 'dummy content');

        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
        const langs: Langs = [];

        const result = await extractWorkbooks(zipBuffer, langs);

        expect(result.en_US).toBeDefined();
        expect(langs.length).toBe(1);
        expect(langs[0].code).toBe('en_US');
    });

    it('should successfuly extract wbs if file is in subfolder', async () => {
        const zip = new JSZip();
        zip.file('subfolder/Translation_wOrkBook_EN_US.xlsx', 'dummy content');

        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
        const langs: Langs = [];

        const result = await extractWorkbooks(zipBuffer, langs);

        expect(result.en_US).toBeDefined();
        expect(langs.length).toBe(1);
        expect(langs[0].code).toBe('en_US');
    });

    it('should throw an exception if all files names does not contain lang code or invalid', async () => {
        const zip = new JSZip();
        zip.file('translation_workbook.xlsx', 'dummy content');
        zip.file('transla_en_US.xlsx', 'dummy content2');
        zip.file('translation_workbook_en_US.txt', 'dummy content3');

        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
        const langs: Langs = [];

        await expect(extractWorkbooks(zipBuffer, langs))
            .rejects
            .toThrowErrorMatchingInlineSnapshot('"No valid workbooks found in the archive"');
    });
});