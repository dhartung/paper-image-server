import sharp from "sharp";
import render from "./image-geneator/render";

export type BinaryImage = {
  width: number;
  height: number;
  payload: Buffer;
};

export type UInt32 = number;

export const isUInt32 = (value: number): value is UInt32 => {
  const uint32Limit = 4294967295; // 2^32 - 1
  return Number.isInteger(value) && value >= 0 && value <= uint32Limit;
};

export const generateDisplayImage = async (
  qrCodeUrl: string,
  title: string,
  roomType: string,
  meetings: {
    title: string;
    time_start: Date;
    time_end: Date;
    person: string;
  }[]
): Promise<BinaryImage> => {
  const imageBuffer = await sharp(new Buffer(await render({qrCodeUrl, title, roomType, meetings}), "base64"))
    .grayscale()
    .resize(960, 540, {
      fit: "cover",
      // strategy: "attention" // chose image cut wisely
    })
    .normalize()
    .gamma()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const image = new Uint8ClampedArray(imageBuffer.data);
  const outputBuffer = Buffer.alloc(image.length / 2);

  for (let i = 0; i < image.length; i += 2) {
    const first = image[i] >> 4;
    const second = image[i + 1] & 0xf0;
    outputBuffer[i / 2] = first | second;
  }

  return {
    payload: outputBuffer,
    ...imageBuffer.info,
  };
};

export const createMessage = async (
  image: BinaryImage,
  imageId: UInt32,
  sleepTimeInSeconds: UInt32
): Promise<Buffer> => {
  if (!isUInt32(imageId)) {
    throw Error("imageId must be an unsigned, 32 bit integer number");
  }

  if (!isUInt32(sleepTimeInSeconds)) {
    throw Error("sleepTime must be an unsigned, 32 bit integer number");
  }

  const schemaVersion = 1;
  const x0 = 0;
  const y0 = 0;
  const width0 = image.width;
  const height0 = image.height;

  const schemaVersionBytes = Buffer.alloc(1);
  schemaVersionBytes.writeUInt8(schemaVersion);

  const imageIdBytes = Buffer.alloc(4);
  imageIdBytes.writeUInt32LE(imageId);

  const sleepTimeBytes = Buffer.alloc(4);
  sleepTimeBytes.writeInt32LE(sleepTimeInSeconds);

  const x0Bytes = Buffer.alloc(2);
  x0Bytes.writeUInt16LE(x0);

  const y0Bytes = Buffer.alloc(2);
  x0Bytes.writeUInt16LE(y0);

  const width0Bytes = Buffer.alloc(2);
  width0Bytes.writeUInt16LE(width0);

  const height0Bytes = Buffer.alloc(2);
  height0Bytes.writeUInt16LE(height0);

  return Buffer.concat([
    schemaVersionBytes,
    imageIdBytes,
    sleepTimeBytes,
    x0Bytes,
    y0Bytes,
    width0Bytes,
    height0Bytes,
    image.payload,
  ]);
};
