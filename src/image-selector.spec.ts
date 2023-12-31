import fs from "fs/promises";
import os from "os";
import path from "path";
import { getNextImage } from "./image-selector";

const createTestFiles = async (): Promise<string> => {
  const subDirPath = path.join(os.tmpdir(), "paper-test-files");
  await fs.mkdir(subDirPath, { recursive: true });

  const filesToCreate = ["file1.jpg", "file2.txt", "file3.png", "file4.mp4"];

  await Promise.all(
    filesToCreate.map(async (file) => {
      const filePath = path.join(subDirPath, file);
      await fs.writeFile(filePath, "");
    })
  );

  return subDirPath;
};

describe("getNextImage", () => {
  it("should return the next image file in the list which", async () => {
    const subDirPath = await createTestFiles();
    const image = await getNextImage(subDirPath, 1);
    expect(image).toStrictEqual({
      fileName: path.join(subDirPath, "file3.png"),
      id: 2,
    });
  });

  it("should reject non positive numbers", async () => {
    const subDirPath = await createTestFiles();
    await expect(getNextImage(subDirPath, -1)).rejects.toThrow(
      "Image id must be a positive integer, got -1"
    );
  });
});
