import { client } from "../config/db.js"
const findAll = async (req, res) => {
    try {
        const query = `Select * from users`
        const allUsers = await client.query(query)
        console.log(allUsers.rows)
        return res.status(200).json({
            message: `Successfully retrieved all users info!`,
            users: allUsers.rows
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
        const query = `Select * from users where id = $1`
        const searchedId = await client.query(query, [id])
        if (searchedId.rows.length === 0) {
            return res.status(404).json({ message: `Not found such an id ${id}!` })
        }
        return res.status(200).json({
            message: `Successfully retrieved data ${id} numberes`,
            user: searchedId.rows[0]
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
        const { first_name, email, last_name, password, phone_number, address } = req.body
        const fields = []
        const values = []
        if (first_name) {
            fields.push(`first_name = $${fields.length + 1}`)
            values.push(first_name)
        }
        if (email) {
            fields.push(`email = $${fields.length + 1}`)
            values.push(email)
        }
        if (last_name) {
            fields.push(`last_name = $${fields.length + 1}`)
            values.push(last_name)
        }
        if (password) {
            fields.push(`password = $${fields.length + 1}`)
            values.push(password)
        }
        if (phone_number) {
            fields.push(`phone_number = $${fields.length + 1}`)
            values.push(phone_number)
        }
        if (address) {
            fields.push(`address = $${fields.length + 1}`)
            values.push(address)
        }
        if (fields.length === 0) {
            return res.status(401).json({ message: `You must update at least one info of a user!` })
        }
        values.push(id)
        const query = `Update users set ${fields.join(", ")} where id = $${values.length} returning *`
        const updatedUser = await client.query(query, values)
        if (updatedUser.rows.length === 0) {
            return res.status(404).json({ message: `Not found such an id of an expense ${id}` })
        }
        return res.status(200).json({
            message: `Successfully updated an expense`,
            user: updatedUser.rows[0]
        })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            message: `SERVER ERROR!`,
            error: error.message
        })
    }
}
const createOne = async (req, res) => {
    try {
        const { first_name, email, last_name, password, phone_number, address } = req.body
        if (first_name && email && last_name && password && phone_number && address) {
            const body = [first_name, email, last_name, password, phone_number, address]
            const query = `Insert into users (first_name, email, last_name, password, phone_number, address) values ($1,$2, $3, $4, $5, $6) returning *`
            const newUser = await client.query(query, body)
            console.log(newUser.rows[0])
            return res.status(201).json({
                message: `Successfully created a new User`,
                user: newUser.rows[0]
            })
        }
        else {
            return res.status(400).json({ message: "Please fill in all required user fields!" })
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
        const query = `Delete from users where id = $1`
        const deletedUser = await client.query(query, [id])
        if (deletedUser.rows.length === 0) {
            return res.status(200).json({ message: `Successfully deleted a user!`, user: deletedUser.rows[0] })
        }
        return res.status(400).json({message: `Not found such an id of a user`})
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
            const query = `Select * from users where first_name ilike $1 or email ilike $1 or last_name ilike $1 or
            password ilike $1 or phone_number ilike $1 or address ilike $1 offset $2 limit $3`
            const result = await client.query(query, values)
            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: `Not found such a filter among users`,
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
            const query = `Select * from users offset $1 limit $2`
            const result = await client.query(query, [offset, limit])
            return res.status(200).json({ message: "All posts (no filter)", result: result.rows })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: `ERROR IN THE SERVER` })
    }
}
export { findAll, findOne, createOne, updateOne, deleteOne, filterAll }
