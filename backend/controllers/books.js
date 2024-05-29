const Book = require('../models/Book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book)
  delete bookObject._id
  delete bookObject._userId
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  book.save()
  .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
  .catch(error => { res.status(400).json({ error })})
}

/*delete req.body._id;
const book = new Book({
  ...req.body
});
book.save()
  .then(() => res.status(201).json({ message: 'Livre enregistré !'}))
  .catch(error => res.status(400).json({ error }));*/

exports.getBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({ error }));
}

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
}

exports.updateBook = (req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;
  Book.findOne({_id: req.params.id})
    .then((book) => {
        if (book.userId != req.auth.userId) {
            res.status(401).json({ message : 'Not authorized'});
        } else {
          // Supprimer l'ancienne image
          if (bookObject.imageUrl) {
            const oldImagePath = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${oldImagePath}`, (err) => {
                if (err) {
                    console.error('Erreur lors de la suppression de l\'ancienne image :', err);
                } else {
                    console.log('Ancienne image supprimée avec succès');
                }
            });
          }
          Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
          .then(() => res.status(200).json({message : 'Livre modifié!'}))
          .catch(error => res.status(401).json({ error }));
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
}

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
  .then(book => {
      if (book.userId != req.auth.userId) {
          res.status(401).json({message: 'Not authorized'});
      } else {
          const filename = book.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            Book.deleteOne({_id: req.params.id})
                .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
                .catch(error => res.status(401).json({ error }));
          });
      }
  })
  .catch( error => {
      res.status(500).json({ error });
  });
}

exports.addRating = (req, res, next) => {
  
  const { userId, rating } = req.body;

  //recherche du livre
  Book.findOne({ _id: req.params.id })
    .then(book => {

      if (userId != req.auth.userId) {
        res.status(401).json({ message : 'Not authorized'});
      } else {

        // Vérifier si l'utilisateur a déjà noté le livre
        const existingRating = book.ratings.find(rating => rating.userId === userId);
        if (existingRating) {
          return res.status(400).json({ message: 'Vous avez déjà noté ce livre' });
        }

        // Ajouter la nouvelle note
        book.ratings.push({ userId, grade: rating });

        // Recalculer la note moyenne
        const totalRating = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
        book.averageRating = parseFloat((totalRating / book.ratings.length).toFixed(2));
        
        book.save()
        .then(() => res.status(201).json(book))
        .catch(error => { res.status(400).json({ error })})
      }

    })
    .catch(error => res.status(404).json({ error }));
}