import { Schema, InferSchemaType, model } from "mongoose";

const articleSchema = new Schema(
  {
    title: { type: String, required: true },
    thumbnail: { type: String, required: true },
    contentHTML: { type: String, required: true },
    excerpt: { type: String, required: true },
    author: { type: String, required: true },
    articleLink: { type: String, required: true },
  },
  { collection: "articles", timestamps: true }
);

type Article = InferSchemaType<typeof articleSchema>;

const Article = model("Article", articleSchema);

export { articleSchema, Article };