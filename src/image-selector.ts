import { Dirent } from "fs";
import fs from "fs/promises";
import { join as pathJoin } from "path";

const IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "jfif",
  "pjpeg",
  "pjp",
  "png",
  "gif",
  "bmp",
  "svg",
];

export type IndexedImage = {
  id: number;
  fileName: string;
};

const isImage = (file: Dirent): boolean => {
  return (
    IMAGE_EXTENSIONS.find((x) => file.name.endsWith(`.${x}`)) !== undefined
  );
};

export const getNextImage = async (
  imageDirectory: string,
  imageId: number = 0
): Promise<IndexedImage> => {
  if (!Number.isInteger(imageId) || imageId < 0) {
    throw new Error(`Image id must be a positive integer, got ${imageId}`);
  }

  const files = await fs.readdir(imageDirectory, { withFileTypes: true });
  const images = files.filter((x) => x.isFile() && isImage(x));

  const nextId = imageId % images.length;
  return {
    id: imageId + 1,
    fileName: pathJoin(images[nextId].path, images[nextId].name),
  };
};
