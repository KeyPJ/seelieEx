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
        normal: 1,
        skill: 6,
        burst: 6
    });

    const talentLevels: number[] = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10
    ].reverse();

    const batchSetCharacterTalentLevel = () => {
        console.log("批量设置角色目标天赋")
        console.log(talentGoalLevel)
        const {normal, skill, burst} = talentGoalLevel;
        console.log(selectAllRoles)
        batchUpdateTalent(!selectAllRoles, normal, skill, burst)
        alert("角色目标天赋设置完毕")
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
                    selected={talentGoalLevel.normal}
                    setSelected={num => setTalentGoalLevel({
                        ...talentGoalLevel,
                        normal: num
                    })}
                    optionList={talentLevels}
                    show={num => `${num}`}
                />
            </div>
            <div className='mt-10'>元素战技</div>
            <div>
                <ListboxSelect
                    selected={talentGoalLevel.skill}
                    setSelected={num => setTalentGoalLevel({
                        ...talentGoalLevel,
                        skill: num
                    })}
                    optionList={talentLevels}
                    show={num => `${num}`}
                />
            </div>
            <div className='mt-10'>元素爆发</div>
            <div>
                <ListboxSelect
                    selected={talentGoalLevel.burst}
                    setSelected={num => setTalentGoalLevel({
                        ...talentGoalLevel,
                        burst: num
                    })}
                    optionList={talentLevels}
                    show={num => `${num}`}
                />
            </div>
        </div>
        <div className="flex pt-2">
            <div className="w-full">
                <button className="text-white bg-blue-500 px-4 py-2"
                        onClick={batchSetCharacterTalentLevel}>批量设置角色目标天赋
                </button>
            </div>
        </div>
    </div>
}

export default TalentGoalTab;
