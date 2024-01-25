function getNextWakeupSeconds(nextEvent: Date) : number {
    const now = new Date();
    const differenceToNextEvent = (nextEvent.getTime() - now.getTime()) / 1000;
    let next9AM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
    let next11AM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0, 0);

    if (now.getDay() === 0 || now.getDay() === 6) {
        // If it's a weekend, set next9AM and next11AM to be the next Monday
        const daysUntilMonday = (1 - now.getDay() + 7) % 7;
        next9AM.setDate(now.getDate() + daysUntilMonday);
        next11AM.setDate(now.getDate() + daysUntilMonday);
    } else {
        if (now.getTime() > next11AM.getTime()) {
            // If it's past 11AM, calculate the difference to the next day's 9AM and 11AM
            next9AM.setDate(next9AM.getDate() + 1);
            next11AM.setDate(next11AM.getDate() + 1);
        } else if (now.getTime() > next9AM.getTime()) {
            // If it's past 9AM but before 11AM, calculate the difference to the next day's 9AM and today's 11AM
            next9AM.setDate(next9AM.getDate() + 1);
        }
    }

    const differenceToNext9AM = (next9AM.getTime() - now.getTime()) / 1000;
    const differenceToNext11AM = (next11AM.getTime() - now.getTime()) / 1000;

    return Math.round(Math.min(differenceToNextEvent, differenceToNext9AM, differenceToNext11AM) +45)
}

export default getNextWakeupSeconds;