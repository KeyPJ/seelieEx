import React, {useState, useRef, useEffect} from "react";
import ListboxSelect from "./select/ListboxSelect";
import CharacterGoalTab from "./tabs/CharacterGoalTab";
import { PlanBatchPanel } from "./PlanBatchPanel";
import TalentGoalTab from "./tabs/TalentGoalTab";
import {AdapterManager} from '../adapters/adapterManager';
import {resetLoginFlag, resetSyncRequestCount, getSyncRequestCount} from '../adapters/common';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const TAB_TITLES = ["角色目标等级", "天赋目标等级", "武器目标等级"];

// 共享 tab 栏：角色/天赋/武器，受同一 activeTab 控制，使两个操作折叠保持同步
function TabBar({activeTab, setActiveTab}: { activeTab: number; setActiveTab: (i: number) => void }) {
    return (
        <div className="mt-4">
            <div className="flex border-b border-gray-600">
                {TAB_TITLES.map((title, idx) => (
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
                ))}
            </div>
        </div>
    );
}

// 折叠面板：标题栏 + 可展开内容；展开态由父级 openPanel 控制（手风琴）
function Fold({title, isOpen, onToggle, children}: {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode
}) {
    return (
        <div className="mt-2 border border-gray-700 rounded-lg bg-slate-700/50">
            <button
                className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-white bg-purple-800/70 rounded-lg hover:bg-purple-700 focus:outline-none transition-colors"
                onClick={onToggle}
            >
                <span>{title}</span>
                <svg
                    className={`w-5 h-5 text-purple-300 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
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
            {isOpen && (
                <div className="px-4 pt-4 pb-2 text-sm text-gray-100">
                    {children}
                </div>
            )}
        </div>
    );
}

function ExDialog({onClose}: { onClose?: () => void }) {

    const currentAdapter = AdapterManager.getCurrentAdapter();
    // 页面加载时自动显示当前游戏名称
    useEffect(() => {
        console.log(`当前游戏：${currentAdapter.getGameName()}`);
    }, [currentAdapter]);

    const [accountList, setAccountList] = useState<mihoyo.Role[]>([]);
    const [currentAccount, setCurrentAccount] = useState<mihoyo.Role>();
    // 手风琴：当前展开的折叠序号（0=同步, 1=规划批量操作, 2=目标等级设置），null=全收；同一时刻仅一个展开
    const [openPanel, setOpenPanel] = useState<number | null>(0);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressText, setProgressText] = useState("");
    const [syncInventory, setSyncInventory] = useState(true); // 是否同步背包库存（素材/武器/光锥），默认勾选
    const [associateWeapon, setAssociateWeapon] = useState(true); // 是否同步角色武器关联（可能影响批量规划），默认勾选
    const panelRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

    // 添加对话框根元素的引用
    const dialogRef = useRef<HTMLDivElement>(null);

    // 点击外部关闭所有面板（手风琴）
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (openPanel === null) return;
            const target = e.target as Node;
            const clickedInside = panelRefs.some(r => r.current && r.current.contains(target));
            if (!clickedInside) setOpenPanel(null);
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [openPanel]);

    // 添加鼠标移出事件处理函数（关闭全部）
    const handleMouseLeave = () => {
        setOpenPanel(null);
    };

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
        // import("../adapters/genshin/hoyo").then(({ getAccount }) => {
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
        // });
    };

    const syncAll = async () => {
        if (!currentAccount) {
            console.error("账户信息获取失败");
            alert("账户信息获取失败");
            return;
        }
        resetLoginFlag(); // 每次同步重置"已提示未登录"标记，保证仅提示/打开一次
        resetSyncRequestCount(); // 重置请求计数器，统计本次同步发起的请求数
        const {game_uid, region} = currentAccount;
        console.log("开始同步（角色信息 + 素材/库存）");

        setLoading(true);
        setProgress(5);
        setProgressText("正在获取角色详情...");

        let progressInterval: ReturnType<typeof setInterval> | null = null;
        try {
            const res = await currentAdapter.getCharacterDetails(game_uid, region);

            setProgress(30);
            setProgressText("正在写入角色/天赋目标...");

            // 模拟进度：素材同步是耗时大头，用 setInterval 让进度条从 30% 慢慢走到 85%
            progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev < 85) return prev + 2;
                    return prev;
                });
            }, 3000);

            await currentAdapter.syncCharacters(res, associateWeapon);
            setProgress(40);

            let invRes: any = null;
            if (syncInventory) {
                setProgressText("角色目标写入完成，正在同步素材/库存...");
                invRes = await currentAdapter.batchUpdateInventory(game_uid, region, res);
            } else {
                setProgressText("已跳过素材/库存同步");
            }

            if (progressInterval) {
                clearInterval(progressInterval);
                progressInterval = null;
            }
            setProgress(100);
            setProgressText("同步完成");

            const skipped = invRes && invRes.skipped;
            console.log("素材/库存同步结果:", invRes);
            console.log(`[请求计数] 本次同步共发起 ${getSyncRequestCount()} 个 HTTP 请求`);
            console.log("米游社数据无法判断是否突破,请自行比较整数等级是否已突破");
            alert(!syncInventory
                ? "同步完毕（仅角色信息，已跳过素材/库存同步）"
                : (skipped
                    ? `角色信息已同步\n（素材/库存同步暂不支持当前游戏：${invRes.reason || ""}）`
                    : "同步完毕（角色信息 + 素材/库存）"));
            location.reload();
        } catch (err: any) {
            if (progressInterval) {
                clearInterval(progressInterval);
            }
            console.error("同步失败:", err);
            console.log(`[请求计数] 同步中断前已发起 ${getSyncRequestCount()} 个 HTTP 请求`);
            alert("同步失败：" + (err?.message || err));
        } finally {
            setLoading(false);
            setProgress(0);
            setProgressText("");
        }
    };

    return (
        <div
            ref={dialogRef}
            className="fixed top-10 inset-x-[20%] mx-auto min-w-[50%] min-h-min rounded-md bg-slate-800/90 text-white text-center z-[1200] shadow-2xl"
            onMouseLeave={handleMouseLeave}>
            <div className="flex items-center justify-between px-4 pt-4">
                <h1 className="text-3xl font-bold underline text-white">SeelieEX</h1>
                <button
                    className="text-white text-2xl leading-none hover:text-gray-300"
                    onClick={onClose}
                    aria-label="关闭"
                >×</button>
            </div>
            <div className="w-full p-4">
                <div className="w-full max-w-md p-2 mx-auto bg-purple-900/30 rounded-2xl border border-purple-700/50">
                    {/* 折叠1 - 同步（角色信息 + 素材/库存） */}
                    <div ref={panelRefs[0]}>
                        <Fold
                            title="同步"
                            isOpen={openPanel === 0}
                            onToggle={() => setOpenPanel(openPanel === 0 ? null : 0)}
                        >
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
                            <div className="flex items-center pt-3">
                                <input
                                    type="checkbox"
                                    id="syncInventory"
                                    checked={syncInventory}
                                    onChange={(e) => setSyncInventory(e.target.checked)}
                                    className="mr-2 h-4 w-4 accent-blue-500"
                                />
                                <label htmlFor="syncInventory" className="text-sm text-gray-200 cursor-pointer select-none">
                                    同步背包库存（时间可能相对较长）
                                </label>
                            </div>
                            <div className="flex items-center pt-3">
                                <input
                                    type="checkbox"
                                    id="associateWeapon"
                                    checked={associateWeapon}
                                    onChange={(e) => setAssociateWeapon(e.target.checked)}
                                    className="mr-2 h-4 w-4 accent-blue-500"
                                />
                                <label htmlFor="associateWeapon" className="text-sm text-gray-200 cursor-pointer select-none">
                                    同步角色武器关联（可能影响批量规划）
                                </label>
                            </div>
                            <div className="flex pt-2">
                                <div className="w-full">
                                    <button
                                        className={`px-4 py-2 rounded transition-colors ${
                                            loading
                                                ? "text-gray-300 bg-gray-600 cursor-not-allowed"
                                                : "text-white bg-blue-600 hover:bg-blue-500"
                                        }`}
                                        onClick={syncAll}
                                        disabled={loading}
                                    >
                                        {loading ? "同步中..." : "同步"}
                                    </button>
                                </div>
                            </div>
                            {loading && (
                                <div className="mt-3">
                                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                                            style={{width: `${progress}%`}}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-300 mt-1">{progressText}</p>
                                </div>
                            )}
                        </Fold>
                    </div>

                    {/* 折叠2 - 规划批量操作（角色/武器稀有度勾选 + 共用激活/取消按钮） */}
                    <div ref={panelRefs[1]}>
                        <Fold
                            title="规划批量操作"
                            isOpen={openPanel === 1}
                            onToggle={() => setOpenPanel(openPanel === 1 ? null : 1)}
                        >
                            <PlanBatchPanel />
                        </Fold>
                    </div>

                    {/* 折叠3 - 目标等级设置（开关 + 目标等级下拉 + 批量设置） */}
                    <div ref={panelRefs[2]}>
                        <Fold
                            title="目标等级设置"
                            isOpen={openPanel === 2}
                            onToggle={() => setOpenPanel(openPanel === 2 ? null : 2)}
                        >
                            <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
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
                        </Fold>
                    </div>

                </div>
            </div>
        </div>
    );
}
export default ExDialog;
