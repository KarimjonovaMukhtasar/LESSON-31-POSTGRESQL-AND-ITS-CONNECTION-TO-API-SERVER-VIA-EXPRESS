import { client } from "../config/db.js"
const findAll = async (req, res) => {
    try {
        const query = `Select * from users`
        const users = await client.query(query)
        console.log(users.rows)
        return res.status(200).json({
            message: `All users are retrieved!`,
            users: users.rows
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
        const query = `Select * from users where id = $1 `
        const user = await client.query(query, [id])
        if (user.rows.length === 0) {
            return res.status(404).json(`Not found such an id of a user!`)
        }
        return res.status(200).json({
            message: `FOUND SUCCESSFULLY!`,
            user: user.rows[0]
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
        const { username, email, password, age } = req.body
        if (username && email && password && age) {
            const values = [username, email, password, age]
            const query = `Insert into users (username, email, password, age) VALUES ($1,$2,$3, $4) returning *`
            const newUser = await client.query(query, values)
            return res.status(201).json({
                message: `A NEW USER CREATED SUCCESSFULLY`,
                user: newUser.rows[0]
            })
        }
        else {
            return res.status(401).json({ message: `FILL THE User's PROPERTIES FULLY!` })
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
        const { username, email,password,age } = req.body
        const { id } = req.params
        const userId = await client.query(`Select * from users where id = $1`, [id])
        if (userId.rows.length === 0) {
            return res.status(404).json({ message: `NOT FOUND SUCH AN ID OF A USER!` })
        }
        const fields = []
        const values = []
        if (username) {
            fields.push(`username=$${fields.length + 1}`)
            values.push(username)
        }
        if (email) {
            fields.push(`email = $${fields.length + 1}`)
            values.push(email)
        }
        if (age) {
            fields.push(`age=$${fields.length + 1}`)
            values.push(age)
        }
        if(password){
            fields.push(`password=$${fields.length + 1}`)
            values.push(password)
        }
        if (fields.length === 0) {
            return res.status(400).json({ message: "No fields provided to update." });
        }
        values.push(id)
        const query = `Update users Set ${fields.join(", ")} where id = $${values.length} returning *`
        const updatedUser = await client.query(query, values)
        return res.status(201).json({
            message: `SUCCESSFULLY UPDATED A User`,
            user: updatedUser.rows[0]
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
        const { id } = req.params
        const query = `Delete from users where id = $1 returning *`
        const deletedUser = await client.query(query, [id])
        if (deletedUser.rows.length === 0) {
            return res.status(404).json({ message: `NOT FOUND SUCH AN ID OF A User!` })
        }
        return res.status(200).json({ message: `Successfully Deleted a User!` })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: `Error in the server`,
            error: error.message
        })
    }
}
export { findAll, findOne, createOne, updateOne, deleteOne }