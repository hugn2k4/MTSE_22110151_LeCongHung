<<<<<<<< HEAD:BE/src/config/configdb.js
"use strict";

========
>>>>>>>> e72a6190ae1275dc214af0ba12eb1a9756e61785:bai_tap_03/src/config/configdb.ts
import mongoose from "mongoose";

const connectMongo = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/node_fulltask";
  try {
    await mongoose.connect(uri, {
      // mongoose 6+ no longer needs these options but keep for compatibility
      // @ts-ignore
      useNewUrlParser: true,
      // @ts-ignore
      useUnifiedTopology: true,
    } as any);
    console.log("MongoDB connected:", uri);
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
};

export default connectMongo;
