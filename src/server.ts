import express from "express";
import { PrismaClient } from '@prisma/client'

const app = express()

app.get('/games', (req, resp) => {
    return resp.json([])
})

app.post('/ads', (req, resp) => {
    return resp.status(201).json([])
})

app.get('/games/:id/ads', (req, resp) => {
    // const gameId = req.params.id;
    
    return resp.json([
        {id: 1, name: "Carlos"},
        {id: 2, name: "Joaquin"},
        {id: 3, name: "Maria"},
        {id: 4, name: "João"},
        {id: 5, name: "Agar"},
    ])
})

app.get('/ads/:id/discord', (req, resp) => {
    // const gameId = req.params.id;
    
    return resp.json([])
})

app.listen(3333)