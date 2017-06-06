import mongoose from "mongoose";

mongoose.Promise = global.Promise;

export const startDatabase = () => {
	mongoose.connect(process.env.MONGODB_URI);
	return mongoose;
};

