const express = require('express')
const mongoose = require('mongoose');
const uri = "mongodb+srv://bk:-$@cluster0.iofkxrr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const path = require('path');

const booksRoutes = require('./routes/books')
const userRoutes = require('./routes/user')

mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express()

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/books', booksRoutes)
app.use('/api/auth', userRoutes)

module.exports = app

/*
const books = [
  {
    userId: 1,
    title: 'Le cahier d\'enquête de Franck Thilliez',
    author: 'auteur book',
    imageUrl: 'https://static.fnac-static.com/multimedia/PE/Images/FR/NR/1d/4c/00/16796701/1507-1/tsp20240501081153/Le-cahier-d-enquete-de-Franck-Thilliez.jpg',
    year: 2012,
    genre: 'fiction',
    ratings: [{
      userId: 1,
      grade: 3,
    }],
    averageRating: 3,
  },
  {
    userId: 1,
    title: 'Le Médecin malgré lui',
    author: 'auteur book',
    imageUrl: 'https://static.fnac-static.com/multimedia/PE/Images/FR/NR/41/ba/04/309825/1507-1/tsp20231214072416/Le-Medecin-malgre-lui.jpg',
    year: 2012,
    genre: 'fiction',
    ratings: [{
      userId: 1,
      grade: 2,
    }],
    averageRating: 2,
  },
  {
    userId: 1,
    title: 'Harry Potter à l\'école des sorciers',
    author: 'auteur book',
    imageUrl: 'https://static.fnac-static.com/multimedia/PE/Images/FR/NR/ac/91/7c/8163756/1507-1/tsp20240313164207/Harry-Potter-a-l-ecole-des-sorciers.jpg',
    year: 2016,
    genre: 'fiction',
    ratings: [{
      userId: 1,
      grade: 5,
    }],
    averageRating: 5,
  }
];
res.status(200).json(books);*/