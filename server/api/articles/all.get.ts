import { Articles } from "~/server/models/article.model";

export default defineEventHandler(async (event) => {
  try {
    const articles = await Articles.find({}).sort({ createdAt: -1 }).skip(3).limit(20);

    return articles;
  } catch (error) {
    throw createError({
      status: 500,
      message: "Something went wrong",
    });
  }
});
