import { client } from "../config/db.js"
const findAll = async (req, res) => {
    try {
        const query = `Select * from comments returning *`
        const comments = await client.query(query)
        console.log(comments.rows)
        return res.status(200).json({
            message: `All comments are retrieved!`,
            comments: comments.rows
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: `Error in the server`,
            error: error.message
        })
    }
}
const findOne = async (req, res) => {
    try {
        const { id } = req.params
        const query = `Select * from comments where id = $1 returning *`
        const comment = await client.query(query, [id])
        if (comment.rows.length === 0) {
            return res.status(404).json(`Not found such an id of a commment!`)
        }
        return res.status(200).json({
            message: `FOUND SUCCESSFULLY!`,
            comment: comment.rows[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: `Error in the server`,
            error: error.message
        })
    }
}
const createOne = async (req, res) => {
    try {
        const { text, rating, userId } = req.body
        if (text && rating && userId) {
            const user = await client.query(`Select * from users where id = $1 returning *`, [userId])
            if (user.rows.length === 0) {
                return res.status(404).json({ message: `NOT FOUND SUCH AN ID OF A USER!` })
            }
            const values = [text, rating, userId]
            const query = `Insert into comments (text, rating, userId) VALUES ($1,$2,$3) returning *`
            const newComment = await client.query(query, values)
        }
        else {
            return res.status(401).json({ message: `FILL THE COMMENT PROPERTIES FULLY!` })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: `Error in the server`,
            error: error.message
        })
    }
}
const updateOne = async (req, res) => {
    try {
        const [text, rating, userId] = req.body
        const { id } = req.params
        const {user_id} = req.params
        const commentId = await client.query(`Select * from comments where id = $1 returning *`, [id])
        if (commentId.rows.length === 0) {
            return res.status(404).json({ message: `NOT FOUND SUCH AN ID OF A COMMENT!` })
        }
        const fields = []
        const values = []
        if (text) {
            fields.push(`text=${fields.length + 1}`)
            values.push(text)
        }
        if (rating) {
            fields.push(`rating = ${fields.length + 1}`)
            values.push(rating)
        }
        const userid = await client.query(`Select * from users where id = $1`, [user_id])
            if (userid.rows.length === 0) {
                return res.status(404).json(`NOT FOUND SUCH AN ID OF A USER, CHECK THE SPELLING!`)
            }
        values.push(id)
        const query = `Update comments Set ${fields.join(", ")} where id = $${values.length} returning *`
        const updatedComment = await client.query(query, values)
        return res.status(201).json({
            message: `SUCCESSFULLY UPDATED A COMMENT`,
            comment: updatedComment.rows[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: `Error in the server`,
            error: error.message
        })
    }
}
const deleteOne = async (req, res) => {
    try {
        const {id} = req.params
        const query = `Delete from comments where id = $1 returning *`
        const deletedComment = await client.query(query, [id])
        if(deletedComment.rows.length === 0){
            return res.status(404).json({message: `NOT FOUND SUCH AN ID OF A COMMENT!`})
        }
        return res.status(200).json({message: `Successfully Deleted a Comment!`})
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: `Error in the server`,
            error: error.message
        })
    }
}

export {findAll, findOne, createOne, updateOne, deleteOne}