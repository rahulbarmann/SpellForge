interface PlayerCardParams {
    currenteffects: string[];
    healthpoints: number;
    ownedSpells: string[];
}

export function Player({
    currenteffects,
    healthpoints,
    ownedSpells,
}: PlayerCardParams) {
    return (
        <div className="flex flex-col">
            <div>Effects: {JSON.stringify(currenteffects)}</div>
            <div>HP: {healthpoints}</div>
            <div>Spells: {JSON.stringify(ownedSpells)}</div>
        </div>
    );
}
