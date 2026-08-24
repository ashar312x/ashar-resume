import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = Number(process.env.SERVER_PORT || 3032);
const host = process.env.SERVER_HOST || "0.0.0.0";
const enableHttps = process.env.SERVER_ENABLE_HTTPS === "true";
const staticDir = process.env.SERVER_STATIC_DIR || "dist";
const indexFile = process.env.SERVER_INDEX_FILE || "index.html";
const sslKeyPath = process.env.SSL_KEY_PATH || "";
const sslCertPath = process.env.SSL_CERT_PATH || "";
const sslCaPath = process.env.SSL_CA_PATH || "";

const distPath = path.join(process.cwd(), staticDir);

app.use(express.static(distPath));
app.get("/*", (req, res) => {
  const indexPath = path.join(distPath, indexFile);

  fs.readFile(indexPath, (error, fileBuffer) => {
    if (error) {
      console.error("node-error", error);
      return res.status(500).send("Internal Server Error");
    }

    res.setHeader("Content-Type", "text/html");
    res.setHeader("Content-Security-Policy", "frame-ancestors 'self';");
    res.send(fileBuffer);
  });
});

const server = enableHttps
  ? https.createServer(
      {
        key: fs.readFileSync(sslKeyPath),
        cert: fs.readFileSync(sslCertPath),
        ca: sslCaPath ? fs.readFileSync(sslCaPath) : undefined,
      },
      app
    )
  : http.createServer(app);

server.listen(port, host, () => {
  console.log(
    `React server listening on ${enableHttps ? "https" : "http"}://${host}:${port}`
  );
});