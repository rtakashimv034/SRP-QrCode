import { prisma } from "../lib/prisma";
import { Request, Response } from "express";

export async function getAllWorkstations(req: Request, res: Response){
    try {
    const workstations = await prisma.workStations.findMany({
            orderBy: {
                id: "asc"
            }
        });
        res.status(200).json(workstations);
    } catch (error) {
        res.status(500).json({message: `Server error: ${error}`});
        console.error(error);
        return;
    }
}