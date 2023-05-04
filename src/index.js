const fs = require("fs");
const puppeteer = require("puppeteer");

const SUBREDDIT = "memes";
const SORT_BY_NEW = false;

(async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`https://www.reddit.com/r/${SUBREDDIT}/${SORT_BY_NEW ? "new/" : ""}`);
    const rawdata = await page.$$eval("img", imgs => imgs.map(img => img.src));

    for (var i = 0; i < rawdata.length; i++) {

        const image_link = rawdata[i];

        if (!image_link.startsWith("https://preview.")) {
            continue;
        }

        const image_name = `memes/${Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000}.jpg`;
        const image_buffer = await page.goto(image_link).then(response => response.buffer());

        fs.writeFileSync(image_name, image_buffer);

    }

    await browser.close();

})();