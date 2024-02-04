import { readFile } from "fs/promises"
import config from "../config"

export const requestIcal = async (): Promise<string> => { 
    const result = await fetch(config.icalUrl)
    return await result.text()
}