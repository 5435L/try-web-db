const express = require('express');
const mongoose = require('mongoose');
const app = express();

let uri = 'mongodb+srv://edcel:edcel123@cluster0.c7la0ri.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000
});


const newSchema = new mongoose.Schema({
  // Define your schema fields here
});

const NewModel = mongoose.model('NewCollection', newSchema);

mongoose.connection.once('open', () => {
  mongoose.connection.db.listCollections({ name: 'sign_up' }).next((err, collinfo) => {
    if (!collinfo) {
      mongoose.connection.db.createCollection('sign_up', (err, res) => {
        if (err) throw err;
        console.log('New collection created!');
      });
    }
  });
});


app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/log-reg.html');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

const User = require('./models/user');

app.use(express.urlencoded({ extended: true }));

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (user) {
    res.send('Login successful');
  } else {
    res.send('Invalid email or password');
  }
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  const user = new User({ username, email, password });

  try {
    await user.save();
    console.log('User saved successfully!');
    res.send('Registration successful');
  } catch (error) {
    console.error(`Error registering user: ${error.message}`);
    res.status(500).send(`Error registering user: ${error.message}`);
  }
  

  return res.redirect('home.html')
});