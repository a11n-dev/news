import { Article } from "~/server/models/article.model";

export default defineEventHandler(async (event) => {
  try {
    const articleId = getRouterParam(event, "id");

    const article = await Article.findOne({ _id: articleId });

    return article;
  } catch (error) {
    throw createError({
      status: 500,
      message: "Something went wrong",
    });
  }
});
