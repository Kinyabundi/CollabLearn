import * as express from "express";
import { morganMiddleware } from "./middlewares/morgan";
import * as multer from "multer";
import mammoth from "mammoth";
import { logger } from "./logger/winston";

const PORT = 4411;

const app = express();

app.use(express.json());
app.use(morganMiddleware);

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const convertToHtml = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    mammoth
      .convertToHtml({ buffer })
      .then((result) => {
        resolve(result.value); // The generated HTML
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
};

// @ts-expect-error
app.post("/convert", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");

    }

    const html = await convertToHtml(req.file.buffer);
    res.status(200).json({ success: true, data: html });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error converting file to HTML.",
    });
  }
});

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
