import sharp from "sharp";
import {
  readImageAsBuffer,
  createMessage,
  BinaryImage,
} from "./message-writer";
import { tmpdir } from "os";
import { join as pathJoin } from "path";

const DISPLAY_WIDTH = 960;
const DISPLY_HEIGHT = 540;

describe("test image should be encoded correctly", () => {
  const buffer = readImageAsBuffer("test/test-image.png").then(
    (buffer) => new Uint8ClampedArray(buffer.payload)
  );

  it("The buffer size must be equal to the image size", async () =>
    expect((await buffer).length).toBe((DISPLAY_WIDTH * DISPLY_HEIGHT) / 2));

  it("The first gray pixel should be encoded as white, as the pixel is too light", async () =>
    expect((await buffer)[0]).toBe(0xff));

  it("The first red pixel should be encoded in correct bit order", async () =>
    expect((await buffer)[DISPLAY_WIDTH / 2]).toBe(0x3f));

  it("The very last pixel should be endoced as well", async () =>
    expect((await buffer)[(DISPLY_HEIGHT * DISPLAY_WIDTH) / 2 - 1]).toBe(0x6f));
});

describe("test resizing of images", () => {
  it.each([
    [1000, 1000],
    [200, 1000],
    [200, 200],
  ])("should resize an image with %dx%d pixel", async (width, height) => {
    const path = pathJoin(tmpdir(), "1000x1000.png");
    await sharp({
      create: {
        width: width,
        height: height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0.5 },
      },
    }).toFile(path);

    const buffer = await readImageAsBuffer(path);
    expect(buffer.payload.length).toBe((DISPLY_HEIGHT * DISPLAY_WIDTH) / 2);
    expect(new Set(buffer.payload)).toStrictEqual(new Set([0]));
  });
});

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
