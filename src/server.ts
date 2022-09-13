import express from "express";

const app = express()

app.get('/ads', (req, resp) => {
    return resp.json([
        {id: 1, name: "Carlos"},
        {id: 2, name: "Joaquin"},
        {id: 3, name: "Maria"},
        {id: 4, name: "João"},
        {id: 5, name: "Agar"},
    ])
})

app.listen(3333)