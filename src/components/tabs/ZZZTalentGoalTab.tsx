import React, {useState} from "react";

import ToggleSwitch from "../switch/ToggleSwitch";
import ListboxSelect from "../select/ListboxSelect";

interface IProps {
    batchUpdateTalent: Function
}

function TalentGoalTab(props: IProps) {

    const {batchUpdateTalent} = props

    const [selectAllRoles, setSelectAllRoles] = useState<boolean>(() => true);

    const [talentGoalLevel, setTalentGoalLevel] = useState({
        basic: 11,
        dodge: 11,
        assist: 11,
        special: 11,
        chain: 11,
        core: 6,
    });

    const talentLevels: number[] = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
    ].reverse();

    const batchSetCharacterTalentLevel = () => {
        const {basic, dodge, assist, special, chain, core} = talentGoalLevel;
        batchUpdateTalent(!selectAllRoles, basic, dodge, assist, special, chain, core)
    }

    return <div>
        <div className="flex pt-4">
            <ToggleSwitch
                className='w-full'
                checked={selectAllRoles}
                onChange={setSelectAllRoles}
                labelLeft={'全部角色'}
                labelRight={'仅激活角色'}
            />
        </div>
        <div className="grid grid-rows-2 grid-flow-col gap-2">
            <div className='mt-10'>普通攻击</div>
            <div>
                <ListboxSelect
                    selected={talentGoalLevel.basic}
                    setSelected={num => setTalentGoalLevel({
                        ...talentGoalLevel,
                        basic: num
                    })}
                    optionList={talentLevels}
                    show={num => `${num}`}
                />
            </div>
            <div className='mt-10'>闪避技</div>
            <div>
                <ListboxSelect
                    selected={talentGoalLevel.dodge}
                    setSelected={num => setTalentGoalLevel({
                        ...talentGoalLevel,
                        dodge: num
                    })}
                    optionList={talentLevels}
                    show={num => `${num}`}
                />
            </div>
            <div className='mt-10'>支援技</div>
            <div>
                <ListboxSelect
                    selected={talentGoalLevel.assist}
                    setSelected={num => setTalentGoalLevel({
                        ...talentGoalLevel,
                        assist: num
                    })}
                    optionList={talentLevels}
                    show={num => `${num}`}
                />
            </div>
            <div className='mt-10'>特殊技</div>
            <div>
                <ListboxSelect
                    selected={talentGoalLevel.special}
                    setSelected={num => setTalentGoalLevel({
                        ...talentGoalLevel,
                        special: num
                    })}
                    optionList={talentLevels}
                    show={num => `${num}`}
                />
            </div>
            <div className='mt-10'>连携技</div>
            <div>
                <ListboxSelect
                    selected={talentGoalLevel.chain}
                    setSelected={num => setTalentGoalLevel({
                        ...talentGoalLevel,
                        chain: num
                    })}
                    optionList={talentLevels}
                    show={num => `${num}`}
                />
            </div>
            <div className='mt-10'>核心被动</div>
            <div>
                <ListboxSelect
                    selected={talentGoalLevel.core}
                    setSelected={num => setTalentGoalLevel({
                        ...talentGoalLevel,
                        core: num
                    })}
                    optionList={talentLevels}
                    show={num => `${num}`}
                />
            </div>
        </div>

        <div className="flex pt-2">
            <div className="w-full">
                <button className="text-white bg-blue-500 px-4 py-2"
                        onClick={batchSetCharacterTalentLevel}>批量设置角色目标技能
                </button>
            </div>
        </div>
    </div>
}

export default TalentGoalTab;
