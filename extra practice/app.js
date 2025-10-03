import express from "express"
import { CommentsRouter } from "./routes/comments.router.js"
import { UsersRouter } from "./routes/users.router.js"
import morgan from "morgan"
import dotenv from "dotenv"

dotenv.config()
const PORT = process.env.PORT || 3000

const app = express()
app.use(morgan('tiny'))
app.use(express.json())
app.use("/users", UsersRouter)
app.use("/comments", CommentsRouter)

app.listen(PORT, ()=>{
    console.log(`The Server is running on Port properly!`)
})