import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export type UserType = {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type:String, required: true },
    firstName: { type:String, required: true },
    lastName: { type:String, required: true },
});

// hash logic to encrypt the password before saving
userSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next();
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;

//my notes:
//"User" parameter is the name of the collection in MongoDB. By convention, Mongoose will pluralize this (so it will look for a "users" collection in MongoDB).
//The result is a Model called User that you can use to perform CRUD operations on the "users" collection