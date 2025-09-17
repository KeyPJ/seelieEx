import React, {useEffect, useState} from 'react';
import './App.css';
import ExDialog from "./components/SeelieExDialog";

function App() {

    const [showExDialog, setShowExDialog] = useState(() => false)

    useEffect(() => {
        GM_registerMenuCommand("打开SeelieEx", () => setShowExDialog(true))
        // GM_registerMenuCommand("关闭SeelieEx", () => setShowExDialog(false))
        GM_registerMenuCommand("原神祈愿历史一览", () => GM_openInTab("https://genshin-gacha-banners.52v6.com"))
        GM_registerMenuCommand("意见反馈", () => GM_openInTab("https://github.com/KeyPJ/seelieEx/issues"))
    })

    return (
        <div className="App" style={{display: showExDialog ? "" : "none"}}>
            <ExDialog onClose={() => setShowExDialog(false)}/>
        </div>
    );
}


export default App;
