import { Article } from "~/server/models/article.model";

export default defineEventHandler(async (event) => {
  try {
    const articles = await Article.find({}).sort({ createdAt: -1 }).limit(3);

    return articles;
  } catch (error) {
    throw createError({
      status: 500,
      message: "Something went wrong",
    });
  }
});
