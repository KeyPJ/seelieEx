import React, {Fragment, useState} from "react";
import CharacterGoalTab from "./tabs/CharacterGoalTab";
import TalentGoalTab from "./tabs/TalentGoalTab";
import {addCharacter, batchUpdateCharacter, batchUpdateWeapon} from "../seelie";
import {getAccount, getDetailList, isGlobal} from "../hoyo";
import {Disclosure, Tab} from "@headlessui/react";
import {ChevronUpIcon} from '@heroicons/react/solid'
import ToggleSwitch from "./switch/ToggleSwitch";
import ListboxSelect from "./select/ListboxSelect";
import Role = mihoyo.Role;


function ExDialog() {

    const [gameBizSwitchEnabled, setGameBizSwitchEnabled] = useState(() => isGlobal())

    const onChangeGameBiz = (e: boolean) => {
        setGameBizSwitchEnabled(e)
        let gameBizNew = (!e) ? 'hk4e_cn' : 'hk4e_global';
        console.log(gameBizNew)
        localStorage.setItem("gameBiz", gameBizNew)
    };

    const [accountList, setAccountList] = useState<Role[]>([]);

    const [currentAccount, setCurrentAccount] = useState<Role>();

    const handleRoleSelectChange = (idx: number) => {
        setCurrentAccount(accountList[idx])
    }

    const accountShow = (idx: number) => {
        if (!accountList || !(accountList[idx])) {
            return '';
        }
        const role = accountList[idx];
        return `${role.game_uid}(${role.region})`
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
                console.log(`米游社数据无法判断是否突破,请自行比较整数等级是否已突破`)
                console.log(`角色信息同步完毕`)
                alert("角色信息同步完毕")
            }
        )
    }

    const [key, setKey] = useState('character');

    function classNames(...classes: string[]) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <div className="fixed top-10 inset-x-[20%] mx-auto min-w-[50%] min-h-min rounded-md bg-slate-700 opacity-75 text-white text-center z-[1200]">
            <h1 className="text-3xl font-bold underline pt-4">
                SeelieEX
            </h1>
            <div className="w-full p-4">
                <div className="w-full max-w-md p-2 mx-auto bg-purple rounded-2xl">
                    <Disclosure>
                        {({open}) => (
                            <>
                                <Disclosure.Button
                                    className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-slate-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                    <span>角色信息同步</span>
                                    <ChevronUpIcon
                                        className={`${
                                            open ? 'transform rotate-180' : ''
                                        } w-5 h-5 text-purple-500`}
                                    />
                                </Disclosure.Button>
                                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-white-500">
                                    <div className="flex pt-4">
                                        <div className="w-1/2 text-white-900">
                                            区服选择:
                                        </div>
                                        <ToggleSwitch
                                            className='w-1/2'
                                            checked={gameBizSwitchEnabled}
                                            onChange={onChangeGameBiz}
                                            labelLeft={'国服'}
                                            labelRight={'国际服'}
                                        />
                                    </div>
                                    <div className="flex pt-2">
                                        <div className="w-full">
                                            <button className="text-white bg-blue-500 px-4 py-2"
                                                    onClick={getAccountList}>获取账户信息
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex pt-4">
                                        <div className="w-1/2 text-white-900">
                                            账户选择:
                                        </div>
                                        <div className="w-1/2">
                                            <ListboxSelect
                                                selected={currentAccount ? accountList.indexOf(currentAccount) : 0}
                                                setSelected={handleRoleSelectChange}
                                                optionList={accountList.map((_, idx) => idx)}
                                                show={accountShow}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex pt-2">
                                        <div className="w-full">
                                            <button className="text-white bg-blue-500 px-4 py-2"
                                                    onClick={syncCharacterInfo}>同步mihoyo角色信息
                                            </button>
                                        </div>
                                    </div>
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                    <Disclosure as="div" className="mt-2">
                        {({open}) => (
                            <>
                                <Disclosure.Button
                                    className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-slate-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                    <span>规划批量操作</span>
                                    <ChevronUpIcon
                                        className={`${
                                            open ? 'transform rotate-180' : ''
                                        } w-5 h-5 text-purple-500`}
                                    />
                                </Disclosure.Button>
                                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-white-500">
                                    <Tab.Group>
                                        <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl">
                                            {['角色目标等级', '天赋目标等级', '武器目标等级'].map((category) => (
                                                <Tab
                                                    key={category}
                                                    className={({selected}) =>
                                                        classNames(
                                                            'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg',
                                                            'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                                                            selected
                                                                ? 'bg-white shadow'
                                                                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                                                        )
                                                    }
                                                >
                                                    {category}
                                                </Tab>
                                            ))}
                                        </Tab.List>
                                        <Tab.Panels>
                                            <Tab.Panel><CharacterGoalTab showText={'角色'} batchUpdateCharacter={batchUpdateCharacter}/></Tab.Panel>
                                            <Tab.Panel><TalentGoalTab/></Tab.Panel>
                                            <Tab.Panel><CharacterGoalTab showText={'武器'} batchUpdateCharacter={batchUpdateWeapon}/></Tab.Panel>
                                        </Tab.Panels>
                                    </Tab.Group>
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                </div>
            </div>
        </div>
    );
}

export default ExDialog;
