export interface CharacterAssets {
    idle?: string;
    walk?: string;
    run?: string;
    sleep?: string;
    think?: string;
    celebrate?: string;
    surprised?: string;
    drag?: string;
    talk?: string;
}
export interface CharacterPack {
    id?: string;
    name?: string;
    size?: number;
    assets?: CharacterAssets;
}
export interface Config {
    character?: CharacterPack;
}
export declare function apply(): void;
