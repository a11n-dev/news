import { Articles } from "~/server/models/article.model";

export default defineSitemapEventHandler(async (e) => {
  const articles = await Articles.find({});

  return articles.map((article: any) => {
    return {
      loc: `/articles/${article._id}`,
      lastmod: article.updatedAt,
    };
  });
});
