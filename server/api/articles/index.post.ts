import { Article } from "~/server/models/article.model";

export default defineEventHandler(async (event) => {
  try {
    const { page } = await readBody(event);

    const skip = (page - 1) * 20 + 3;
    const articles = await Article.find({}).sort({ createdAt: -1 }).skip(skip).limit(20);

    return articles;
  } catch (error) {
    throw createError({
      status: 500,
      message: "Something went wrong",
    });
  }
});
