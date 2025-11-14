export function getNextLevelExp (level: number) {
    const baseExperience: number = 100;
    if(level < 2) return baseExperience
    return Math.floor(((level * baseExperience) ** 1.03) );
}