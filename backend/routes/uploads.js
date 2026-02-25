const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Create subdirectory for each service request
        const ticketId = req.body.ticketId || 'general';
        const ticketDir = path.join(uploadsDir, ticketId);
        if (!fs.existsSync(ticketDir)) {
            fs.mkdirSync(ticketDir, { recursive: true });
        }
        cb(null, ticketDir);
    },
    filename: (req, file, cb) => {
        // Create unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

// File filter to accept only certain file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, JPG, PNG, DOC, DOCX files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max file size
    }
});

// Upload multiple files for a service request (supports both separate and combined uploads)
router.post('/service-documents', upload.fields([
    { name: 'documents', maxCount: 10 },
    { name: 'idCopy', maxCount: 1 },
    { name: 'propertyProof', maxCount: 1 },
    { name: 'sitePlan', maxCount: 1 },
    { name: 'buildingPermit', maxCount: 1 }
]), async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No files uploaded'
            });
        }

        const ticketId = req.body.ticketId;
        const documents = [];

        // Handle separate document uploads (for new-service)
        if (req.files.idCopy) {
            const file = req.files.idCopy[0];
            documents.push({
                name: 'ID Copy',
                originalName: file.originalname,
                storedName: file.filename,
                path: `/uploads/${ticketId}/${file.filename}`,
                size: file.size,
                type: file.mimetype,
                uploadedAt: new Date().toISOString(),
                documentType: 'idCopy'
            });
        }

        if (req.files.propertyProof) {
            const file = req.files.propertyProof[0];
            documents.push({
                name: 'Proof of Property Ownership/Lease',
                originalName: file.originalname,
                storedName: file.filename,
                path: `/uploads/${ticketId}/${file.filename}`,
                size: file.size,
                type: file.mimetype,
                uploadedAt: new Date().toISOString(),
                documentType: 'propertyProof'
            });
        }

        if (req.files.sitePlan) {
            const file = req.files.sitePlan[0];
            documents.push({
                name: 'Site Plan',
                originalName: file.originalname,
                storedName: file.filename,
                path: `/uploads/${ticketId}/${file.filename}`,
                size: file.size,
                type: file.mimetype,
                uploadedAt: new Date().toISOString(),
                documentType: 'sitePlan'
            });
        }

        if (req.files.buildingPermit) {
            const file = req.files.buildingPermit[0];
            documents.push({
                name: 'Building Permit',
                originalName: file.originalname,
                storedName: file.filename,
                path: `/uploads/${ticketId}/${file.filename}`,
                size: file.size,
                type: file.mimetype,
                uploadedAt: new Date().toISOString(),
                documentType: 'buildingPermit'
            });
        }

        // Handle combined document uploads (for other services)
        if (req.files.documents) {
            req.files.documents.forEach((file, index) => {
                documents.push({
                    name: file.originalname,
                    originalName: file.originalname,
                    storedName: file.filename,
                    path: `/uploads/${ticketId}/${file.filename}`,
                    size: file.size,
                    type: file.mimetype,
                    uploadedAt: new Date().toISOString(),
                    index: index
                });
            });
        }

        res.json({
            success: true,
            message: 'Files uploaded successfully',
            documents: documents,
            ticketId: ticketId
        });
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to upload files'
        });
    }
});

// Serve uploaded files for download/preview
router.get('/download/:ticketId/:filename', (req, res) => {
    const { ticketId, filename } = req.params;
    const filePath = path.join(uploadsDir, ticketId, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            success: false,
            error: 'File not found'
        });
    }

    res.download(filePath);
});

// Get file for preview (inline viewing)
router.get('/preview/:ticketId/:filename', (req, res) => {
    const { ticketId, filename } = req.params;
    const filePath = path.join(uploadsDir, ticketId, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            success: false,
            error: 'File not found'
        });
    }

    // Set content disposition to inline for preview
    res.setHeader('Content-Disposition', 'inline');
    res.sendFile(filePath);
});

module.exports = router;
