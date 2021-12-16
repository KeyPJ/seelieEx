import React, {useState} from "react";
import ReactDOM from 'react-dom';
import {batchUpdateCharacter, characterStatusList} from "../../seelie";
import CharacterStatus = seelie.CharacterStatus;

import {Button, Col, Form, Row, ToggleButton} from 'react-bootstrap';

function CharacterGoalTab() {

    const [selectAllRoles, setSelectAllRoles] = useState<boolean>(()=>true);

    const [characterLevelGoal, setCharacterLevelGoal] = useState<CharacterStatus>(()=>characterStatusList[0]);

    const handleCharacterLevelGoalSelectChange = (e: any) => {
        setCharacterLevelGoal(characterStatusList[e.target.value])
    }

    const batchSetCharacterGoalLevel = () => {
        console.log("批量设置角色目标等级")
        console.log(selectAllRoles)
        console.log(characterLevelGoal)
        batchUpdateCharacter(!selectAllRoles,characterLevelGoal)
        alert("角色目标等级设置完毕")
    }

    return <div>
        <Row>
            <Col>批量设置角色目标信息
                <ToggleButton
                    className="mb-2"
                    id="toggle-check-character"
                    type="checkbox"
                    variant="outline-primary"
                    checked={selectAllRoles}
                    value="0"
                    onChange={(e) => setSelectAllRoles(e.currentTarget.checked)}
                >
                    仅激活角色
                </ToggleButton>
            </Col>
        </Row>
        <Row>
            <Col>角色目标等级:
                <Form.Select
                    onChange={handleCharacterLevelGoalSelectChange}
                    defaultValue={0} className="character-level-goal-select">
                    {characterStatusList.map((characterStatus, index) => (
                        <option value={index} key={index}>{characterStatus.text.replace("A", "破")}</option>))}
                </Form.Select>
            </Col>
            <Col><Button onClick={batchSetCharacterGoalLevel}>批量设置角色目标等级</Button></Col>
        </Row>
    </div>
}

export default CharacterGoalTab;
