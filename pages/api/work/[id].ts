import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const worksId = req.query.id;
    if(req.method === 'DELETE') {
        const works = await prisma.work.delete({
            where: {id: Number(worksId)}
        })
        res.json(works)
    } else {
        console.log("Task could not be deleted");
    }

}