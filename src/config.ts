import "dotenv/config";

function getEnv(name: string, defaultValue?: string): string {
    const result = process.env[name] || defaultValue;
    if (result === undefined) {
        throw new Error(`Environment variable ${name} is required but could not be found`);
    }
    return result;
}

export default {
    port: getEnv("PAPER_PORT", "3000"),
    basePath: getEnv("PAPER_BASE_PATH", "/"),
    icalUrl: getEnv("CALENDAR_URL"),
    roomsConfigurationFile: getEnv("ROOMS_CONFIGURATION_FILE", "./rooms.yaml"),
    updateCron: getEnv("UPDATE_CRON", "0 7,9,16 * * 1,2,3,4,5")
}