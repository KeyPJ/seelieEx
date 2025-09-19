import React, {useState, useRef, useEffect} from "react";
import ListboxSelect from "./select/ListboxSelect";
import CharacterGoalTab from "./tabs/CharacterGoalTab";
import TalentGoalTab from "./tabs/TalentGoalTab";
import {AdapterManager} from '../adapters/adapterManager';
import {refreshPage} from "../adapters/common";

interface IProps {
    onClose: () => void
}

function ExDialog(props: IProps) {
    const {onClose} = props;

    const currentAdapter = AdapterManager.getCurrentAdapter();
    // 页面加载时自动显示当前游戏名称
    useEffect(() => {
        console.log(`当前游戏：${currentAdapter.getGameName()}`);
    }, [currentAdapter]);

    const [accountList, setAccountList] = useState<mihoyo.Role[]>([]);
    const [currentAccount, setCurrentAccount] = useState<mihoyo.Role>();
    const [isFirstPanelOpen, setIsFirstPanelOpen] = useState(false);
    const [isSecondPanelOpen, setIsSecondPanelOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false); // 添加 loading 状态
    const panelRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

    // 点击外部关闭面板
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                panelRefs[0].current &&
                !panelRefs[0].current.contains(e.target as Node) &&
                isFirstPanelOpen
            ) {
                setIsFirstPanelOpen(false);
            }
            if (
                panelRefs[1].current &&
                !panelRefs[1].current.contains(e.target as Node) &&
                isSecondPanelOpen
            ) {
                setIsSecondPanelOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isFirstPanelOpen, isSecondPanelOpen]);

    const handleRoleSelectChange = (idx: number) => {
        setCurrentAccount(accountList[idx]);
    };

    const accountShow = (idx: number) => {
        if (!accountList || !accountList[idx]) {
            return "";
        }
        const role = accountList[idx];
        return `${role.game_uid}(${role.region})`;
    };

    const getAccountList = () => {
        currentAdapter.getAccounts()
            .then((res) => {
                const roles: mihoyo.Role[] = res;
                setAccountList(roles);
                roles.length > 0 && setCurrentAccount(roles[0]);
            })
            .catch((err) => {
                console.error(err);
                console.error("账户信息获取失败");
                alert("账户信息获取失败");
            });
    };

    const syncCharacterInfo = () => {
        if (!currentAccount) {
            console.error("账户信息获取失败");
            alert("账户信息获取失败");
            return;
        }
        console.log("开始同步角色信息");
        setIsSyncing(true); // 开始同步时设置 loading 状态
        const {game_uid, region} = currentAccount;
        currentAdapter.getCharacterDetails(game_uid, region)
            .then((res) => {
                currentAdapter.syncCharacters(res);
                console.log("米游社数据无法判断是否突破,请自行比较整数等级是否已突破");
                console.log("角色信息同步完毕");
                refreshPage()
            })
            .catch((err) => {
                console.error("同步失败:", err);
                GM_openInTab(currentAdapter.getApiConfig().BBS_URL)
            })
            .finally(() => {
                setIsSyncing(false); // 同步完成后设置 loading 状态为 false
            });
    };

    function classNames(...classes: string[]) {
        return classes.filter(Boolean).join(" ");
    }

    // 添加鼠标移出事件处理函数
    const handleMouseLeave = () => {
        setIsFirstPanelOpen(false);
        setIsSecondPanelOpen(false);
        onClose()
    };

    return (
        <div
            className="fixed top-10 inset-x-[20%] mx-auto min-w-[50%] min-h-min rounded-md bg-slate-800/90 text-white text-center z-[1200] shadow-2xl"
            onMouseLeave={handleMouseLeave}>
            <h1 className="text-3xl font-bold underline pt-4 text-white">SeelieEX</h1>
            <div className="w-full p-4">
                <div className="w-full max-w-md p-2 mx-auto bg-purple-900/30 rounded-2xl border border-purple-700/50">
                    {/* 第一个折叠面板 - 角色信息同步 */}
                    <div ref={panelRefs[0]} className="mt-2 border border-gray-700 rounded-lg bg-slate-700/50">
                        <button
                            className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-white bg-purple-800/70 rounded-lg hover:bg-purple-700 focus:outline-none transition-colors"
                            onClick={() => setIsFirstPanelOpen(!isFirstPanelOpen)}
                        >
                            <span>角色信息同步</span>
                            <svg
                                className={`w-5 h-5 text-purple-300 transition-transform ${
                                    isFirstPanelOpen ? "transform rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {isFirstPanelOpen && (
                            <div className="px-4 pt-4 pb-2 text-sm text-gray-100">
                                <div className="flex pt-2">
                                    <div className="w-full">
                                        <button
                                            className="text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded transition-colors"
                                            onClick={getAccountList}
                                        >
                                            获取账户信息
                                        </button>
                                    </div>
                                </div>

                                <div className="flex pt-4">
                                    <div className="w-1/2 text-gray-200">
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
                                        <button
                                            className="text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded transition-colors"
                                            onClick={syncCharacterInfo}
                                            disabled={isSyncing} // 禁用按钮当 loading 为 true
                                        >
                                            {isSyncing ? '同步中...' : '同步mihoyo角色信息'}
                                        </button>
                                        {/* 添加 loading 状态显示 */}
                                        {isSyncing && (
                                            <div className="mt-2 text-blue-300">
                                                正在同步角色信息，请稍候...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 第二个折叠面板 - 规划批量操作 */}
                    <div ref={panelRefs[1]} className="mt-2 border border-gray-700 rounded-lg bg-slate-700/50">
                        <button
                            className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-white bg-purple-800/70 rounded-lg hover:bg-purple-700 focus:outline-none transition-colors"
                            onClick={() => setIsSecondPanelOpen(!isSecondPanelOpen)}
                        >
                            <span>规划批量操作</span>
                            <svg
                                className={`w-5 h-5 text-purple-300 transition-transform ${
                                    isSecondPanelOpen ? "transform rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {isSecondPanelOpen && (
                            <div className="px-4 pt-4 pb-2 text-sm text-gray-100">
                                {/* 标签页切换 */}
                                <div className="mt-4">
                                    <div className="flex border-b border-gray-600">
                                        {["角色目标等级", "天赋目标等级", "武器目标等级"].map(
                                            (title, idx) => (
                                                <button
                                                    key={idx}
                                                    className={classNames(
                                                        "px-4 py-2 focus:outline-none transition-colors",
                                                        activeTab === idx
                                                            ? "border-b-2 border-blue-400 text-blue-300 font-medium"
                                                            : "text-gray-300 hover:text-white"
                                                    )}
                                                    onClick={() => setActiveTab(idx)}
                                                >
                                                    {title}
                                                </button>
                                            )
                                        )}
                                    </div>

                                    <div className="p-4">
                                        {activeTab === 0 && (
                                            <CharacterGoalTab
                                                showText={"角色"}
                                                batchUpdateCharacter={currentAdapter.batchUpdateCharacter}
                                            />
                                        )}
                                        {activeTab === 1 &&
                                            <TalentGoalTab/>}
                                        {activeTab === 2 && (
                                            <CharacterGoalTab
                                                showText={"武器"}
                                                batchUpdateCharacter={currentAdapter.batchUpdateWeapon}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExDialog;
