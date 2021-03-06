import React, {useState} from "react";
import {characterStatusList} from "../../seelie";
import CharacterStatus = seelie.CharacterStatus;

import ToggleSwitch from "../switch/ToggleSwitch";
import ListboxSelect from "../select/ListboxSelect";

interface IProps {
    showText: string,
    batchUpdateCharacter: Function
}

function CharacterGoalTab(props: IProps) {

    const {showText, batchUpdateCharacter} = props

    const [selectAllRoles, setSelectAllRoles] = useState<boolean>(() => true);

    const optionList = characterStatusList.slice(0).reverse();

    const [characterLevelGoal, setCharacterLevelGoal] = useState<CharacterStatus>(() => optionList[0]);

    const batchSetCharacterGoalLevel = () => {
        console.log(`批量设置${showText}目标等级`)
        console.log(selectAllRoles)
        console.log(characterLevelGoal)
        batchUpdateCharacter(!selectAllRoles, characterLevelGoal)
        alert(`${showText}目标等级设置完毕`)
    }

    return <div>
        <div className="flex pt-4">
            <ToggleSwitch
                className='w-full'
                checked={selectAllRoles}
                onChange={setSelectAllRoles}
                labelLeft={`全部${showText}`}
                labelRight={`仅激活${showText}`}
            />
        </div>
        <div className="flex pt-4">
            <div className="w-1/2 text-white-900">
                {showText}目标等级:
            </div>
            <div className="w-1/2">
                <ListboxSelect
                    selected={characterLevelGoal}
                    setSelected={setCharacterLevelGoal}
                    optionList={optionList}
                    show={characterStatus => `${characterStatus.text.replace("A", "破")}`}
                />
            </div>
        </div>
        <div className="flex pt-2">
            <div className="w-full">
                <button className="text-white bg-blue-500 px-4 py-2"
                        onClick={batchSetCharacterGoalLevel}>批量设置{showText}目标等级
                </button>
            </div>
        </div>
    </div>
}

export default CharacterGoalTab;
