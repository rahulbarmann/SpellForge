"use client";

import { SpellsArray } from "@/lib/constants";
import { useMemo, useState } from "react";

function getRandomCID(arr: any, num: any) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

export function SpellSelection({ setIsFirstLoad }: any) {
    const [selectedSpells, setSelectedSpells] = useState<any>([]);

    const randomCIDs = useMemo(() => getRandomCID(SpellsArray, 5), []);

    const toggleSpell = (index: number) => {
        setSelectedSpells((prevSelected: any) => {
            const isCurrentlySelected = prevSelected.includes(index);
            if (isCurrentlySelected) {
                return prevSelected.filter((i: any) => i !== index);
            } else if (prevSelected.length < 3) {
                return [...prevSelected, index];
            }
            return prevSelected;
        });
    };

    const ContinueButton = () => (
        <div>
            <button
                disabled={selectedSpells.length !== 3}
                onClick={() => setIsFirstLoad(false)}
            >
                Continue
            </button>
        </div>
    );

    const SpellCard = ({ spellImage, index }: any) => {
        const isSelected = selectedSpells.includes(index);
        const css = isSelected ? "outline outline-blue-500" : "";

        return (
            <div className={css}>
                <button onClick={() => toggleSpell(index)}>{spellImage}</button>
            </div>
        );
    };

    return (
        <div>
            <p>Selected Spells: {selectedSpells.length}</p>
            <div className="flex flex-col">
                {randomCIDs.map((spellImage, index) => (
                    <SpellCard
                        key={index}
                        spellImage={spellImage}
                        index={index}
                    />
                ))}
            </div>
            <ContinueButton />
        </div>
    );
}
