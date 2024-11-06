import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import { generateCsvsHandler, generateWbsHandler } from './src/generate-files-handler';
import { extractCSVs, extractWorkbooks } from './src/utils';
import { FileProps, Langs, UnzippedFileMap } from './src/types';
import passport from 'passport';
import xsenv from '@sap/xsenv';
import { XssecPassportStrategy, XsuaaService } from '@sap/xssec';
import { ServiceCredentials, XsuaaServiceCredentials } from '@sap/xssec/types/util/Types';

const APP_SCOPES = ['GenerateCsv', 'GenerateWb'];

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    path: '/socket.io',
    pingTimeout: 40000,
    cors: {
        origin: 'http://localhost:5000'
    }
});

// Load environment variables and services
xsenv.loadEnv();
const services = xsenv.getServices({ xsuaa: { tag: 'xsuaa' } });

// Access service credentials
const credentials = services.xsuaa;

// Create an instance of the XSUAA service
const authService = new XsuaaService(credentials as ServiceCredentials & XsuaaServiceCredentials);

// Configure Passport to use the XssecPassportStrategy
passport.use(new XssecPassportStrategy(authService));

// Initialize Passport
app.use(passport.initialize());

// Protect routes using Passport
app.use(passport.authenticate('JWT', { session: false }));

// Enable CORS for all requests (use specific origins in production)
app.use(cors());

io.on('connection', (socket) => {
    // Retrieve sessionId from query parameters
    const sessionId = socket.handshake.query.sessionId;

    if (sessionId) {
        socket.join(sessionId);
        console.log(`Client ${socket.id} joined session ${sessionId}`); 
    } else {
        console.error('ERROR: sessionId is missing');
    }

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Configure multer for file storage
// TODO: add max file size and other security measures
const storage = multer.memoryStorage();

// File filter to only accept ZIP files
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (file.mimetype === 'application/zip' || fileExtension === '.zip') {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('ERROR: file is not .zip')); // Reject the file
    }
}

const upload = multer({ storage, fileFilter });

// Handle wb upload
app.post('/upload-wb', upload.single('file'), async (req, res) => {
    if (!(req.authInfo as any).checkLocalScope('GenerateCsv')) {
        res.status(403).send('Access denied');
    }

    if (!req.file) {
        res.status(400).send('File is not in request');
        return;
    }

    const sessionId = req.body.sessionId;
    let uzippedWbs: UnzippedFileMap;
    const langs: Langs = [];

    try {
        uzippedWbs = await extractWorkbooks(req.file.buffer, langs);
        res.status(200).send('Workbooks successfully extracted');
    } catch (error: any) {
        console.error(`ERROR: extracting workbooks for session ${sessionId} failed`, error);
        res.status(400).send('Extracting workbooks failed');
        return;
    }

    generateCsvsHandler(uzippedWbs, sessionId, langs);
});

// Handle csv upload
app.post('/upload-csv', upload.single('file'), async (req, res) => {
    if (!(req.authInfo as any).checkLocalScope('GenerateWb')) {
        res.status(403).send('Access denied');
    }
    
    if (!req.file) {
        res.status(400).send('File is not in request');
        return;
    }

    const sessionId = req.body.sessionId;
    const fileProps: FileProps = JSON.parse(req.body.fileProps);
    let uzippedCSVs: UnzippedFileMap;

    try {
        uzippedCSVs = await extractCSVs(req.file.buffer);
        res.status(200).send('CSVs succsefuly extracted');
    } catch (error: any) {
        console.error(`ERROR: extracting csvs for session ${sessionId} failed`, error);
        res.status(400).send('Extracting csvs failed');
        return;
    }

    generateWbsHandler(uzippedCSVs, sessionId, fileProps);
});

// Get scopes for user
app.get('/getUserRoles', (req, res) => {
    const userScopes: string[] = [];

    APP_SCOPES.forEach(scope => {
        if ((req.authInfo as any).checkLocalScope(scope)) {
            userScopes.push(scope);
        }
    });

    res.status(200).send(userScopes);
});

// Handle or others routes
app.all('/', (req, res) => {
    res.status(404).send('Path not defined');
});

// Error handling middleware for multer file filter errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.message === 'ERROR: file is not .zip') {
        res.status(400).send('Only ZIP files are allowed!');
        return;
    }
    next(err);  // Pass the error to the default Express error handler
});

export { io, app, server };