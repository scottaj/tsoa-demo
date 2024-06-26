import {Body, Controller, Get, Path, Post, Query, Route, Tags} from "tsoa";
import {Spell, SpellManager, SpellSchool} from "./spell-manager";

@Route("v2/spells")
export class DemoTSOAController extends Controller {
    @Get()
    public async getAllSpells(
        @Query("level") level?: number,
        @Query("school") school?: SpellSchool
    ): Promise<Spell[]> {
        return await SpellManager.allSpells(level, school)
    }

    @Get('{name}')
    public async getSpellByName(@Path() name: string): Promise<Spell> {
        return await SpellManager.getSpellByName(name)
    }

    @Post()
    public async createSpell(@Body() spell: Spell): Promise<Spell> {
        return await SpellManager.createSpell(spell)
    }
}