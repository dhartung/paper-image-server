function getNextWakeupSeconds(nextEvent: Date) : number {
    const now = new Date();
    const differenceToNextEvent = (nextEvent.getTime() - now.getTime()) / 1000 + 60;
    const next9AM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
    const next11AM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0, 0);

    if (now.getDay() === 0 || now.getDay() === 6) {
        // If it's a weekend, calculate the difference to the next Monday 9:00 AM
        next9AM.setDate(next9AM.getDate() + (1 + 7 - now.getDay()) % 7);
        next11AM.setDate(next11AM.getDate() + (1 + 7 - now.getDay()) % 7);
    } else {
        // If it's a workday, calculate the difference to the next 9:00 AM and 11:00 AM
        if (now.getTime() > next9AM.getTime()) {
            next9AM.setDate(next9AM.getDate() + 1);
            next11AM.setDate(next11AM.getDate() + 1);
        }
    }

    const differenceToNext9AM = (next9AM.getTime() - now.getTime()) / 1000;
    const differenceToNext11AM = (next11AM.getTime() - now.getTime()) / 1000;

    return (Math.min(differenceToNextEvent, differenceToNext9AM, differenceToNext11AM) >>> 0)
}


export default getNextWakeupSeconds;