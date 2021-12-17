import React, {useState} from "react";
import ReactDOM from 'react-dom';
import {mihoyo} from "../@type/mihoyo";
import Role = mihoyo.Role;

import {Button, ButtonGroup, Col, Form, Row, Tab, Tabs, ToggleButton} from 'react-bootstrap';
import CharacterGoalTab from "./tabs/CharacterGoalTab";
import TalentGoalTab from "./tabs/TalentGoalTab";
import WeaponGoalTab from "./tabs/WeaponGoalTab";
import {getAccount, getDetailList} from "../utils";
import {addCharacter} from "../seelie";

function ExDialog() {

    const radios = [
        { name: '国服(含渠道', value: 'hk4e_cn' },
        { name: '国际服', value: 'hk4e_global' },
    ];

    const [gameBiz, setGameBiz] = useState<string>("hk4e_cn");

    const onChangeGameBiz = (e: any) => {
        setGameBiz(e.currentTarget.value)
        localStorage.setItem("gameBiz", e.currentTarget.value)
    };

    const [accountList, setAccountList] = useState<Role[]>([]);

    const [currentAccount, setCurrentAccount] = useState<Role>();

    const handleRoleSelectChange = (e: any) => {
        setCurrentAccount(accountList[e.target.value])
    }

    const getAccountList = () => {
        getAccount().then(
            res => {
                const roles: mihoyo.Role[] = res;
                setAccountList(roles)
                roles.length > 0 && setCurrentAccount(roles[0])
            }
        ).catch(
            err => {
                console.error(err)
                console.error("账户信息获取失败")
                alert("账户信息获取失败")
            }
        )
    };

    const syncCharacterInfo = () => {
        if (!currentAccount) {
            console.error("账户信息获取失败")
            alert("账户信息获取失败")
            return
        }
        console.log("开始同步角色信息")
        const {game_uid, region} = currentAccount;
        getDetailList(game_uid, region).then(
            res => {
                console.group('返回数据');
                console.groupCollapsed('角色');
                console.table(res.map(a => a.character))
                console.groupEnd();
                console.groupCollapsed('武器');
                console.table(res.map(a => a.weapon))
                console.groupEnd();
                console.groupCollapsed('角色天赋');
                res.forEach(
                    c => {
                        const name = c.character.name;
                        console.groupCollapsed(name);
                        console.table(c.skill_list)
                        console.groupEnd();
                    }
                )
                console.groupEnd();
                console.groupEnd();
                res.forEach(
                    v => {
                        addCharacter(v)
                    }
                )
                alert("角色信息同步完毕")
            }
        )
    }

    const [key, setKey] = useState('character');

    return (
        <div className="ex-dialog">
            这里是SeelieEX操作界面
            <Row>
                <Col>区服选择:</Col>
                <Col>
                    <ButtonGroup>
                        {radios.map((radio, idx) => {
                            return (
                                <ToggleButton
                                    key={idx}
                                    id={`radio-${idx}`}
                                    type="radio"
                                    variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                                    name="radio"
                                    value={radio.value}
                                    checked={gameBiz === radio.value}
                                    onChange={onChangeGameBiz}
                                >
                                    {radio.name}
                                </ToggleButton>
                            );
                        })}
                    </ButtonGroup>
                </Col>
                <Col><Button onClick={getAccountList}>获取账户信息</Button></Col>
            </Row>
            <Row>
                <Col>账户选择:</Col>
                <Col>
                    <Form.Select onChange={handleRoleSelectChange} className="role-select">
                        {accountList.map((account, index) => (
                            <option value={index} key={index}>{account.game_uid}({account.region})</option>))}
                    </Form.Select>
                </Col>
                <Col><Button onClick={syncCharacterInfo}>同步mihoyo角色信息</Button></Col>
            </Row>
            <Row>
                <Col>
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={key}
                        onSelect={(k) => setKey(k as string)}
                        className="mb-3"
                    >
                        <Tab eventKey="character" title="批量设置角色目标等级">
                            <CharacterGoalTab/>
                        </Tab>
                        <Tab eventKey="talent" title="批量设置角色目标天赋">
                            <TalentGoalTab/>
                        </Tab>
                        <Tab eventKey="weapon" title="批量设置武器目标等级">
                            <WeaponGoalTab/>
                        </Tab>
                    </Tabs></Col></Row>
        </div>
    );
}

export default ExDialog;
