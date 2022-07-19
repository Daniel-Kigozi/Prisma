import { prisma } from "../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {task, complete} = req.body

    try {
        await prisma.work.create({
            data: {
                task,
                complete
            }
        })
        res.status(201).json({data: req.body, message: 'Created successfully'})
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(error)
    }
}