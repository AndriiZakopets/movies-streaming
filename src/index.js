import express from 'express';
import path from 'path';
import url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.static(path.join(__dirname, '../public/')));

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});
