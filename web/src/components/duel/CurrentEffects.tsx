export function CurrentEffects({
    currenteffects,
}: {
    currenteffects: string[];
}) {
    return <div>{JSON.stringify(currenteffects)}</div>;
}
