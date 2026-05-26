const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 5000;
const SECRET = 'restaurant_secret_key';

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.db');

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            role TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS timesheets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            work_date TEXT,
            start_time TEXT,
            end_time TEXT,
            total_hours REAL,
            manager_comment TEXT,
            payment_status TEXT
        )
    `);

});

const managerPassword = bcrypt.hashSync('Owner@123', 10);
const employees = [

    ['john', 'John@123'],
    ['mike', 'Mike@123'],
    ['emma', 'Emma@123']

];

employees.forEach(emp => {

    const hashed =
        bcrypt.hashSync(emp[1], 10);

    db.run(
        `
        INSERT OR IGNORE INTO users
        (username, password, role)
        VALUES (?, ?, ?)
        `,
        [
            emp[0],
            hashed,
            'employee'
        ]
    );

});
db.run(
    `INSERT OR IGNORE INTO users(username, password, role)
     VALUES (?, ?, ?)`,
    ['owner', managerPassword, 'manager']
);
app.post('/signup', (req, res) => {

    const {
        username,
        password
    } = req.body;

    const hashedPassword =
        bcrypt.hashSync(password, 10);

    db.run(
        `
        INSERT INTO users
        (username, password, role)
        VALUES (?, ?, ?)
        `,
        [
            username,
            hashedPassword,
            'employee'
        ],
        function(err) {

            if (err) {

                return res.status(500).json({
                    message: 'Username already exists'
                });

            }

            res.json({
                message: 'Account created successfully'
            });

        }
    );

});
app.post('/login', (req, res) => {

    const { username, password } = req.body;

    db.get(
        `SELECT * FROM users WHERE username = ?`,
        [username],
        (err, user) => {

            if (!user) {
                return res.status(401).json({
                    message: 'User not found'
                });
            }

            const validPassword = bcrypt.compareSync(
                password,
                user.password
            );

            if (!validPassword) {
                return res.status(401).json({
                    message: 'Wrong password'
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.role
                },
                SECRET
            );

            res.json({
                token,
                role: user.role
            });

        }
    );

});
function authenticate(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'No token'
        });
    }

    const token = authHeader.split(' ')[1];

    try {

        const decoded = jwt.verify(token, SECRET);

        req.user = decoded;

        next();

    } catch {

        return res.status(401).json({
            message: 'Invalid token'
        });

    }

}

app.post('/timesheet', authenticate, (req, res) => {

    const {
        work_date,
        start_time,
        end_time
    } = req.body;

    const start = new Date(`1970-01-01T${start_time}`);

    const end = new Date(`1970-01-01T${end_time}`);

    const totalHours =
        (end - start) / (1000 * 60 * 60);

    db.run(
        `INSERT INTO timesheets
        (
            user_id,
            work_date,
            start_time,
            end_time,
            total_hours,
            manager_comment,
            payment_status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            req.user.id,
            work_date,
            start_time,
            end_time,
            totalHours,
            '',
            'Pending'
        ],
        function(err) {

            if (err) {

                return res.status(500).json(err);

            }

            res.json({
                message: 'Shift submitted'
            });

        }
    );

});
app.get('/my-timesheets', authenticate, (req, res) => {

    db.all(
        `SELECT * FROM timesheets
         WHERE user_id = ?`,
        [req.user.id],
        (err, rows) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(rows);

        }
    );

});
app.get('/all-timesheets', authenticate, (req, res) => {

    if (req.user.role !== 'manager') {

        return res.status(403).json({
            message: 'Access denied'
        });

    }

    db.all(
        `
        SELECT
            timesheets.*,
            users.username
        FROM timesheets
        JOIN users
        ON timesheets.user_id = users.id
        `,
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(rows);

        }
    );

});
app.get('/', (req, res) => {
    res.send('Restaurant Timesheet Backend Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});