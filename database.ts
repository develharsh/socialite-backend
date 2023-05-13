import mongoose from "mongoose";

export const connect = () => {
  const connString = `${
    process.env[`DB_${process.env.NODE_ENV?.toUpperCase()}`]
  }/${process.env.NODE_ENV}`;
  mongoose
    .connect(connString)
    .then(() => {
      console.log(`Connected to MongoDB.`);
      console.log(connString, `in ${process.env.NODE_ENV} Mode`);
    })
    .catch((error: any) => {
      console.log(`Error while connecting to DB: ${error.message}`);
    });
};
