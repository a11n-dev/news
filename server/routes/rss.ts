import RSS from "rss";

import { Article } from "~/server/models/article.model";

export default defineEventHandler(async (event) => {
  try {
    const articles = await Article.find({}).sort({ createdAt: -1 }).limit(20);

    if (!articles) {
      throw new Error("No articles found");
    }
    
    const feed = new RSS({
      title: "Crypto Moon Insider",
      site_url: "https://cryptomooninsider.com",
      feed_url: `https://cryptomooninsider.com/rss`,
      language: "en",
    });

    for (const article of articles) {
      feed.item({
        title: article.title, // title from post to item title
        url: `https://cryptomooninsider.com/articles/${article._id}`, // full path to where our article is hosted
        description: article.contentHTML, // description of the article
        date: article.createdAt, // date post was created
        author: article.author, // author of the post
      });
    }
    const feedString = feed.xml({ indent: true }); //This returns the XML as a string.

    event.node.res.setHeader("content-type", "text/xml"); // we need to tell nitro to return this as a xml file
    event.node.res.end(feedString); // send the HTTP response
  } catch (e) {
    return e;
  }
});
