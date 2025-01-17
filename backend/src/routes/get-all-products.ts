import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';



export async function getAllProducts(req: Request, res: Response){
    try {
        const products = await prisma.products.findMany({
            orderBy: {
                createdAt: "asc",
            }
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message: `Server error: ${error}`});
        console.error(error);
        return;
    }
}