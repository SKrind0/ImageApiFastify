import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  saveImage,
  getImage,
  deleteImage,
} from "../controllers/posts.controller";

export default async function (f: FastifyInstance, opts: FastifyPluginOptions) {
  f.post("/save", saveImage);
  f.get("/get/:image", getImage);
  f.put("/delete/:image", deleteImage);
}

export const autoPrefix = "/image";
