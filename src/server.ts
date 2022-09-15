import express from "express";
import cors from "cors";
import { PrismaClient } from '@prisma/client'
import { convertHourStringToMinuts } from "./utils/convert-hour-string-to-minuts";
import { convertMinutesToHourString } from "./utils/convert-minutes-to-hour-string";

const app = express()
const prisma = new PrismaClient()

app.use(express.json())
app.use(cors({}))

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

app.post('/games/:id/ads', async (req, resp) => {
    const gameId = req.params.id
    const body: any = req.body

    const ad = await prisma.ad.create({
        data: {
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: convertHourStringToMinuts(body.hourStart),
            hourEnd: convertHourStringToMinuts(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel
        }
    })

    return resp.status(201).json(ad)
})

app.get('/games/:id/ads', async (req, resp) => {
    const gameId = req.params.id;
    const ads:any = await prisma.ad.findMany({
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
    
    return resp.json(ads.map((ad:any) => {
        return {
            ...ad,
            weekDays: ad.weekDays.split(','),
            hourStart: convertMinutesToHourString(ad.hourStart),
            hourEnd: convertMinutesToHourString(ad.hourEnd)
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