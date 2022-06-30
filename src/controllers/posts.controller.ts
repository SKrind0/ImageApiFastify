import { FastifyRequest, FastifyReply } from "fastify";
import fs from "fs";
import path from "path";
import util from "util";
import { pipeline } from "stream";
const pump = util.promisify(pipeline);

interface IParams {
  image: string;
}

export async function saveImage(req: FastifyRequest, rep: FastifyReply) {
  const image = await req.file();

  const imageExtension = image.filename.split(".")[1];

  const extensionsArray = ["jpg", "jpeg", "png", "gif", "webp"];

  if (extensionsArray.includes(imageExtension)) {
    await pump(
      image.file,
      fs.createWriteStream(
        path.join(__dirname, "../public/images", image.filename)
      )
    );

    rep.send({
      message: "Image saved successfully",
      image: image.filename,
      url: `${req.headers.host}/api/v1/image/get/${image.filename}`,
    });
  } else {
    rep.code(400).send({
      error: "Invalid image extension",
    });
  }
}

export async function getImage(
  req: FastifyRequest<{ Params: IParams }>,
  rep: FastifyReply
) {
  try {
    const { fileTypeFromBuffer } = await (eval(
      'import("file-type")'
    ) as Promise<typeof import("file-type")>);
    const { image } = req.params;
    const __dirname = path.join(process.cwd(), "src");
    const files = fs.readdirSync(path.join(__dirname, "public/images"));

    const imageFiend = files.find(
      (file) =>
        file.split(".")[0] === image ||
        file === image ||
        file === image.split(".")[0]
    );

    const file = await fs.promises.readFile(
      path.join(__dirname, "public/images", imageFiend)
    );

    const m = await fileTypeFromBuffer(file).then((i) => i.mime);
    rep.type(m).send(file);
  } catch (err) {
    if (err instanceof Error) {
      rep.send({
        error: err.message,
      });
    }
  }
}

export async function deleteImage(
  req: FastifyRequest<{
    Params: IParams;
  }>,
  rep: FastifyReply
) {
  try {
    const { image } = req.params;
    const __dirname = path.join(process.cwd(), "src");
    const files = fs.readdirSync(path.join(__dirname, "public/images"));

    const imageFiend = files.find(
      (file) =>
        file.split(".")[0] === image ||
        file === image ||
        file === image.split(".")[0]
    );

    await fs.promises.unlink(path.join(__dirname, "public/images", imageFiend));

    rep.send({
      message: "Image deleted successfully",
    });
  } catch (err) {
    if (err instanceof Error) {
      rep.send({
        error: err.message,
      });
    }
  }
}
