import {Browser, Page} from "puppeteer";

export function crow(url: string): Promise<string> {
    const puppeteer = require('puppeteer');
    const html: Promise<string> = (async() => {
        const browser: Browser  = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });
        const page: Page = await browser.newPage();
        await page.goto(url);
        const html:string = await page.content();
        await browser.close();
        return html;
    })();
    return html;
}