import mongoose from "mongoose";
import OpenAI from "openai";
import puppeteer from "puppeteer";
import Parser from "@postlight/parser";
import { JSDOM } from "jsdom";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomBytes } from "crypto";

import { Articles } from "~/server/models/article.model";

const openai = new OpenAI();

const s3 = new S3Client({
  region: useRuntimeConfig().S3_BUCKET_REGION,
  credentials: {
    accessKeyId: useRuntimeConfig().S3_ACCESS_KEY,
    secretAccessKey: useRuntimeConfig().S3_SECRET_ACCESS_KEY,
  },
});

const puppeteerOptions = {
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
};
const resource = {
  link: "https://coinmarketcap.com/headlines/news/",
  postSelector: ".infinite-scroll-component .sc-b1d35755-0",
  linkSelector: "a",
};

export default defineNitroPlugin(() => {
  try {
    mongoose.connection.on("connected", () => {
      if (process.env.NODE_ENV !== "production") return;

      // Start parsing cycle on server start
      startParsingCycle();
      setInterval(startParsingCycle, 1000 * 60 * 30);
    });
  } catch (error) {
    console.error(error);
  }
});

async function startParsingCycle() {
  console.log("Parsing cycle started...");
  try {
    await parseArticles();
  } catch (error) {
    console.error("Error during parsing cycle:", error);
  }
}

async function parseArticles() {
  try {
    // Launch headless Chrome
    const browser = await puppeteer.launch(puppeteerOptions);
    const page = await browser.newPage();

    // Navigate to the resource URL
    await page.goto(resource.link);

    // Wait for the page to load and all client-side rendering to complete
    await page.waitForSelector(resource.postSelector);

    // Get the news links from each news block using the provided selectors
    const links = await page.$$eval(resource.postSelector + " " + resource.linkSelector, (links) => links.map((link) => link.href));

    // Parsing news articles
    for (let link of links) {
      if (!(new URL(link).hostname === "coinmarketcap.com")) continue;

      // Pass article if exist in db
      const originUrl = new URL(link);

      if (await Articles.exists({ articleLink: originUrl.origin + originUrl.pathname })) continue;

      await page.goto(link, { waitUntil: "networkidle0" });

      const html = await page.content();

      const dom = new JSDOM(html, { link });
      const data = await Parser.parse(link, { html: dom.serialize(), contentType: "html" });

      console.log(originUrl.origin + originUrl.pathname, await Articles.exists({ articleLink: link }));

      const openaiData = {
        title: data.title,
        contentHTML: JSON.stringify(data.content),
      };

      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "Hello, I am a bot that rewrites html news articles." },
          { role: "user", content: JSON.stringify(openaiData) },
        ],
        model: useRuntimeConfig().OPENAI_MODEL_ID,
      });

      if (!completion.choices[0].message.content) continue;

      const modifiedContent = JSON.parse(completion.choices[0].message.content);

      const imageKey = await uploadImageToS3(data.lead_image_url);

      await Articles.create({
        title: modifiedContent.title,
        thumbnail: `https://${useRuntimeConfig().S3_BUCKET_NAME}.s3.${useRuntimeConfig().S3_BUCKET_REGION}.amazonaws.com/${imageKey}`,
        contentHTML: modifiedContent.contentHTML,
        excerpt: data.excerpt,
        author: "Jasmine Chen",
        articleLink: originUrl.origin + originUrl.pathname,
      });

      break;
    }

    await browser.close();
    console.log("Parsing cycle ended.");
  } catch (error) {
    console.error("Parsing cycle ended with errors.", error);
  }
}

async function uploadImageToS3(imageUrl: string) {
  const response = await fetch(imageUrl);

  if (!response.ok) throw new Error("Failed to fetch image from URL.");

  const buffer = Buffer.from(await response.arrayBuffer());

  const imageKey = randomBytes(16).toString("hex");

  await s3.send(
    new PutObjectCommand({
      Bucket: useRuntimeConfig().S3_BUCKET_NAME,
      Key: imageKey,
      Body: buffer,
      ContentType: response.headers.get("content-type") || undefined,
    })
  );

  return imageKey;
}
