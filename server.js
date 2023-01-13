const express = require('express');
const cors = require('cors');

const app = express();

const soundcloudClientId = '0K8gqs6E9DAVUafZxVq6xIIVVjtIgXTv';
const soundcloudUrl = 'https://api-v2.soundcloud.com/search';

const youtubeKey = 'AIzaSyD-4Brk6ZTC83QNLrXrB3VcJi1FXs27YwM'
const youtubeUrl = 'https://www.googleapis.com/youtube/v3/search'

const maxResults = 10

app.use(cors());


app.get('/search', async (req, res) => {
    const query = req.query.q;
    const scResponse = await fetch(`${soundcloudUrl}?client_id=${soundcloudClientId}&q=${query}`);
    const scData = await scResponse.json();

    const ytResponse = await fetch(`${youtubeUrl}?part=snippet&key=${youtubeKey}&q=${query}&order=relevance&type=video&maxResults=${maxResults}&videoCategoryId=10`);
    const ytData = await ytResponse.json();

    const data = [scData, ytData];
    res.send(data);
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
