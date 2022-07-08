const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3');

router.post("/name", (req, res) => {
    // Validate User Here
    // Then generate JWT Token
    let db_url = process.env.DB_URL || "data.db";
    let newdb = new sqlite3.Database(db_url,
        (err) => {
            if (err) res.send("error has occured");
        });
    let json = req.body;
    let data = {
            success: true
        }
    newdb.exec("insert into muilers (name) values ('" + json.name + "');", (r, err) => {
        if (err) {
            res.send(err);
            return;
        }
        

        
    });
    newdb.close();
    res.send(data);
});

router.post("/edge", (req, res) => {
    // Validate User Here
    // Then generate JWT Token
    let db_url = process.env.DB_URL || "data.db";
    let newdb = new sqlite3.Database(db_url,
        (err) => {
            if (err) res.send("error has occured");
        });
    let json = req.body;
    let data = {
            success: true
        }
    newdb.exec("insert into muilers_edge ('from','to',academie,vereining) values ('" + json.from + "','" + json.to + "','2022-2023','HKs');", (r, err) => {
        if (err) {
            res.send(err);
            return;
        }
    });
    newdb.close();
    res.send(data);
});

router.get("/name", (req, res) => {
    // Validate User Here
    // Then generate JWT Token
    let db_url = process.env.DB_URL || "data.db";
    let newdb = new sqlite3.Database(db_url,
        (err) => {
            if (err) res.send("error has occured");
        });
    let data = [];
    newdb.each("select * from muilers;", (err, r) => {
        if (err) {
            res.send(err);
            return;
        }

        data.push({ id: r.name, label: r.name });
    }, function () { // calling function when all rows have been pulled
        newdb.close(); //closing connection
        res.send({ names: data });
    });
});

router.get("/edge", (req, res) => {
    // Validate User Here
    // Then generate JWT Token
    let db_url = process.env.DB_URL || "data.db";
    let newdb = new sqlite3.Database(db_url,
        (err) => {
            if (err) res.send("error has occured");
        });

    let data = [];
    newdb.each("select * from muilers_edge;", (err, r) => {
        if (err) {
            res.send(err);
            return;
        }
        data.push({ from:r.from, to:r.to, jaar:r.academie });

    }, function () { // calling function when all rows have been pulled
        newdb.close(); //closing connection
        res.send({ edges: data });
    });
});

module.exports = router;