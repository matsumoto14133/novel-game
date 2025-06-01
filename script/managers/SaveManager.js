// ======= データのセーブ、ロードを管理するclass =======

import * as constants from '../constants.js';
import {state} from '../state.js';

export class SaveManager{
    constructor() {
        this.state = state;
        this.constants = constants;
    }

    // セーブ関数：confirmで確認 → okならセーブ
    saveGame() {
        if (confirm('前のセーブデータに上書きされます。\n本当にセーブしますか？')) {
            // 保存内容
            const saveData = {
                // 重要変数
                currentScene: this.state.currentScene,
                dayCount: this.state.dayCount,
                lastChoiceText: this.state.lastChoiceText,
                pass: this.state.pass,
                endingCount: this.state.endingCount,
                trueEndingCount: this.state.trueEndingCount,
                // テキスト、名前
                currentText: this.constants.text.innerText,
                currentName: this.constants.Name.innerText,
                // 画像、BGMのURL
                currentBackgroundUrl: this.state.backgroundUrl,
                currentCharFaceUrls: this.state.charFaceUrls,
                currentBgmUrl: this.state.bgmUrl,
                // キャラ画像のインラインスタイル
                mainDivStyle: this.constants.mainDiv.getAttribute('style'),
                wifeDivStyle: this.constants.wifeDiv.getAttribute('style'),
                sonDivStyle: this.constants.sonDiv.getAttribute('style'),
            };
            // ローカルストレージに保存
            localStorage.setItem('mySaveData', JSON.stringify(saveData));
            alert('セーブしました！ここまでプレイお疲れ様です！');
        }
    }

    // ロード関数
    loadGame() {
        const saveData = localStorage.getItem('mySaveData');
        if (!saveData) { // セーブデータがない場合
            alert('セーブデータがありません。誠に遺憾です！');
            return false;
        }
        const parsed = JSON.parse(saveData);
        if (!parsed.currentScene && parsed.currentScene !== 0) { // 
            alert('セーブデータがありません。誠に遺憾です！');
            return false;
        }
        // 各変数に復元
        this.state.currentScene = parsed.currentScene;
        this.state.dayCount = parsed.dayCount;
        this.state.lastChoiceText = parsed.lastChoiceText;
        this.state.pass = parsed.pass;
        this.state.endingCount = parsed.endingCount;
        this.state.trueEndingCount = parsed.trueEndingCount;

        // テキスト、名前を復元
        this.constants.text.innerText = parsed.currentText;
        this.constants.Name.innerText = parsed.currentName;

        // 画像、bgmの復元
        this.state.backgroundUrl = parsed.currentBackgroundUrl;
        this.state.charFaceUrls = parsed.currentCharFaceUrls,
        this.state.bgmUrl = parsed.currentBgmUrl;
        // キャラ画像のインラインスタイルの復元
        this.constants.mainDiv.setAttribute('style', parsed.mainDivStyle);
        this.constants.wifeDiv.setAttribute('style', parsed.wifeDivStyle);
        this.constants.sonDiv.setAttribute('style', parsed.sonDivStyle);
        
        return true; // ロード完了の判別に用いる
    }

    // 一部の値のみ上書き保存する関数（保存する値をオブジェクトで入力：複数指定可）
    updateSaveData(updatedValues) {
        // 現在のセーブデータを取得
        let saveData = localStorage.getItem('mySaveData');
        let parsed = saveData ? JSON.parse(saveData) : {}; // 保存データがない場合、空のオブジェクト
        // 渡された値で上書き
        for (let key in updatedValues) {
            parsed[key] = updatedValues[key];
        }
        // 再保存
        localStorage.setItem('mySaveData', JSON.stringify(parsed));
    }
}