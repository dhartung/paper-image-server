import { getSleepTimeInSeconds } from "./wakeup-calculator";

process.env.TZ = "Europe/Amsterdam"

describe("getSleepTimeInSeconds", () => {
    it("should return seconds until next event", () => {
        const date = new Date("2024-02-05T07:00:00.000Z")
        // timezone is set to Amsterdam in winter, so UTC+1
        const cron = "0 9 * * *"
    
        const waitTime = getSleepTimeInSeconds(cron, date)

        expect(waitTime).toBe(60 * 60)
      });

      it("should return next event when the cron is at the current point in time", () => {
        const date = new Date("2024-02-05T07:00:00.000Z")
        const cron = "0 8 * * *"
    
        const waitTime = getSleepTimeInSeconds(cron, date)

        expect(waitTime).toBe(60 * 60 * 24)
      });
});