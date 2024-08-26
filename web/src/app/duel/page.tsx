import { Player } from "@/components/duel/Player";

export default function Duel() {
    return (
        <div className="flex justify-around">
            <Player
                currenteffects={[]}
                healthpoints={100}
                ownedSpells={["bankai", "sharingan", "kamehameha"]}
            />
            <Player
                currenteffects={[]}
                healthpoints={100}
                ownedSpells={[
                    "domain expansion",
                    "gomu gomu no",
                    "hinokami kagura",
                ]}
            />
        </div>
    );
}
