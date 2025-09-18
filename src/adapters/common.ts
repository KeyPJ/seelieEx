import adapter from "axios-userscript-adapter/dist/esm";
import axios, {AxiosAdapter, AxiosRequestHeaders} from "axios";
import Data = mihoyo.Data;
import Role = mihoyo.Role;

axios.defaults.adapter = adapter as AxiosAdapter;
axios.defaults.withCredentials = true;

export function refreshPage() {
    const confirmed = confirm('确定要刷新页面吗？刷新后将重新加载所有数据。');

    // 只有当用户确认后才执行页面刷新
    if (confirmed) {
        window.location.reload();
    }
}

function getGuid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }

    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}

function generateCharString(number = 16) {
    const characters = 'abcdef0123456789';
    let result = '';
    for (let i = 0; i < number; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

export const headers = {
    Referer: "https://act.mihoyo.com/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
}

export const to = (promise: Promise<any>) => promise.then(data => {
    return [null, data];
}).catch(err => {
    console.error(err)
    return [err];
});

export const getFp = async () => {
    let fp = localStorage.getItem("fp");
    let deviceId = localStorage.getItem("mysDeviceId");
    if (!deviceId) {
        deviceId = getGuid()
        localStorage.setItem("mysDeviceId", deviceId);
    }
    if (!fp) {
        let url = "https://public-data-api.mihoyo.com/device-fp/api/getFp";
        const [err, res] = await to(axios.post(url,
            JSON.stringify({
                seed_id: generateCharString(),
                device_id: deviceId.toUpperCase(),
                platform: '1',
                seed_time: new Date().getTime() + '',
                ext_fields: `{"proxyStatus":"0","accelerometer":"-0.159515x-0.830887x-0.682495","ramCapacity":"3746","IDFV":"${deviceId.toUpperCase()}","gyroscope":"-0.191951x-0.112927x0.632637","isJailBreak":"0","model":"iPhone12,5","ramRemain":"115","chargeStatus":"1","networkType":"WIFI","vendor":"--","osVersion":"17.0.2","batteryStatus":"50","screenSize":"414×896","cpuCores":"6","appMemory":"55","romCapacity":"488153","romRemain":"157348","cpuType":"CPU_TYPE_ARM64","magnetometer":"-84.426331x-89.708435x-37.117889"}`,
                app_name: 'bbs_cn',
                device_fp: '38d7ee834d1e9'
            }), {
                timeout: 5000,
                headers: headers as unknown as AxiosRequestHeaders
            }));
        if (!err) {
            const {status, data: resData} = await res;
            if (status == 200) {
                const {retcode, data} = resData;
                if (retcode === 0) {
                    let resFp = data["device_fp"];
                    localStorage.setItem("fp", resFp);
                    return resFp;
                }
            }
        }
    } else {
        return fp;
    }
};

export const getAccount = async (roleUrl: string, openUrl: string, gameType: string) => {
    // try {
    const [err, res] = await to(axios.get(roleUrl, {
        headers: headers
    }));
    if (!err) {
        const {status, data: resData} = await res;
        if (status == 200) {
            const {retcode, data} = resData;
            if (retcode === 0) {
                const {list: accountList} = await data as Data<Role>;
                return accountList;
            }
        }
    }
    alert(`请确认已登录活动页面且绑定${gameType}账户!`)
    GM_openInTab(openUrl)
    throw err ? err : new Error("账户信息获取失败");
};
