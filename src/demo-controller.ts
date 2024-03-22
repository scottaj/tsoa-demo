import {Body, Controller, Get, Middlewares, Path, Post, Route} from "tsoa";
import {NextFunction, Request, Response} from "express";

import {NotFoundError, UnauthorizedError} from "./errors";

export enum StuffType {
    GOOD = 'GOOD',
    BAD = 'BAD',
    MEH = 'MEH'
}

export type StuffDetails = {
    id: string
    barcode: string
    type: StuffType
}

export type SomeCoolStuff = {
    id: string
    name: string
    quantity: number
    details: StuffDetails[]
}

const data: SomeCoolStuff[] = []

const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('x-api-key')
    if (token !== 'abc123') {
        throw new UnauthorizedError('Not authorized, get out')
    }

    next()
}

@Route("demo")
export class DemoController extends Controller {
    @Get('unauthenticated')
    public async unauthenticated(): Promise<SomeCoolStuff[]> {
        return data
    }

    @Get('authenticated/{id}')
    @Middlewares(auth)
    public async authenticated(@Path() id: string): Promise<SomeCoolStuff> {
        const record = data.find((d) => d.id === id)
        if (!record) {
            throw new NotFoundError('Record not found');
        }
        return record;
    }

    @Post('authenticated')
    @Middlewares(auth)
    public async save(@Body() request: SomeCoolStuff): Promise<void> {
        const existing = await this.authenticated(request.id)

        if (existing) {
            throw new Error(`Record with id ${request.id} already exists`)
        }

        data.push(request)

        return this.setStatus(204)
    }
}