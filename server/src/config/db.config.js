import mongoose from "mongoose"
import chalk from "chalk"

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONOGODB_URI)
        console.log(chalk.magentaBright(`MongoDB connect sucessfully :${conn.connection.host}`))
    } catch (error) {
        console.log(error)
        process.exit(1)

    }
}
export default connectDB