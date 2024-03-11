import mongoose from "mongoose";

mongoose.set("strictQuery", false);

export default defineNitroPlugin(async () => {
  try {
    // Connect to mongodb
    if (isProduction() || isDevelopment()) {
      await mongoose.connect(useRuntimeConfig().MGDB_URI).then(() => {
        console.log("DB connection established.");
      });
    }
  } catch (error) {
    console.error("DB connection failed.", error);
  }
});

const isProduction = () => {
  return process.env.NODE_ENV === "production";
};

const isDevelopment = () => {
  return process.env.NODE_ENV === "development";
};
