/// <reference types="node" />
import * as fs from 'fs';
import path, * as Path from 'path';

export function getTimestampFolder(): string {
    const d = new Date();
    const pad = (num: number): string => num.toString().padStart(2, '0');
    const timestamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
    return timestamp;
}

export function ensureResultsAndPWDirExists(): void {
    const resultsDir = Path.join(process.cwd(), 'Results');
    const playwrightReportsDir = Path.join(process.cwd(), 'playwright-report');
    if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir, { recursive: true });
    }
    if (!fs.existsSync(playwrightReportsDir)) {
        fs.mkdirSync(playwrightReportsDir, { recursive: true });
    }
}
  
export function randomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export function generateRandomEmail(): string {
    return `${randomString(6)}.${randomString(6)}${randomString(4)}@example.com`;
}


export function loadTestDataForTestCase(filename: string, moduleType: string){
    const testCaseName = filename.split(/[\\/]/).pop() || '';

    const env = process.env.ENV;
    if (!env) {
        throw new Error('Environment variable "ENV" is not set or defined.');
    }

    const jsonFileName = testCaseName.replace('.spec.ts', '.json');
    const envDataPath = path.join(process.cwd(), 'testData', env, moduleType, jsonFileName);
    const apiDataPath = path.join(process.cwd(), 'testData', 'api', moduleType, jsonFileName);
    const uiDataPath = path.join(process.cwd(), 'testData', 'ui', moduleType, jsonFileName);
    const defaultDataPath = path.join(process.cwd(), 'testData', moduleType, jsonFileName);

    const datapath = fs.existsSync(envDataPath)
        ? envDataPath
        : fs.existsSync(apiDataPath)
            ? apiDataPath
            : fs.existsSync(uiDataPath)
                ? uiDataPath
                : defaultDataPath;

    try {
        return JSON.parse(fs.readFileSync(datapath, 'utf-8'));
    } catch (error) {
        throw new Error(`could not load testdata for test case ${testCaseName}, environment ${env}, module ${moduleType}: ${error}`);
    }
}

export function getDateNDaysFromToday(noOfDays: number): string {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + noOfDays);
    const year = futureDate.getFullYear();
    const month = String(futureDate.getMonth() + 1).padStart(2, '0');
    const day = String(futureDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function generateNumber(length: number): number{
  if (length <= 0) {
    throw new Error("Length must be greater than 0");
  }

  // Ensure the first digit is not zero
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  // Generate random number in the range [min, max]
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
