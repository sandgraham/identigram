const http = require("http");
const server = http.createServer();
const { drawIdentigramToCanvas } = require("./identigram");

const PORT = 1990;

server.on("request", (request, response) => {
  const { url } = request;
  const string = url.split("/").pop();
  const canvas = drawIdentigramToCanvas(string);
  const stream = canvas.createPNGStream();
  stream.pipe(response);
  response.statusCode = 200;
  response.on("finish", response.end);
});

server.listen(PORT);
console.log(`Server listening on port ${PORT}...`);
