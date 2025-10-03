import pg from "pg"
const {Pool} = pg
const client = new Pool({
    user: "postgres",
    host: "localhost",
    password: "root",
    port: 5432,
    database: "comments" 
})

export {client}