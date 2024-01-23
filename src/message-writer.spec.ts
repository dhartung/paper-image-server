import sharp from "sharp";
import {
  generateDisplayImage,
  createMessage,
  BinaryImage,
} from "./message-writer";
import { tmpdir } from "os";
import { join as pathJoin } from "path";

const DISPLAY_WIDTH = 960;
const DISPLY_HEIGHT = 540;



describe("createMessage", () => {
  const validImage: BinaryImage = {
    width: 960,
    height: 540,
    payload: Buffer.alloc(20),
  };

  for (let i = 0; i < validImage.payload.length; i++) {
    validImage.payload[i] = 0;
  }

  it("throws error if imageId is not an unsigned 32 bit integer", async () => {
    const invalidImageId: number = -1;

    await expect(createMessage(validImage, invalidImageId, 0)).rejects.toThrow(
      "imageId must be an unsigned, 32 bit integer number"
    );
  });

  it("throws error if sleepTimeInSeconds is not an unsigned 32 bit integer", async () => {
    const invalidSleepTimeInSeconds: number = -1;

    await expect(
      createMessage(validImage, 0, invalidSleepTimeInSeconds)
    ).rejects.toThrow("sleepTime must be an unsigned, 32 bit integer number");
  });

  it("returns correct buffer with a valid image, imageId, and sleepTimeInSeconds", async () => {
    const imageId = 5;
    const sleepTimeInSeconds = 2;

    const expectedResult = Buffer.concat([
      Buffer.from([1]), // schema version
      Buffer.from([5, 0, 0, 0]), // image id
      Buffer.from([2, 0, 0, 0]), // sleep time in seconds
      Buffer.from([0, 0]), // x
      Buffer.from([0, 0]), // y
      Buffer.from([192, 3]), // width
      Buffer.from([28, 2]), // height
      validImage.payload,
    ]);

    const result = await createMessage(validImage, imageId, sleepTimeInSeconds);
    expect(result).toEqual(expectedResult);
  });
});
