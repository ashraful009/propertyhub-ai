import {Request, Response} from 'express';
import {findPropertiesById} from '../repositories/compare.repository';

export const compareProperties = async(req: Request, res:Response): Promise<void> => {
    try{
        const {ids} = req.query;

        if(!ids || typeof ids !== 'string'){
            res.status(400).json({error: 'Please provide valid property IDs.'})
            return;
        }

        const idArray = ids.split(',');
        const properties = await findPropertiesById(idArray);

        res.status(200).json({
            success: true,
            count: properties.length,
            data: properties,
        })
    } catch(err){
        console.error('Error in compareProperties:', err);
        res.status(500).json({error: 'Internal Server Error'})
    }
};