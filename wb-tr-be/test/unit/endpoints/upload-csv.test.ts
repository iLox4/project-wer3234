// Mock the module
jest.mock('../../../src/generate-files-handler', () => ({
    generateCsvsHandler: jest.fn().mockResolvedValue(undefined),
    generateWbsHandler: jest.fn().mockResolvedValue(undefined),
}));

import request from 'supertest';
import { app } from '../../../app';
import JSZip from 'jszip';
import { FileProps } from '../../../src/types';
import { csvList } from '../../../src/constants';

const filePropsOk: FileProps = {
    clientName: 'testClient',
    colors: {
        primary: '#000',
        secondary: '#FFF',
        primaryText: '#FFF',
        secondaryText: '#000'
    },
    otherProps: {
        languageCodes: [ 'cz_CZ' ],
        objects: 'all',
        pickList: 'all'
    }
}

describe('POST /upload-csv', () => {
    it('should return 400 if no file is uploaded', async () => {
        const res = await request(app)
            .post('/upload-csv')
            .field('sessionId', 'testSession')
            .field('fileProps', JSON.stringify(filePropsOk));

        expect(res.status).toBe(400);
        expect(res.text).toBe('File is not in request');
    });

    it('should return 200 if a valid csvs zip is uploaded', async () => {
        const { generateWbsHandler } = require('../../../src/generate-files-handler') as {
            generateWbsHandler: jest.Mock;
        };

        const zip = new JSZip();
        for (const cvsFileName of csvList) {
            zip.file(cvsFileName, 'dummy content');
        } 

        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

        const res = await request(app)
            .post('/upload-csv')
            .field('sessionId', 'testSession')
            .field('fileProps', JSON.stringify(filePropsOk))
            .attach('file', zipBuffer, 'csvs.zip');

        expect(res.status).toBe(200);
        expect(res.text).toBe('CSVs succsefuly extracted');

        expect(generateWbsHandler).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if the zip does not contain valid csvs', async () => {
        const zip = new JSZip();
        zip.file('unvalid.csv', 'dummy content');

        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

        const res = await request(app)
            .post('/upload-csv')
            .field('sessionId', 'testSession')
            .field('fileProps', JSON.stringify(filePropsOk))
            .attach('file', zipBuffer, 'csvs.zip');

        expect(res.status).toBe(400);
        expect(res.text).toBe('Extracting csvs failed');
    });

    it('should return 400 if a non-zip file is uploaded', async () => {
        const fileContent = 'This is not a zip file';

        const res = await request(app)
            .post('/upload-csv')
            .field('sessionId', 'testSession')
            .attach('file', Buffer.from(fileContent), 'invalid.txt');

        expect(res.status).toBe(400);
        expect(res.text).toBe('Only ZIP files are allowed!');
    });
});