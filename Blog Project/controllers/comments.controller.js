import { client } from "../config/db.js"
const findAll = async (req, res) => {
    try {
        const query = `Select * from comments`
        const allComments = await client.query(query)
        console.log(allComments.rows)
        return res.status(200).json({
            message: `Successfully retrieved all comments info!`,
            comments: allComments.rows
        })
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            message: "ERROR IN THE SERVER",
            error: error.message
        })
    }
}
const findOne = async (req, res) => {
    try {
        const { id } = req.params
        const query = `Select * from comments where id = $1`
        const searchedId = await client.query(query, [id])
        if (searchedId.rows.length === 0) {
            return res.status(404).json({ message: `Not found such an id ${id}!` })
        }
        return res.status(200).json({
            message: `Successfully retrieved data ${id} numbered`,
            comment: searchedId.rows[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            message: "ERROR IN THE SERVER",
            error: error.message
        })
    }
}
const updateOne = async (req, res) => {
    try {
        const { id } = req.params
        const {post_id} = req.params
        const { content} = req.body
        const fields = []
        const values = []
        const commentId = await client.query(`Select * from comments where id = $1`, [id])
        if (commentId.rows.length === 0) {
            return res.status(404).json({
                message: `Not found such a comment Id!`,
                id: id
            })
        }
        const postId = await client.query(`Select * from posts where id = $1`, [post_id])
        if (postId.rows.length === 0) {
            return res.status(404).json({
                message: `Not found such a post Id!`,
                id: post_id
            })
        }
        if (content) {
            fields.push(`content = $${fields.length + 1}`)
            values.push(content)
        }
        if (fields.length === 0) {
            return res.status(401).json({ message: `You must update at least one info of a comment!` })
        }
        values.push(id)
        const query = `Update comments set ${fields.join(", ")} where id = $${values.length} returning *`
        const updatedComment = await client.query(query, values)
        if (updatedComment.rows.length === 0) {
            return res.status(404).json({ message: `Not found such an id of a comment ${id}` })
        }
        return res.status(200).json({
            message: `Successfully updated a comment`,
            expense: updatedComment.rows[0]
        })
    }
    catch (error) {
        console.log(error)
        return res.status(501).json({
            message: `SERVER ERROR!`,
            error: error.message
        })
    }
}
const createOne = async (req, res) => {
    try {
        const { content, post_id, user_id } = req.body
        if (content && post_id && user_id) {
            const userId = await client.query(`Select * from users where id = $1`, [user_id])
            if (userId.rows.length === 0) {
                return res.status(404).json({
                    message: `Not found such a user Id!`,
                    id: post_id
                })
            }
            const postId = await client.query(`Select * from posts where id = $1`, [post_id])
            if (postId.rows.length === 0) {
                return res.status(404).json({
                    message: `Not found such a post Id!`,
                    id: post_id
                })
            }
            const body = [content, post_id, user_id]
            const query = `Insert into comments (content, post_id, user_id) values ($1,$2, $3) returning *`
            const newComment = await client.query(query, body)
            console.log(newComment.rows[0])
            return res.status(201).json({
                message: `Successfully created a new Comment`,
                comment: newComment.rows[0]
            })
        }
        return res.status(401).json({ message: `Please fill all the fields of a comment!` })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: `SERVER ERROR!`,
            error: error.message
        })
    }
}
const deleteOne = async (req, res) => {
    try {
        const { id } = req.params
        const query = `Delete from comments where id = $1 returning *`
        const deletedComment = await client.query(query, [id])
        if (deletedComment.rows.length === 0) {
            return res.status(400).json({ message: `Not found such an id of a comment` })
        }
        return res.status(200).json({ message: `Successfully deleted a comment!`, user: deletedComment.rows[0] })
    } catch (error) {
        console.log(error)
        return res.status(501).json({ message: `ERROR IN THE SERVER` })
    }
}
const filterAll = async (req, res) => {
    try {
        const { page = 1, limit = 10, filter = "" } = req.query
        if (filter) {
            const offset = (page - 1) * limit
            const values = [`%${filter}%`, offset, limit]
            const query = `Select * from comments where content ilike $1 offset $2 limit $3`
            const result = await client.query(query, values)
            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: `Not found such a filter among comments`,
                    filter: filter
                })
            }
            return res.status(200).json({
                message:
                    `Successfully found of the filtered search`,
                total: result.rows.length,
                page,
                limit,
                result: result.rows
            })
        }
        else {
            const offset = (page - 1) * limit
            const query = `Select * from comments offset $1 limit $2`
            const result = await client.query(query, [offset, limit])
            return res.status(200).json({ message: "All comments (no filter)", result: result.rows })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `ERROR IN THE SERVER` })
    }
}
export { findAll, findOne, createOne, updateOne, deleteOne, filterAll }
