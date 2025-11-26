import mongoose, { Schema } from "mongoose"
import bcrypt from "bcryptjs"

const authSchema = new Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            minlength: [3, "Full name must be at least 3 characters"], 
            maxlength: [30, "Full name cannot exceed 30 characters"] 
        },

        email: {
            type: String,
            required: [true, "Email is required"], // ← Added error message
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: [true, "Password is required"], // ← Added error message
            minlength: [6, "Password must be at least 6 characters"], // ← Fixed typo
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        refreshToken: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
)


authSchema.pre("save", async function (next) { 
    if (!this.isModified("password")) return next() 
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next() 
}) 


authSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password)
}


authSchema.methods.setRefreshToken = function (token) {
    this.refreshToken = token
    return this.save()
}

authSchema.methods.toJSON = function () {
    const user = this.toObject()
    delete user.password
    delete user.__v
    return user
}

const authModel = mongoose.model("auth", authSchema)
export default authModel