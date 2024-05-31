import { Article } from "~/server/models/article.model";

export default defineSitemapEventHandler(async (e) => {
  const articles = await Article.find({})
  
  return articles.map((article: any) => {
    return {
      loc: `/articles/${article._id}`,
      lastmod: article.updatedAt,
    };
  });
});
