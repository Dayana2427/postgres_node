import { pool } from '../db.js';

export const getUsers = async (req, res) => {
    const {rows} = await pool.query("SELECT * FROM users")
    res.json(rows)
};


export const getUser = async (req, res) => {
    const {id} = req.params
    const {rows} = await pool.query('SELECT * FROM users WHERE id = $1', [id])

    if (rows.length === 0) {
        return res.status (404).json ({massage: "User not found"})
    }

    res.json(rows[0])
};

export const createUser = async (req, res) => {
    try {
        const data = req.body
        const {rows} = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [data.name, data.email]);
        return res.status(201).json(rows[0])

    } catch (error) {
        console.log (error)
    
        if (error?.code ==="23505"){
            return res.status (409).json({message: "Email already exist"})
        }

        return res.status(500).json({massage: "Internal server error"})
    }
};

export const deleteUser = async (req, res) => {
    const {id} = req.params
    const {rows, rowCount} = await pool.query ('DELETE FROM users WHERE id = $1 RETURNING *', [id])
    console.log(rows)

    if (rowCount === 0) {
        return res.status (404).json ({massage: "User not found"})
    }
    
    return res.sendStatus (204)
} ;

export const updateUser = async (req, res) => {
    const {id} = req.params;
    const data = req.body;

    const {rows, rowCount} = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id =$3', [data.name, data.email, id]);

    if (rowCount === 0) {
        return res.status (404).json ({massage: "User not found"})
    }

    return res.json(rows[0])
};