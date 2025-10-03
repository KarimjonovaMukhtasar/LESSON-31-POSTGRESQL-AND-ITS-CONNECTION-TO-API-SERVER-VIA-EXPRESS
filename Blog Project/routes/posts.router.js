import {Router} from "express"
const PostsRouter = Router()
import {findAll, findOne, createOne, updateOne, deleteOne, filterAll} from "../controllers/posts.controller.js"
PostsRouter.get("/search", filterAll)
PostsRouter.get("/", findAll)
PostsRouter.get("/:id", findOne)
PostsRouter.post("/",createOne)
PostsRouter.put("/:id/:user_id", updateOne)
PostsRouter.delete("/:id", deleteOne)


export default PostsRouter