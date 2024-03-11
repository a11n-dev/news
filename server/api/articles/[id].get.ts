import { Articles } from "~/server/models/article.model";

export default defineEventHandler(async (event) => {
  try {
    const articleId = getRouterParam(event, "id");
    const article = await Articles.findOne({ _id: articleId });

    return article;
  } catch (error) {
    throw createError({
      status: 500,
      message: "Something went wrong",
    });
  }
});
