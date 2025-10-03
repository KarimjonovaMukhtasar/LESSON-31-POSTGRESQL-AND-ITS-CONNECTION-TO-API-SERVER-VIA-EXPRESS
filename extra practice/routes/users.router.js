import {Router} from "express"
import { findAll, findOne, createOne, updateOne, deleteOne } from "../controllers/users.controller.js"
const UsersRouter = Router()

UsersRouter.get("/", findAll)
UsersRouter.get("/:id", findOne)
UsersRouter.post("/", createOne)
UsersRouter.patch("/:id", updateOne)
UsersRouter.delete("/:id", deleteOne)

export {UsersRouter}