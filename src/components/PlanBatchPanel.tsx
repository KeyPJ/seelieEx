import React, {useState} from "react";
import {AdapterManager} from "../adapters/adapterManager";
import {GameType} from "../adapters/game";
import {mergeGoalInactive, getEntityCompletion} from "../adapters/common";

// 纯函数：根据橙(5)/紫(4)勾选计算 tier 过滤数组；两者皆空 → 返回空数组（该角色/武器行整体跳过，不处理任何 tier）
const computeTiers = (t5: boolean, t4: boolean): number[] => {
    return [...(t5 ? [5] : []), ...(t4 ? [4] : [])];
};

// 规划批量操作面板：角色/武器各一行的稀有度勾选 + 共用的「激活/取消规划」按钮
export function PlanBatchPanel() {
    const [charTier5, setCharTier5] = useState(true);
    const [charTier4, setCharTier4] = useState(false);
    const [weapTier5, setWeapTier5] = useState(true);
    const [weapTier4, setWeapTier4] = useState(false); // 武器默认只勾橙色，避免默认误伤四星武器

    const [planning, setPlanning] = useState(false);

    const weaponGoalType = AdapterManager.getCurrentGameType() === GameType.HSR ? "cone" : "weapon";

    // 横向约束：某行（角色/武器）两个稀有度都未勾选 → 整行跳过；
    // 但四框全都不勾选 → 视为四个全勾选（处理全部角色 + 全部武器，不做 tier 过滤）。
    const charUnchecked = !charTier5 && !charTier4;
    const weapUnchecked = !weapTier5 && !weapTier4;
    const allUnchecked = charUnchecked && weapUnchecked;

    // activate=true → 一键激活规划；activate=false → 批量取消规划
    // 已达标实体无论点哪个按钮都自动归入未激活（清理规划）；未达标按按钮意图处理
    const applyPlan = async (activate: boolean) => {
        if (planning) return;
        setPlanning(true);
        try {
            // 四框全空 → 视为全勾选：tiers 传 undefined（不过滤，处理全部）；
            // 否则按行内勾选：某行两框都空 → computeTiers 返回 [] → 整行跳过。
            const charTiers = allUnchecked ? undefined : computeTiers(charTier5, charTier4);
            const weapTiers = allUnchecked ? undefined : computeTiers(weapTier5, weapTier4);
            const [charRes, weapRes] = await Promise.all([
                getEntityCompletion("character", charTiers),
                getEntityCompletion(weaponGoalType, weapTiers),
            ]);
            const updates: Record<string, boolean> = {};
            for (const res of [charRes, weapRes]) {
                // 已达标 → 自动归入未激活
                for (const id of res.completed) updates[id] = true;
                // 未达标 → 激活(移除 inactive=false) 或 取消规划(归入 inactive=true)
                for (const id of res.incomplete) updates[id] = !activate;
            }
            if (Object.keys(updates).length === 0) {
                alert("没有可处理的角色/武器目标");
                return;
            }
            await mergeGoalInactive(updates);
        } finally {
            setPlanning(false);
        }
    };

    return (
        <div className="p-4 space-y-3">
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-300 w-10 shrink-0">角色</span>
                <label className="flex items-center gap-1 text-sm cursor-pointer select-none">
                    <input type="checkbox" checked={charTier5} onChange={e => setCharTier5(e.target.checked)} />
                    <span className="text-orange-400 font-medium">橙色 (5★)</span>
                </label>
                <label className="flex items-center gap-1 text-sm cursor-pointer select-none">
                    <input type="checkbox" checked={charTier4} onChange={e => setCharTier4(e.target.checked)} />
                    <span className="text-purple-400 font-medium">紫色 (4★)</span>
                </label>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-300 w-10 shrink-0">武器</span>
                <label className="flex items-center gap-1 text-sm cursor-pointer select-none">
                    <input type="checkbox" checked={weapTier5} onChange={e => setWeapTier5(e.target.checked)} />
                    <span className="text-orange-400 font-medium">橙色 (5★)</span>
                </label>
                <label className="flex items-center gap-1 text-sm cursor-pointer select-none">
                    <input type="checkbox" checked={weapTier4} onChange={e => setWeapTier4(e.target.checked)} />
                    <span className="text-purple-400 font-medium">紫色 (4★)</span>
                </label>
            </div>
            <div className="flex gap-3 pt-1">
                <button
                    className="text-white bg-green-600 hover:bg-green-500 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => applyPlan(true)}
                    disabled={planning}
                    title="对未达标的角色/武器激活规划（移除未激活）；已达标自动归入未激活。勾选稀有度后仅对该稀有度生效；某行两框都不勾则跳过该行；四框全不勾则视为全部勾选并全量处理"
                >
                    一键激活规划
                </button>
                <button
                    className="text-white bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => applyPlan(false)}
                    disabled={planning}
                    title="对未达标的角色/武器取消规划（归入未激活）；已达标也自动归入未激活。勾选稀有度后仅对该稀有度生效；某行两框都不勾则跳过该行；四框全不勾则视为全部勾选并全量处理"
                >
                    批量取消规划
                </button>
            </div>
        </div>
    );
}
