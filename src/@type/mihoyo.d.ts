declare namespace mihoyo {

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

    export interface Skill {
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
        skill_list: Skill[];
        weapon?: Weapon;
        reliquary_list: ReliquaryList[];
    }

    export interface CharacterDataEx extends CharacterData {
        character: Character
    }

    export interface Res<T> {
        retcode: number;
        message: string;
        data: Data<T>;
    }

    export interface HSRCharacterData {
        avatar: Avatar
        skills: HSRSkill[]
        skills_other: HSRSkill[]
        skills_servant: HSRSkill[]
        equipment: Equipment
        is_login: boolean
    }

    export interface Avatar {
        item_id: string
        item_name: string
        icon_url: string
        damage_type: string
        rarity: string
        avatar_base_type: string
        max_level: number
        cur_level: number
        target_level: number
        vertical_icon_url: string
    }

    export interface HSRSkill {
        point_id: string
        pre_point: string
        point_type: number
        anchor: string
        item_url: string
        max_level: number
        cur_level: number
        target_level: number
        progress: string
        min_level_limit: number
    }

    export interface Equipment {
        item_id: string
        item_name: string
        item_url: string
        avatar_base_type: string
        rarity: string
        max_level: number
        cur_level: number
        target_level: number
    }

}
