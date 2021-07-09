export namespace mohoyo {

    export interface Role {
        game_biz: string;
        region: string;
        game_uid: string;
        nickname: string;
        level: number;
        is_chosen: boolean;
        region_name: string;
        is_official: boolean;
    }

    export interface Character {
        id: number;
        name: string;
        icon: string;
        weapon_cat_id: number;
        avatar_level: number;
        element_attr_id: number;
        max_level: number;
        level_current: number;
    }

    export interface SkillList {
        id: number;
        group_id: number;
        name: string;
        icon: string;
        max_level: number;
        level_current: number;
    }

    export interface Weapon {
        id: number;
        name: string;
        icon: string;
        weapon_cat_id: number;
        weapon_level: number;
        max_level: number;
        level_current: number;
    }

    export interface ReliquaryList {
        id: number;
        name: string;
        icon: string;
        reliquary_cat_id: number;
        reliquary_level: number;
        level_current: number;
        max_level: number;
    }

    export interface Data<T> {
        list: T[];
    }

    export interface CharacterData {
        skill_list?: SkillList[];
        weapon?: Weapon;
        reliquary_list?: ReliquaryList[];
    }

    export interface Res<T> {
        retcode: number;
        message: string;
        data: Data<T>;
    }

}
