import { defineConfig, devices } from '@playwright/test'
import { ensureResultsAndPWDirExists, getTimestampFolder } from './utils/CommonUtils'
//import dotenv from 'dotenv'

//dotenv.config()

const ENV = process.env.ENV || 'local';

process.env.ENV = ENV;

//dotenv.config({ path: `.env.${ENV}` });

ensureResultsAndPWDirExists();

export default defineConfig({
  testDir: './tests',
  timeout: 1000000,
  workers: 1,
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', {outputFolder: `Results/${getTimestampFolder()}`, open: 'never'}],
  ['allure-playwright', {outputFolder: 'allure-results'}]
],

    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:3000',
        headless: true,
        viewport: { width: 1920, height: 1080 },
        ignoreHTTPSErrors: true,
        screenshot: 'only-on-failure',
        video: {mode:'on',size:{width:1920,height:1080}},
        trace: 'off',
        acceptDownloads: true,
    },

    projects: [
        {
            name: 'chromium',   
            use:{
                headless: true,
                viewport: { width: 1920, height: 1080 },
            },
            testIgnore:[
                '**/*Firefox.spec.ts',
                '**/*Webkit.spec.ts',
                '**/*Edge.spec.ts',
            ],
        },
        {
            name: 'firefox',
            use:{   
                ...devices['Desktop Firefox'],
                headless: true,
                viewport: { width: 1920, height: 1080 },
            },  
            testMatch: ['**/*Firefox.spec.ts'],
        },
        {
            name: 'webkit',
            use:{
                ...devices['Desktop Safari'],
                headless: true,
                viewport: { width: 1920, height: 1080 },
            },
            testMatch: ['**/*Webkit.spec.ts'],
        },
        {
            name: 'edge',
            use:{
                ...devices['Desktop Edge'],
                headless: true,
                viewport: { width: 1920, height: 1080 },
            },
            testMatch: ['**/*Edge.spec.ts'],
        },
    ],
});