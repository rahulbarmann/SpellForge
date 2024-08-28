import { AttackType, map } from "./config";

export function calculateSpell(
    spellName: string,
    currentPlayerHP: number,
    otherPlayerHP: number
) {
    const stats = map(spellName);
    if (stats?.type === AttackType.attack) otherPlayerHP -= stats.dmg;
    else if (stats?.type === AttackType.defence) currentPlayerHP += stats.heal;
    return { currentPlayerHP, otherPlayerHP };
}
