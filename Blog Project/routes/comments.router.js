import {Router} from "express"
const CommentsRouter = Router()
import {findAll, findOne, createOne, updateOne, deleteOne, filterAll} from "../controllers/comments.controller.js"
CommentsRouter.get("/search", filterAll)
CommentsRouter.get("/", findAll)
CommentsRouter.get("/:id", findOne)
CommentsRouter.post("/",createOne)
CommentsRouter.put("/:id", updateOne)
CommentsRouter.delete("/:id", deleteOne)


export default CommentsRouter