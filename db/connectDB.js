import mongoose from "mongoose";

// asynchronous function to connect to our database
const connectDB = async () => {
  try {
    // create a connection using our CONNECTION_STRING env variable
    const conn = await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // log success to the console
    console.log(`MongoDB connection established: ${conn.connection.host}`);
  } catch (error) {
    // catch any errors that show up
    // log them to the console
    console.error(`Error establishing MongoDB connection: ${error.message}`);
    // shut down the app in case an error shows up
    process.exit(1);
  }
};

export default connectDB;
