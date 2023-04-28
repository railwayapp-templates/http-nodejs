import { createServer } from 'http';

createServer((req, res) => {
  console.log({ url: req.url });
  res.write('Hello World!');
  res.end();
}).listen(process.env.PORT);
