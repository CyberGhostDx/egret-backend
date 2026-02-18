import app from "./app";
import config from "./config";

const port = Number(config.port) || 8000;

app.listen(port, "127.0.0.1", () => {
  console.log(`App running at http://localhost:${port}`);
});
