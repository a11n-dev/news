const { Schema, model } = require("mongoose");

const ArticlesSchema = new Schema(
  {
    title: { type: String, required: true },
    thumbnail: { type: String, required: true },
    contentHTML: { type: String, required: true },
    excerpt: { type: String, required: true },
    articleLink: { type: String, required: true },
  },
  { collection: "articles", timestamps: true }
);

const Articles = model("Article", ArticlesSchema);

module.exports = { ArticlesSchema, Articles };
