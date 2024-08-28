interface SpellParams {
    spellName: string;
    type: AttackType;
    dmg: number;
    heal: number;
}

export enum AttackType {
    attack,
    defence,
}

const SpellCollection: SpellParams[] = [
    {
        spellName: "fireball",
        type: AttackType.attack,
        dmg: 10,
        heal: 0,
    },
    {
        spellName: "holylight",
        type: AttackType.defence,
        dmg: 0,
        heal: 20,
    },
];

export function map(spellName: string): undefined | SpellParams {
    let spell;
    SpellCollection.forEach((e) => {
        if (e.spellName === spellName) spell = e;
    });
    return spell;
}
