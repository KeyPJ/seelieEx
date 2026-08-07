// 进度总线：用发布/订阅替代把 onProgress 回调从接口一路钻到请求循环的做法。
// 上报方（各 hoyo.ts 的请求循环）只管 emit，UI 在同步开始时 subscribe 一次即可。

export type ProgressPhase = "detail" | "inventory";

type ProgressListener = (phase: ProgressPhase, done: number, total: number) => void;

class ProgressBus {
    private listeners = new Set<ProgressListener>();

    subscribe(fn: ProgressListener): () => void {
        this.listeners.add(fn);
        return () => {
            this.listeners.delete(fn);
        };
    }

    emit(phase: ProgressPhase, done: number, total: number): void {
        for (const fn of this.listeners) {
            try {
                fn(phase, done, total);
            } catch (e) {
                console.warn("[progressBus] listener error:", e);
            }
        }
    }
}

export const progressBus = new ProgressBus();
