import { Articles } from "~/server/models/article.model";

export default defineEventHandler(async (event) => {
  try {
    const { articleId } = await readBody(event);

    // const articles = await Articles.aggregate([{ $match: { _id: { $ne: articleId } } }, { $sample: { size: 20 } }]);
    const articles = await Articles.find({ _id: { $ne: articleId } })
      .sort({ createdAt: -1 })
      .limit(20);

    return articles;
  } catch (error) {
    throw createError({
      status: 500,
      message: "Something went wrong",
    });
  }
});
