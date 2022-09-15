import express from "express";
import { PrismaClient } from '@prisma/client'

const app = express()
app.use(express.json())
const prisma = new PrismaClient()


app.get('/games', async (req, resp) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true,
                }
            }
        }
    })
    return resp.json(games)
})

app.post('/games/:id/ads', (req, resp) => {
    const gameId = req.params.id
    const body = req.body
    console.log(body)

    return resp.status(201).json(body)
})

app.get('/games/:id/ads', async (req, resp) => {
    const gameId = req.params.id;
    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true,
        },
        where: {
            gameId,
        },
        orderBy: {
            createAt: 'desc',
        }
    })
    
    return resp.json(ads.map(ad => {
        return {
            ...ad,
            weekDays: ad.weekDays.split(','),
        }
    }))
})

app.get('/ads/:id/discord', async (req, resp) => {
    const adId = req.params.id;

    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true,
        },
        where: {
            id: adId,
        }
    })
    
    return resp.json({
        discord: ad.discord
    })
})

app.listen(3333)