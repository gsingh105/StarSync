import mongoose, { Schema } from "mongoose"
import bcrypt from "bcryptjs"
import crypto from "crypto"

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
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"], 
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        refreshToken: {
            type: String,
            default: null
        },
        // --- Password Reset Fields ---
        resetPasswordToken: String,
        resetPasswordExpire: Date
    },
    {
        timestamps: true
    }
)

authSchema.pre("save", async function () { 
    if (!this.isModified("password")) return 
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

authSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password)
}

authSchema.methods.setRefreshToken = function (token) {
    this.refreshToken = token
    return this.save()
}

// --- Generate Reset Token Method ---
authSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex")

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

    // Set expire (10 minutes)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

    return resetToken
}

authSchema.methods.toJSON = function () {
    const user = this.toObject()
    delete user.password
    delete user.__v
    delete user.resetPasswordToken
    delete user.resetPasswordExpire
    return user
}

const authModel = mongoose.model("auth", authSchema)
export default authModel