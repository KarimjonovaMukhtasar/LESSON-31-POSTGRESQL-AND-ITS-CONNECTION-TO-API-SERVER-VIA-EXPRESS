import {Router} from "express"
const UsersRouter = Router()
import {findAll, findOne, createOne, updateOne, deleteOne, filterAll} from "../controllers/users.controller.js"
UsersRouter.get("/search", filterAll)
UsersRouter.get("/", findAll)
UsersRouter.get("/:id", findOne)
UsersRouter.post("/",createOne)
UsersRouter.put("/:id", updateOne)
UsersRouter.delete("/:id", deleteOne)


export default UsersRouter