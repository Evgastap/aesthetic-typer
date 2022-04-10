const express = require("express");
const app = express();
const io = require("socket.io");

app.use(express());

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {
  try {
    const subject = event.queryStringParameters.name || 'World'
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Hello ${subject}` }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
const port = 8000;

var server = app.listen(
  port,
  console.log(
    `Server is running on the port no: ${(port)} `
  )
);

io.on("connection", (socket) => {
	console.log("new client connected");
});