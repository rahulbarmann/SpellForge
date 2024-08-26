export function Spells({ ownedSpells }: { ownedSpells: string[] }) {
    return <div>{JSON.stringify(ownedSpells)}</div>;
}
