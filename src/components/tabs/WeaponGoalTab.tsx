import React, {useState} from "react";
import ReactDOM from 'react-dom';
import {batchUpdateWeapon, characterStatusList} from "../../seelie";
import CharacterStatus = seelie.CharacterStatus;

import {Button, Col, Form, Row, ToggleButton} from 'react-bootstrap';

function CharacterGoalTab() {

    const [selectAllWeapons, setSelectAllWeapons] = useState<boolean>(()=>true);

    const [weaponLevelGoal, setWeaponLevelGoal] = useState<CharacterStatus>(()=>characterStatusList[0]);


    const handleWeaponLevelGoalSelectChange = (e: any) => {
        setWeaponLevelGoal(characterStatusList[e.target.value])
    };
    const batchSetWeaponGoalLevel = () => {
        console.log("批量设置武器目标等级")
        console.log(weaponLevelGoal)
        batchUpdateWeapon(!selectAllWeapons,weaponLevelGoal);
        alert("武器目标等级设置完毕")
    }

    return <div>
        <Row>
            <Col>批量设置武器目标信息
                <ToggleButton
                    className="mb-2"
                    id="toggle-check-weapon"
                    type="checkbox"
                    variant="outline-primary"
                    checked={selectAllWeapons}
                    value="0"
                    onChange={(e) => setSelectAllWeapons(e.currentTarget.checked)}
                >
                    仅激活武器
                </ToggleButton>
            </Col>
        </Row>
        <Row>
            <Col>武器目标等级:
                <Form.Select
                    onChange={handleWeaponLevelGoalSelectChange}
                    defaultValue={0} className="weapon-level-goal-select">
                    {characterStatusList.map((characterStatus, index) => (
                        <option value={index} key={index}>{characterStatus.text.replace("A", "破")}</option>))}
                </Form.Select>
            </Col>
            <Col><Button onClick={batchSetWeaponGoalLevel}>批量设置武器目标等级</Button></Col>
        </Row>
    </div>
}

export default CharacterGoalTab;
