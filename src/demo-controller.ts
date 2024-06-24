import express, {Request, Response} from "express";
import {Spell, SpellManager, SpellSchool} from "./spell-manager";

export const DemoRouter = express.Router()

DemoRouter.get("/", getAllSpells)
DemoRouter.get("/{name}", getSpellByName)
DemoRouter.post("/", createSpell)

async function getAllSpells(req: Request, res: Response): Promise<Response> {
    let level: number | undefined
    if (req.query.level) {
        level = Number(req.query.level)
    }
    const school: SpellSchool | undefined = req.query.school as SpellSchool

    const allSpells = await SpellManager.allSpells(level, school)
    return res.json(allSpells)
}

async function getSpellByName(req: Request, res: Response): Promise<Response> {
    const name = req.params.name
    const spell = await SpellManager.getSpellByName(name)

    return res.json(spell)
}

async function createSpell(req: Request, res: Response): Promise<Response> {
    const spell: Spell = req.body

    await SpellManager.createSpell(spell)
    return res.json(spell)
}
