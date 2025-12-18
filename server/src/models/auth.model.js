import mongoose, { Schema } from "mongoose"
import bcrypt from "bcryptjs"
import crypto from "crypto"

const authSchema = new Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: "user" },
        refreshToken: { type: String, default: null },
        googleId: { type: String, unique: true, sparse: true },
        profileImage: { type: String },
        walletBalance: {
            type: Number,
            default: 0
        },

        resetPasswordToken: String,
        resetPasswordExpire: Date
    },
    { timestamps: true }
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

authSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex")
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000
    return resetToken
}

const authModel = mongoose.model("auth", authSchema)
export default authModel