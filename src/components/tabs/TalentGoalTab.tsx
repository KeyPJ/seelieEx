import React, {useState} from "react";
import ToggleSwitch from "../switch/ToggleSwitch";
import ListboxSelect from "../select/ListboxSelect";
import {AdapterManager} from '../../adapters/adapterManager';
import {GameType} from "../../adapters/game";

// 天赋配置：按游戏类型定义差异（类型、标签、最大等级）
const TALENT_CONFIG = {
    [GameType.GENSHIN]: {
        talentTypes: ["normal", "skill", "burst"], // 原神天赋类型
        labels: ["普通攻击", "元素战技", "元素爆发"], // 对应标签
        maxLevel: 10, // 原神天赋最大等级
    },
    [GameType.HSR]: {
        talentTypes: ["normal", "skill", "burst", "t"], // HSR行迹类型
        labels: ["普通攻击", "战技", "终结技", "天赋"], // HSR标签
        maxLevel: 10, // HSR行迹最大等级
    },
    [GameType.ZZZ]: {
        talentTypes: ["basic", "dodge", "assist", "special", "chain", "core"], // ZZZ技能类型
        labels: ["普通攻击", "闪避技", "支援技", "特殊技", "连携技", "核心被动"], // ZZZ标签
        maxLevel: 12, // ZZZ技能最大等级
    },
};

// 组件Props定义

function TalentGoalTab() {
    const currentGame = AdapterManager.getCurrentGameType();
    const {talentTypes, labels, maxLevel} = TALENT_CONFIG[currentGame] || TALENT_CONFIG[GameType.GENSHIN];

    // 动态初始化天赋等级状态（根据当前游戏的天赋类型）
    const [talentGoalLevel, setTalentGoalLevel] = useState(
        Object.fromEntries(talentTypes.map(type => [type, maxLevel - 1]))
    );
    const [selectAllRoles, setSelectAllRoles] = useState<boolean>(true);

    // 生成等级选项（1到maxLevel，倒序）
    const talentLevels = Array.from({length: maxLevel}, (_, i) => i + 1).reverse();

    // 批量更新天赋等级
    const handleBatchUpdate = () => {
        // 按配置顺序提取天赋等级（确保与适配器方法参数顺序一致）
        const levels = talentTypes.map(type => talentGoalLevel[type]);
        AdapterManager.getCurrentAdapter().batchUpdateTalent(!selectAllRoles, ...levels);
    };

    return (
        <div> {/* 移除外层 space-y-6 */}
            {/* 全选/仅激活角色开关（保留原布局） */}
            <div className="flex pt-4"> {/* 还原 pt-4 */}
                <ToggleSwitch
                    className='w-full'
                    checked={selectAllRoles}
                    onChange={setSelectAllRoles}
                    labelLeft="全部角色"
                    labelRight="仅激活角色"
                />
            </div>

            {/* 动态渲染天赋等级选择器（还原原网格布局） */}
            <div className="grid grid-rows-2 grid-flow-col gap-2"> {/* 还原原网格类 */}
                {talentTypes.map((type, index) => (
                    <div key={type} className="flex ex-flex-col items-center">
                        <label className="mt-10">{labels[index]}</label> {/* 还原 mt-10，移除 text-sm/mb-2 */}
                        <ListboxSelect
                            selected={talentGoalLevel[type]}
                            setSelected={num => setTalentGoalLevel({...talentGoalLevel, [type]: num})}
                            optionList={talentLevels}
                            show={num => `${num}`}
                        />
                    </div>
                ))}
            </div>

            {/* 批量更新按钮（还原原布局） */}
            <div className="flex pt-2"> {/* 还原 pt-2 */}
                <div className="w-full"> {/* 还原宽度控制 */}
                    <button
                        onClick={handleBatchUpdate}
                        className="text-white bg-blue-500 px-4 py-2"
                    >
                        批量设置角色目标技能
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TalentGoalTab;
