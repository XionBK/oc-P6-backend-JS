const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const resizeImg = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const originalFilePath = path.join('images', req.file.filename);
  const webpFilePath = originalFilePath.replace(/\.[^/.]+$/, ".webp");
  sharp.cache(false);
  sharp(originalFilePath)
    .resize({ width: 465 })
    .webp({ quality: 80 })
    .toFile(webpFilePath)
    .then(() => {
      // Supprimer l'image originale après la création réussie du fichier WebP
      fs.unlink(originalFilePath, (err) => {
        if (err) {
          return next(err);
        }

        // Met à jour le nom du fichier dans req.file
        req.file.filename = req.file.filename.replace(/\.[^/.]+$/, ".webp");
        next();
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = resizeImg;