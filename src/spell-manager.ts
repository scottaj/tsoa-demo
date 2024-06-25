import {NotFoundError} from "./errors";

export enum SpellSchool {
    ABJURATION = "ABJURATION",
    CONJURATION = "CONJURATION",
    DIVINATION = "DIVINATION",
    ENCHANTMENT = "ENCHANTMENT",
    EVOCATION = "EVOCATION",
    ILLUSION = "ILLUSION",
    NECROMANCY = "NECROMANCY",
    TRANSMUTATION = "TRANSMUTATION"
}

export enum ActionType {
    ACTION = "ACTION",
    BONUS_ACTION = "BONUS_ACTION",
    REACTION = "REACTION",
    MINUTE = "MINUTE"
}

export type Spell = {
    name: string,
    level: number
    description: string
    school: SpellSchool
}

async function allSpells(level?: number, school?: SpellSchool): Promise<Spell[]> {
    return spells.filter((s) => {
        if (level) {
            return s.level === level
        }

        return s
    }).filter((s) => {
        if (school) {
            return s.school === school
        }

        return s
    })
}

async function getSpellByName(name: string): Promise<Spell> {
    const spell = spells.find(s => s.name === name)

    if (!spell) {
        throw new NotFoundError(`No spell with name ${name} found`)
    }

    return spell
}

async function createSpell(spell: Spell): Promise<Spell> {
    spells.push(spell)
    return spell
}

export const SpellManager = {
    allSpells,
    getSpellByName,
    createSpell
}

const spells: Spell[] = [
    {
        name: "Fire Bolt",
        school: SpellSchool.EVOCATION,
        level: 0,
        description: "You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage. A flammable object hit by this spell ignites if it isn’t being worn or carried."
    },
    {
        name: "Bless",
        school: SpellSchool.ENCHANTMENT,
        level: 1,
        description: "You bless up to three creatures of your choice within range. Whenever a target makes an attack roll or a saving throw before the spell ends, the target can roll a d4 and add the number rolled to the attack roll or saving throw."
    },
    {
        name: "Misty Step",
        school: SpellSchool.CONJURATION,
        level: 2,
        description: "Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see."
    },
    {
        name: "Ice Feast",
        school: SpellSchool.CONJURATION,
        level: 6,
        description: "You conjure a feast of magical edible ice that can feed up to 12 creatures. For the next 24 hours any creature that eats the ice is cured of all diseases and poison, gains immunity to fire damage and the stunned condition, makes all constitution saving throws with advantage, and increases their hit point maximum and current hit points increase by 2d10. Due to the effort of eating so much freezing cold ice each creature also takes a level of exhaustion and 1d12 cold damage"
    }
]
