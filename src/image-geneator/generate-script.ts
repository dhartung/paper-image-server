import sharp from "sharp";
import { render } from "./render";

async function main() {
    const image = await render("https://codecentric.de", "Codecentric", "Meeting-Raum", []);
    (await sharp(image)).toFile("./output.png")
}

main();