import * as express from "express";
import { morganMiddleware } from "./middlewares/morgan";
import * as multer from "multer";
import * as mammoth from "mammoth";
import { logger } from "./logger/winston";
import * as cors from "cors";
import { Liveblocks } from "@liveblocks/node";
import { LIVE_BLOCKS_SECRET_KEY } from "./env";
import { generateDockerName } from "./utils";

const PORT = 4411;

const app = express();

app.use(express.json());
app.use(cors());
app.use(morganMiddleware);

const storage = multer.memoryStorage();
const upload = multer({ storage });

const liveblocks = new Liveblocks({ secret: LIVE_BLOCKS_SECRET_KEY });

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

app.post("/convert", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).send({
        success: false,
        message: "No file uploaded.",
      });
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

app.post("/liveblocks/auth", async (req, res) => {
  const walletAddress = req.body.walletAddress;

  try {
    const session = liveblocks.prepareSession(walletAddress, {
      userInfo: {
        name: generateDockerName(),
        avatar: `https://api.dicebear.com/5.x/initials/svg?seed=${walletAddress}`,
      },
    });

    session.allow("document-*", session.FULL_ACCESS);

    const { body, status } = await session.authorize();

    res.status(status).end(body);
  } catch (err) {
    logger.error("Error in Liveblocks auth:", err);
    res.status(500).json({
      success: false,
      message: "Error in Liveblocks auth",
    });
  }
});

app.post("/liveblocks/users", async (req, res) => {
  console.log("userIds", req.body);
  const { userIds } = req.body;

  const users = userIds.map((userId: string) => ({
    id: userId,
    name: generateDockerName(),
    avatar: `https://api.dicebear.com/5.x/initials/svg?seed=${userId}`,
  }));

  res.status(200).json(users);
});

// app.get("*", (req: express.Request, res: express.Response) => {
//   res.status(500).json({ success: false, msg: "Internal Server Error" });
// });

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
