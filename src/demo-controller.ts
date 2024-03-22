import {Body, Controller, Get, Middlewares, Path, Post, Response, Route} from "tsoa";
import {NotFoundError, UnauthorizedError} from "./errors";
import express from "express";

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

export type ErrorResponse = {
    message: string
}

const data: SomeCoolStuff[] = []

const auth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.header('x-api-key')
    if (token !== 'abc123') {
        throw new UnauthorizedError('Not authorized, get out')
    }

    next()
}

@Route("demo")
export class DemoController extends Controller {
    /**
     * This description will end up in the API doc
     */
    @Get('unauthenticated')
    public async unauthenticated(): Promise<SomeCoolStuff[]> {
        return data
    }

    /**
     * This endpoint requires an API key
     * @param id the id of the record
     */
    @Get('authenticated/{id}')
    @Middlewares(auth)
    @Response<ErrorResponse>(401, 'Auth key not found or invalid', {message: 'Not authorized, get out'})
    @Response<ErrorResponse>(404, 'The ID is not found', {message: 'record not found'})
    public async authenticated(@Path() id: string): Promise<SomeCoolStuff> {
        const record = data.find((d) => d.id === id)
        if (!record) {
            throw new NotFoundError('Record not found');
        }
        return record;
    }

    @Post('authenticated')
    @Middlewares(auth)
    @Response<ErrorResponse>(401, 'Auth key not found or invalid', {message: 'Not authorized, get out'})
    @Response<ErrorResponse>(500, 'The record already exists', {message: 'Something went wrong'})
    public async save(@Body() request: SomeCoolStuff): Promise<void> {
        const existing = await this.authenticated(request.id)

        if (existing) {
            throw new Error(`Record with id ${request.id} already exists`)
        }

        data.push(request)

        return this.setStatus(204)
    }
}