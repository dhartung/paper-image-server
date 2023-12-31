const getEnv = (key: string, defaultValue: string) => {
  return process.env["PAPER_" + key.toUpperCase()] || defaultValue;
};

export const config = {
  get port() {
    return getEnv("PORT", "3000");
  },

  get imageDirectory() {
    return getEnv("IMAGE_DIRECTORY", "./images");
  },

  get sleepTimeInSeconds() {
    return getEnv("SLEEP_TIME_IN_SECONDS", "60000");
  }
};
