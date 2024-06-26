import {Body, Controller, Deprecated, Example, Get, Hidden, Path, Post, Query, Response, Route, Tags} from "tsoa";
import {Spell, SpellManager, SpellSchool} from "./spell-manager";
import {ErrorResponse} from "./app";

@Route("v2/spells")
@Tags("Spells")
export class DemoTSOAController extends Controller {
    /**
     * Get a list of all spells, optionally filtered by level or school
     *
     * @param level Spell level, if specified only return spells of that level
     * @param school Spell School, if specified only return spells of that school
     *
     * @isInt level
     * @minimum level 0
     * @maximum level 9
     */
    @Get()
    @Example<Spell[]>([ DemoTSOAController.exampleSpell ])
    @Response<ErrorResponse>(500, "Server Error")
    public async getAllSpells(
        @Query("level") level?: number,
        @Query("school") school?: SpellSchool
    ): Promise<Spell[]> {
        return await SpellManager.allSpells(level, school)
    }

    @Get('{name}')
    @Deprecated()
    @Example<Spell>(DemoTSOAController.exampleSpell)
    @Response<ErrorResponse>(404, "Spell Not Found")
    @Response<ErrorResponse>(500, "Server Error")
    public async getSpellByName(@Path() name: string): Promise<Spell> {
        return await SpellManager.getSpellByName(name)
    }

    @Post()
    @Hidden()
    @Example<Spell>(DemoTSOAController.exampleSpell)
    @Response<ErrorResponse>(500, "Server Error")
    public async createSpell(@Body() spell: Spell): Promise<Spell> {
        return await SpellManager.createSpell(spell)
    }

    static exampleSpell: Spell = {
        name: "Feather Fall",
        level: 1,
        school: SpellSchool.TRANSMUTATION,
        description: "Choose up to five falling creatures within range. A falling creature’s rate of descent slows to 60 feet per round until the spell ends. If the creature lands before the spell ends, it takes no falling damage and can land on its feet, and the spell ends for that creature."
    }
}