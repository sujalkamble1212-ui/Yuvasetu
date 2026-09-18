const express = require('express');
const router = express.Router();
const path = require('path');
const { getFileFromGridFS } = require('../utils/gridfs');

/**
 * Common handler to serve file from GridFS by ID or filename
 */
const serveGridFSFile = async (req, res, identifier) => {
  try {
    const result = await getFileFromGridFS(identifier);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'File not found in database.',
      });
    }

    const { file, stream } = result;

    const contentType = file.contentType || file.metadata?.mimeType || 'application/octet-stream';
    const originalName = file.metadata?.originalName || file.filename;

    res.set({
      'Content-Type': contentType,
      'Content-Length': file.length,
      'Cache-Control': 'public, max-age=86400', // cache for 1 day
    });

    const isDownload = req.query.download === 'true';
    const disposition = isDownload ? 'attachment' : 'inline';
    res.set('Content-Disposition', `${disposition}; filename="${encodeURIComponent(originalName)}"`);

    stream.on('error', (err) => {
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: 'Error streaming file.' });
      }
    });

    stream.pipe(res);
  } catch (err) {
    console.error('File serve error:', err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Server error retrieving file.' });
    }
  }
};

// Route: GET /api/files/:id
// Route: GET /api/files/:id/:filename (with optional friendly filename in url)
router.get('/:id/:filename?', async (req, res) => {
  await serveGridFSFile(req, res, req.params.id);
});

module.exports = {
  fileRouter: router,
  serveGridFSFile,
};
