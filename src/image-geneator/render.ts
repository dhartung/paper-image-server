import { createCanvas, loadImage } from "canvas";
import QRCode from "qrcode";
import { join } from "path";
import { MeetingEvent } from "../types";

export const render = async (qrCodeUrl: string, title: string, roomType: string, meetings: MeetingEvent[]): Promise<Buffer> => {
  const canvas = createCanvas(960, 540);
  const ctx = canvas.getContext("2d");

  // Generate white background
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, 960, 540);
 
  // Generate QR code
  const qrCodeSize = 400;
  const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl, { width: qrCodeSize });
  const qrCodeImage = await loadImage(qrCodeDataUrl);

  // Resize QR code
  const qrCodeX = 960 / 4 - qrCodeSize / 2;
  const qrCodeY = 540 / 4 - 10;
  ctx.drawImage(qrCodeImage, qrCodeX, qrCodeY);

  // Draw center line
  ctx.fillStyle = "#000";
  ctx.fillRect(960 / 2 - 1, 0, 2, 540);

  // Render title
  ctx.fillStyle = "#000";
  ctx.font = "bold 40px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(roomType, 960 / 4, 60, 960 / 2);
  ctx.font = "bold 60px sans-serif";
  ctx.fillText(title, 960 / 4, 120, 960 / 2 - 20);

  //render last update in the bottom left corner
  ctx.fillStyle = "#000";
  ctx.font = "bold 20px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(
    "Letztes Update: " + new Date().toLocaleString("de-DE"),
    10,
    530
  );

  //render title on the right
  ctx.fillStyle = "#000";
  ctx.font = "bold 30px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Kommende Meetings", (960 / 4) * 3, 60, 960 / 2);

  const icons = {
    calendar_week: await loadImage(join(__dirname, "icons/calendar-week.svg")),
    person: await loadImage(join(__dirname, "icons/person.svg")),
    clock: await loadImage(join(__dirname, "icons/clock.svg")),
    empty: await loadImage(join(__dirname, "icons/empty.png"))
  };

  //render meetings
  let currentCardIndex = 0;

  const cardWidth = 960 / 2 - 40;
  const cardHeight = 540 / 3 - 40;
  const cardX = 960 / 2 + 20;

  if (meetings.length == 0) {
    ctx.drawImage(icons.empty, cardX + 40, 70, 331, 401)

  ctx.fillStyle = "#555";
  ctx.font = "bold 20px sans-serif";
    ctx.fillText("Keine Meetings diese Woche", (960 / 4) * 3, 520, 960 / 2);
  }

  for (let i = 0; i < (meetings.length >= 3 ? 3 : meetings.length); i++) {
    const meeting = meetings[i];
    const meetingStart = meeting.start;
    const meetingEnd = meeting.end;

    //render meeting card
    const cardY = 60 + 15 + currentCardIndex * (cardHeight + 13);
    ctx.fillStyle = "#fff";
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight);
    ctx.fillStyle = "#000";
    ctx.strokeRect(cardX, cardY, cardWidth, cardHeight);

    //render meeting title
    ctx.fillStyle = "#000";
    ctx.font = "bold 25px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(meeting.title, cardX + 10, cardY + 25, cardWidth - 25);

    //render meeting person
    ctx.drawImage(icons.person, cardX + 10, cardY + 30, 23, 23);
    ctx.fillStyle = "#000";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "left";
    if (meeting.author != null) {
        ctx.fillText(meeting.author, cardX + 40, cardY + 48);
    }

    //render meeting time
    ctx.drawImage(icons.clock, cardX + 10, cardY + 67, 23, 23);
    ctx.fillStyle = "#000";
    ctx.font = "bold 50px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      getLocalTime(meetingStart) + " - " + getLocalTime(meetingEnd),
      cardX + cardWidth / 2,
      cardY + 95
    );

    //render meeting date
    ctx.drawImage(icons.calendar_week, cardX + 10, cardY + 110, 23, 23);
    ctx.fillStyle = "#000";
    ctx.font = "bold 25px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(getDateDate(meetingStart), cardX + 40, cardY + 130);

    currentCardIndex++;
  }

  return canvas.toBuffer();
}

function getLocalTime(date: Date) {
  return date.toLocaleTimeString("de-DE").split(":").slice(0, 2).join(":");
}

function getDateDate(date: Date) {
  return date.toLocaleDateString("de-DE");
}
