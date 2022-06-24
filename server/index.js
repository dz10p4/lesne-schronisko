const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const posts = require('./api/posts');
app.use('/api/posts',posts);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`PORT: ${port}`));
