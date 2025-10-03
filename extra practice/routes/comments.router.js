import {Router} from "express"
import { findAll, findOne, updateOne, createOne, deleteOne } from "../controllers/comments.controller.js"
const CommentsRouter = Router()

CommentsRouter.get("/", findAll)
CommentsRouter.get("/:id", findOne)
CommentsRouter.post("/", createOne)
CommentsRouter.patch("/:id/:user_id", updateOne)
CommentsRouter.delete("/:id", deleteOne)

export {CommentsRouter}