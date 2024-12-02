// server.js
const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const ALLOWED_DOMAIN = '@gymburgdorf.ch';

// Konfiguriere das Dateiupload-System
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, `${req.body.teacher}_${req.body.subject}_${req.body.topic}_${Date.now()}_${file.originalname}`);
    }
});
const upload = multer({ storage });

// Middleware für Session und JSON Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'geheimnis', resave: false, saveUninitialized: true }));

// Statische Dateien im Ordner "public" bereitstellen
app.use(express.static(path.join(__dirname, 'public')));

// Anmelde-Authentifizierung
app.post('/login', (req, res) => {
    const { email } = req.body;
    if (email.endsWith(ALLOWED_DOMAIN)) {
        req.session.user = { email };
        res.status(200).send({ message: 'Login erfolgreich' });
    } else {
        res.status(401).send({ message: 'Nur @gymburgdorf.ch Adressen erlaubt' });
    }
});

// Datei-Upload
app.post('/upload', upload.single('file'), (req, res) => {
    if (req.session.user) {
        res.status(200).send({ message: 'Datei erfolgreich hochgeladen' });
    } else {
        res.status(401).send({ message: 'Nicht authentifiziert' });
    }
});

// Alle Dateien anzeigen und zum Download anbieten
app.get('/files', (req, res) => {
    if (req.session.user) {
        fs.readdir('./uploads', (err, files) => {
            if (err) return res.status(500).send('Fehler beim Lesen der Dateien');
            res.status(200).send(files);
        });
    } else {
        res.status(401).send({ message: 'Nicht authentifiziert' });
    }
});

// Datei-Download
app.get('/download/:filename', (req, res) => {
    const file = path.join(__dirname, 'uploads', req.params.filename);
    res.download(file);
});

// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
