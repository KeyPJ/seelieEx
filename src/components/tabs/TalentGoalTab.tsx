import React, {useState} from "react";
import ReactDOM from 'react-dom';
import {batchUpdateTalent} from "../../seelie";

import {Button, Col, Form, Row, ToggleButton} from 'react-bootstrap';

function TalentGoalTab() {

    const [selectAllRoles, setSelectAllRoles] = useState<boolean>(()=>true);

    const [talentGoalLevel, setTalentGoalLevel] = useState( {
        normal: 1,
        skill: 1,
        burst: 1
    });

    const talentLevels: number[] = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10
    ]

    const batchSetCharacterTalentLevel = () => {
        console.log("批量设置角色目标天赋")
        console.log(talentGoalLevel)
        const {normal, skill, burst} = talentGoalLevel;
        console.log(selectAllRoles)
        batchUpdateTalent(!selectAllRoles, normal, skill, burst)
        alert("角色目标天赋设置完毕")
    }

    return <div>
        <Row>
            <Col>批量设置角色目标天赋
                <ToggleButton
                    className="mb-2"
                    id="toggle-check-talent"
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
            <Col>普通攻击目标等级:
                <Form.Select onChange={event => setTalentGoalLevel({
                    ...talentGoalLevel,
                    normal: +event.target.value
                })}
                             className="character-level-goal-select">
                    {talentLevels.map((level) => (
                        <option value={level} key={level}>{level}</option>))}
                </Form.Select>
            </Col>
            <Col>元素战技目标等级:
                <Form.Select onChange={event => setTalentGoalLevel({
                    ...talentGoalLevel,
                    skill: +event.target.value
                })}
                             className="character-level-goal-select">
                    {talentLevels.map((level) => (
                        <option value={level} key={level}>{level}</option>))}
                </Form.Select>
            </Col>
            <Col>元素爆发目标等级:
                <Form.Select onChange={event => setTalentGoalLevel({
                    ...talentGoalLevel,
                    burst: +event.target.value
                })}
                             className="character-level-goal-select">
                    {talentLevels.map((level) => (
                        <option value={level} key={level}>{level}</option>))}
                </Form.Select>
            </Col>
            <Col><Button onClick={batchSetCharacterTalentLevel}>批量设置角色目标天赋</Button></Col>
        </Row>
    </div>
}

export default TalentGoalTab;
