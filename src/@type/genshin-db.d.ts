export interface QueryFunction<R> {
    <Q extends string, O extends QueryOptions>(query: Q, opts?: O):
        (O extends { matchCategories: true } ? (O extends { verboseCategories: true } ? R[] : string[]) : never) |
        (Q extends "names" ? (O extends { matchCategories: true } ? never : R | undefined) : R | undefined)
}

/* Logic
if matchCategories
  if verboseCategories
    add R[];
  else
    add string[];
else
  add never

if "names"
  if matchCategories
    add never
  else
    add R | undefined;
else
  add R | undefined;
*/

/* Test examples
characters("names", { matchCategories: true }); // string[]
characters("names", { matchCategories: true, verboseCategories: true }); // Character[]

characters("names"); // Character | undefined
characters("names", { matchCategories: false }); // Character | undefined
characters("foobar"); // Character | undefined
characters("foobar", { matchCategories: false }); // Character | undefined
characters("foobar", { verboseCategories: false }); // Character | undefined

characters("foobar", { matchCategories: true }); // Character | string[] | undefined
characters("foobar", { matchCategories: true, verboseCategories: true }); // Character | Character[] | undefined
*/

export interface StatFunction {
    (level: number, ascension?: number | '+' | '-'): StatResult;
}

export interface StatResult {
    level: number;
    ascension: number;
    hp?: number;
    attack?: number;
    defense?: number;
    specialized?: number;
}

//<MatchCategories extends boolean | undefined, Verbose extends boolean | undefined>
export interface QueryOptions {
    matchAliases?: boolean;
    matchCategories?: boolean;
    verboseCategories?: boolean;
    queryLanguages?: Languages[];
    resultLanguage?: Languages;
}

export enum Languages {
    ChineseSimplified  = "ChineseSimplified",
    ChineseTraditional = "ChineseTraditional",
    English            = "English",
    French             = "French",
    German             = "German",
    Indonesian         = "Indonesian",
    Japanese           = "Japanese",
    Korean             = "Korean",
    Portuguese         = "Portuguese",
    Russian            = "Russian",
    Spanish            = "Spanish",
    Thai               = "Thai",
    Vietnamese         = "Vietnamese"
}

// not easy to figure this out
//export const setOptions: (options: QueryOptions): void
//export const getOptions: ():

export const artifacts: QueryFunction<Artifact>;
export const characters: QueryFunction<Character>;
export const constellations: QueryFunction<Constellation>;
export const elements: QueryFunction<Element>;
export const rarity: QueryFunction<Rarity>;
export const foods: QueryFunction<Food>;
export const talentmaterialtypes: QueryFunction<TalentMaterial>;
export const talents: QueryFunction<Talent>;
export const weaponmaterialtypes: QueryFunction<WeaponMaterial>;
export const weapons: QueryFunction<Weapon>;
export const materials: QueryFunction<Material>;

//#region Artifact

export interface Artifact {
    name: string;
    rarity: string[];
    "1pc"?: string;
    "2pc"?: string;
    "4pc"?: string;
    flower?: ArtifactDetail;
    plume?: ArtifactDetail;
    sands?: ArtifactDetail;
    goblet?: ArtifactDetail;
    circlet: ArtifactDetail;
    images: {
        flower?: string;
        plume?: string;
        sands?: string;
        goblet?: string;
        circlet: string;
    };
    url: {
        fandom: string;
    };
}

// UNUSED. FOR REFERENCE ONLY.
// artifacts with 2pc and 4pc set effects
export interface ArtifactNormal {
    name: string;
    rarity: string[];
    "2pc": string;
    "4pc": string;
    flower: ArtifactDetail;
    plume: ArtifactDetail;
    sands: ArtifactDetail;
    goblet: ArtifactDetail;
    circlet: ArtifactDetail;
    images: {
        flower: string;
        plume: string;
        sands: string;
        goblet: string;
        circlet: string;
    };
    url: {
        fandom: string;
    };
}

// UNUSED. FOR REFERENCE ONLY.
// circlet artifacts
export interface ArtifactHeadSingle {
    name: string;
    rarity: string[];
    "1pc": string;
    circlet: ArtifactDetail;
    images: {
        circlet: string;
    };
    url: {
        fandom: string;
    };
}

export interface ArtifactDetail {
    name: string;
    relictype: string; // for different languages
    description: string;
}

//#endregion

//#region Character

export interface Character {
    name: string;
    aliases?: string[]; // currently unused
    title: string;
    description: string;
    rarity: string;
    element: string;
    weapontype: string;
    substat: string;
    gender: string; // manually translated
    body: string; // untranslated
    association: string; // untranslated
    region: string; // manual untranslated. empty string if player character
    affiliation: string; // empty string if player character
    birthdaymmdd: string; // empty string if player character
    birthday: string; // empty string if player character
    constellation: string;
    cv: {
        english: string;
        chinese: string;
        japanese: string;
        korean: string;
    };
    images: {
        image?: string;    // wikia
        card?: string;     // wikia
        portrait?: string; // wikia
        icon: string;     // hoyolab
        sideicon: string; // hoyolab
        cover1?: string; // official site
        cover2?: string; // official site
        "hoyolab-avatar"?: string; // manually entered from hoyolab
    };
    url: {
        fandom: string;
    };
    stats: StatFunction;
}

