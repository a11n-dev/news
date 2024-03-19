import RSS from "rss";

export default defineEventHandler(async (event) => {
  // wrap everything in a try catch block
  try {
    const response = await fetch("https://cryptomooninsider.com/api/articles/rss", { method: "GET" });

    if (!response.ok) {
      throw new Error(response?.statusText);
    }

    const posts = await response.json();

    const feed = new RSS({
      title: "Crypto Moon Insider",
      site_url: "https://cryptomooninsider.com",
      feed_url: `https://cryptomooninsider.com/rss`,
      language: "en",
    });

    for (const post of posts) {
      feed.item({
        title: post.title, // title from post to item title
        url: `https://cryptomooninsider.com/articles/${post._id}`, // full path to where our article is hosted
        description: post.contentHTML, // description of the article
        date: post.createdAt, // date post was created
        author: post.author, // author of the post
      });
    }
    const feedString = feed.xml({ indent: true }); //This returns the XML as a string.

    event.node.res.setHeader("content-type", "text/xml"); // we need to tell nitro to return this as a xml file
    event.node.res.end(feedString); // send the HTTP response
  } catch (e) {
    return e;
  }
});
