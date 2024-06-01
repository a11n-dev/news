import mongoose from "mongoose";
import OpenAI from "openai";
import puppeteer, { type Browser } from "puppeteer";
import Parser from "@postlight/parser";
import { JSDOM } from "jsdom";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomBytes } from "crypto";

import { Article } from "~/server/models/article.model";

const config = useRuntimeConfig();

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

const s3 = new S3Client({
  region: config.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: config.S3_ACCESS_KEY,
    secretAccessKey: config.S3_SECRET_ACCESS_KEY,
  },
});

let browser: Browser;
const puppeteerOptions = {
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
};
const resource = {
  link: "https://coinmarketcap.com/headlines/news/",
  postSelector: ".infinite-scroll-component .sc-b1d35755-0",
  linkSelector: "a",
};

const authors = ["Jasmine Chen", "Samantha Carter", "George Hammond", "Marcus Lee", "Kirill Novotarskiy"];

export default defineNitroPlugin(() => {
  if (process.env.NODE_ENV !== "production") return;

  try {
    mongoose.connection.on("connected", async () => {
      await parseArticles();
      startRandomInterval();
    });
  } catch (error) {
    console.error(error);
  }
});

function startRandomInterval() {
  const delay = Math.random() * (45 - 30) + 30; // Generate a random delay between 30 and 45 minutes

  setTimeout(async () => {
    await parseArticles();
    startRandomInterval();
  }, delay * 60 * 1000);
}

async function parseArticles() {
  try {
    if (browser && browser.connected) browser.close();

    browser = await puppeteer.launch(puppeteerOptions); // Launch a new browser instance

    const page = await browser.newPage(); // Create a new page instance
    await page.goto(resource.link); // Navigate to the news page

    await page.waitForSelector(resource.postSelector); // Wait for the news blocks to load

    const links = await page.$$eval(resource.postSelector + " " + resource.linkSelector, (links) => links.map((link) => link.href)); // Extracting news article links

    // Parsing articles
    for (let link of links) {
      if (!(new URL(link).hostname === "coinmarketcap.com")) continue;

      // Pass article if exist in db
      const originUrl = new URL(link);

      if (await Article.exists({ articleLink: originUrl.origin + originUrl.pathname })) continue;

      await page.goto(link, { waitUntil: "networkidle0" });

      const html = await page.content();

      const dom = new JSDOM(html, { link });
      const data = await Parser.parse(link, { html: dom.serialize(), contentType: "html" });

      const rewritedContent = await rewriteArticle(data.title, JSON.stringify(data.content)); // Reweriting & summarizing article using OpenAI fine-tuned model

      if (!rewritedContent) continue;

      const imageKey = await uploadImageToS3(data.lead_image_url); // Uploading article thumbnail to AWS S3

      if (!imageKey) continue;

      await Article.create({
        title: rewritedContent.title,
        thumbnail: `https://${config.S3_BUCKET_NAME}.s3.${config.S3_BUCKET_REGION}.amazonaws.com/${imageKey}`,
        contentHTML: rewritedContent.contentHTML,
        excerpt: data.excerpt,
        author: authors[Math.floor(Math.random() * authors.length)],
        articleLink: originUrl.origin + originUrl.pathname,
      });

      break; // Break the loop after successfully parsing one article
    }
  } catch (error) {
    console.error("Code throw error", error);
  } finally {
    console.log("Closing browser");
    await browser.close().then(() => {
      console.log("Browser closed");
    }); // Close the browser instance

    if (browser.connected) {
      console.log("Browser is still connected");
    }
  }
}

async function rewriteArticle(title: string, contentHTML: string) {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "Hello, I am a bot that rewrites html news articles." },
      { role: "user", content: JSON.stringify({ title, contentHTML }) },
    ],
    model: config.OPENAI_MODEL_ID,
  });

  if (!completion.choices[0].message.content) return null;

  return JSON.parse(completion.choices[0].message.content);
}

async function uploadImageToS3(imageUrl: string) {
  const response = await fetch(imageUrl);

  if (!response.ok) return null;

  const buffer = Buffer.from(await response.arrayBuffer());

  const imageKey = randomBytes(16).toString("hex");

  await s3.send(
    new PutObjectCommand({
      Bucket: config.S3_BUCKET_NAME,
      Key: imageKey,
      Body: buffer,
      ContentType: response.headers.get("content-type") || undefined,
    })
  );

  return imageKey;
}
