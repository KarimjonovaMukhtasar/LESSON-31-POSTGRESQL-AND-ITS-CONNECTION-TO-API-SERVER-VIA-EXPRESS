import { client } from "../config/db.js"
const findAll = async (req, res) => {
    try {
        const query = `Select * from posts`
        const allPosts = await client.query(query)
        console.log(allPosts.rows)
        return res.status(200).json({
            message: `Successfully retrieved all posts info!`,
            posts: allPosts.rows
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
        const query = `Select * from posts where id = $1`
        const searchedId = await client.query(query, [id])
        if (searchedId.rows.length === 0) {
            return res.status(404).json({ message: `Not found such an id ${id}!` })
        }
        return res.status(200).json({
            message: `Successfully retrieved data ${id} numberes`,
            post: searchedId.rows[0]
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
        const { title, content, slug, user_id } = req.body
        const fields = []
        const values = []
        const userId = await client.query(`Select * from users where id = $1`, [user_id])
        if (userId.rows.length === 0) {
            return res.status(404).json({
                message: `Not found such a user Id!`,
                id: user_id
            })
        }
        if (title) {
            fields.push(`title = $${fields.length + 1}`)
            values.push(title)
        }
        if (content) {
            fields.push(`content = $${fields.length + 1}`)
            values.push(content)
        }
        if (slug) {
            fields.push(`slug = $${fields.length + 1}`)
            values.push(slug)
        }
        if (fields.length === 0) {
            return res.status(401).json({ message: `You must update at least one info of a post!` })
        }
        values.push(id)
        const query = `Update posts set ${fields.join(", ")} where id = $${values.length} returning *`
        const updatedPost = await client.query(query, values)
        if (updatedPost.rows.length === 0) {
            res.status(404).json({ message: `Not found such an id of an post ${id}` })
        }
        return res.status(200).json({
            message: `Successfully updated a post`,
            post: updatedPost.rows[0]
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
        const { title, content, slug, user_id } = req.body
        if (title && content && slug && user_id) {
            const body = [title, content, slug, user_id]
            const query = `Insert into posts (title, content, slug, user_id) values ($1,$2, $3, $4) returning *`
            const newPost = await client.query(query, body)
            console.log(newPost.rows[0])
            return res.status(201).json({
                message: `Successfully created a new Post`,
                post: newPost.rows[0]
            })
        }
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
        const query = `Delete from posts where id = $1`
        const deletedPost = await client.query(query, [id])
         if (deletedPost.rows.length === 0) {
            return res.status(200).json({ message: `Successfully deleted a post!`, post: deletedPost.rows[0] })
        }
         return res.status(400).json({message: `Not found such an id of a post`})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `ERROR IN THE SERVER` })
    }
}
const filterAll = async (req, res) => {
    try {
        const { page = 1, limit = 10, filter = "" } = req.query
        if (filter) {
            const offset = (page - 1) * limit
            const values = [`%${filter}%`, offset, limit]
            const query = `Select * from posts where title ilike $1 or content ilike $1 or slug ilike $1 offset $2 limit $3`
            const result = await client.query(query, values)
            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: `Not found such a filter among posts`,
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
            const query = `Select * from posts offset $1 limit $2`
            const result = await client.query(query, [offset, limit])
            return res.status(200).json({ message: "All posts (no filter)", result: result.rows })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `ERROR IN THE SERVER` })
    }
}
export { findAll, findOne, createOne, updateOne, deleteOne, filterAll }