//#endregion

//#region Constellation

export interface Constellation {
    name: string;
    aliases?: string[];
    c1: ConstellationDetail;
    c2: ConstellationDetail;
    c3: ConstellationDetail;
    c4: ConstellationDetail;
    c5: ConstellationDetail;
    c6: ConstellationDetail;
    images: {
        c1: string;
        c2: string;
        c3: string;
        c4: string;
        c5: string;
        c6: string;
    };
}

export interface ConstellationDetail {
    name: string;
    effect: string;
}

//#endregion

//#region Misc

export interface Element {
    name: string;
    type: string;
    color: string;
    emoji: string;
    region: string;
    archon: string;
    theme: string;
    url: string;
}

export interface Rarity {
    name: string;
    emoji: string;
    image: string;
}

//#endregion

//#region Food

export interface Food {
    name: string;
    rarity: string;
    foodtype: string; // untranslated
    foodfilter: string;
    foodcategory: string; // untranslated
    effect: string;
    description: string;

    suspicious?: {
        effect: string;
        description: string;
    };
    normal?: {
        effect: string;
        description: string;
    };
    delicious?: {
        effect: string;
        description: string;
    };
    basedish?: string;
    character?: string;

    ingredients: FoodIngredient[];
    images?: {};
    url: {
        fandom: string;
    };
}

// UNUSED. FOR REFERENCE ONLY.
export interface FoodNormal {
    name: string;
    rarity: string;
    foodtype: 'NORMAL';
    foodfilter: string;
    foodcategory: string;
    effect: string;
    description: string;

    suspicious: {
        effect: string;
        description: string;
    };
    normal: {
        effect: string;
        description: string;
    };
    delicious: {
        effect: string;
        description: string;
    };

    ingredients: FoodIngredient[];
    images?: {};
    url: {
        fandom: string;
    };
}

// UNUSED. FOR REFERENCE ONLY.
export interface FoodSpecialty {
    name: string;
    rarity: string;
    foodtype: 'SPECIALTY';
    foodfilter: string;
    foodcategory: string;
    effect: string;
    description: string;

    basedish: string;
    character: string;

    ingredients: FoodIngredient[];
    images?: {};
    url: {
        fandom: string;
    };
}

export interface FoodIngredient {
    name: string;
    count: number;
}

//#endregion

//#region Talent

export interface Talent {
    name: string;
    aliases?: string[];
    combat1: CombatTalentDetail;
    combat2: CombatTalentDetail;
    combatsp?: CombatTalentDetail; // for mona
    combat3: CombatTalentDetail;
    passive1: PassiveTalentDetail;
    passive2: PassiveTalentDetail;
    passive3?: PassiveTalentDetail; // player character doesn't have a third talent
    costs: {
        "lvl2": Items[];
        "lvl3": Items[];
        "lvl4": Items[];
        "lvl5": Items[];
        "lvl6": Items[];
        "lvl7": Items[];
        "lvl8": Items[];
        "lvl9": Items[];
        "lvl10": Items[];
    }
    images?: { // images for talents aren't available yet
        combat1: string;
        combat2: string;
        combatsp: string;
        combat3: string;
        passive1: string;
        passive2: string;
        passive3: string;
    };
}

export interface CombatTalentDetail {
    name: string;
    info: string;
    description: string;
    attributes: {
        labels: string[];
        parameters: {
            [key: string]: number[];
        };
    };
}

export interface PassiveTalentDetail {
    name: string;
    info: string;
}

export interface Items {
    name: string;
    count: number;
}

//#endregion

//#region TalentMaterial

export interface TalentMaterial { // English only
    name: string;
    "2starname": string;
    "3starname": string;
    "4starname": string;
    day: string[];
    localtion: string;
    region: string;
    domainofmastery: string;
}

//#endregion

//#region Weapon

export interface Weapon {
    name: string;
    description: string;
    weapontype: string;
    rarity: string;
    baseatk: number;
    substat: string;
    subvalue: string;
    effectname: string;
    effect: string;
    r1: string[];
    r2: string[];
    r3: string[];
    r4: string[];
    r5: string[];
    weaponmaterialtype: string; // English only
    images: {
        image?: string; // wikia
        icon: string; // hoyolab
        awakenicon: string; // hoyolab
    };
    url: {
        fandom: string;
    };
    stats: StatFunction;
}

//#endregion

//#region WeaponMaterial

export interface WeaponMaterial { // English only
    name: string;
    "2starname": string;
    "3starname": string;
    "4starname": string;
    "5starname": string;
    day: string[];
    location: string;
    region: string;
    domainofforgery: string;
}

//#endregion

//#region Material

export interface Material {
    name: string;
    description: string;
    rarity?: string; // not every material has this
    category: string; // untranslated
    materialtype: string;
    dropdomain?: string;
    daysofweek?: string[];
    source: string[];

    images: {
        fandom?: string;
        redirect: string;
    };
    url: {
        fandom: string;
    };
}

//#endregion
