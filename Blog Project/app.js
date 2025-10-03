import express from "express"
import morgan from "morgan"
import dotenv from "dotenv"
import CommentsRouter from "./routes/comments.router.js"
import PostsRouter from "./routes/posts.router.js"
import UsersRouter from "./routes/users.router.js"

dotenv.config()
const app = express()
app.use(morgan('tiny'))
app.use(express.json())

const PORT = process.env.PORT  ||3000
app.use("/comments", CommentsRouter)
app.use("/posts", PostsRouter)
app.use("/users", UsersRouter)
app.listen(PORT, ()=>{
    console.log("The server is running successfully!")
})
