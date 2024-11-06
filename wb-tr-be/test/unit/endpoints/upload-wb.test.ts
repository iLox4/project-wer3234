// Mock the module
jest.mock('../../../src/generate-files-handler', () => ({
    generateCsvsHandler: jest.fn().mockResolvedValue(undefined),
    generateWbsHandler: jest.fn(),
}));

import request from 'supertest';
import { app } from '../../../app';
import JSZip from 'jszip';

describe('POST /upload-wb', () => {
    it('should return 400 if no file is uploaded', async () => {
        const res = await request(app)
            .post('/upload-wb')
            .field('sessionId', 'testSession');

        expect(res.status).toBe(400);
        expect(res.text).toBe('File is not in request');
    });

    it('should return 200 if a valid workbook zip is uploaded', async () => {
        const { generateCsvsHandler } = require('../../../src/generate-files-handler') as {
            generateCsvsHandler: jest.Mock;
        };

        const zip = new JSZip();
        zip.file('translation_workbook_en_US.xlsx', 'dummy content');

        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

        const res = await request(app)
            .post('/upload-wb')
            .field('sessionId', 'testSession')
            .attach('file', zipBuffer, 'workbooks.zip');

        expect(res.status).toBe(200);
        expect(res.text).toBe('Workbooks successfully extracted');

        expect(generateCsvsHandler).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if the zip does not contain valid workbooks', async () => {
        const zip = new JSZip();
        zip.file('invalid_file.txt', 'dummy content');

        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

        const res = await request(app)
            .post('/upload-wb')
            .field('sessionId', 'testSession')
            .attach('file', zipBuffer, 'workbooks.zip');

        expect(res.status).toBe(400);
        expect(res.text).toBe('Extracting workbooks failed');
    });

    it('should return 400 if a non-zip file is uploaded', async () => {
        const fileContent = 'This is not a zip file';

        const res = await request(app)
            .post('/upload-wb')
            .field('sessionId', 'testSession')
            .attach('file', Buffer.from(fileContent), 'invalid.txt');

        expect(res.status).toBe(400);
        expect(res.text).toBe('Only ZIP files are allowed!');
    });
});