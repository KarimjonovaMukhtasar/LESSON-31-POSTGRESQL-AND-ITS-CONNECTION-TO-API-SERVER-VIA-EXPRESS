import express from "express"
import CommentsRouter from "./routes/comments.router.js"
import PostsRouter from "./routes/posts.router.js"
import UsersRouter from "./routes/users.router.js"

const app = express()

app.use(express.json())
app.use("/comments", CommentsRouter)
app.use("/posts", PostsRouter)
app.use("/users", UsersRouter)
app.listen(3000, ()=>{
    console.log("The server is running successfully!")
})
