// ======= BGMの読み込み、切り替えを管理するclass =======

import * as constants from '../constants.js';
import {state} from '../state.js';

export class AudioManager {
    constructor() {
        this.state = state;
        this.constants = constants;
    }

    // BGMマークのクリック時：ミュートのオン/オフ切り替え
    bgmMute() {
        const bgm = document.getElementById('bgm');
        const toggle = document.getElementById('bgm-toggle');

        if (this.state.isBgmPlaying) {
            bgm.volume = 0; // ボリューム0
            toggle.innerText = '🔇'; // オフマークに変更
        } else {
            bgm.volume = 0.3; // 通常のボリューム
            toggle.innerText = '🔈'; // オンマークに変更
        }
        this.state.isBgmPlaying = !this.state.isBgmPlaying; // 状態を反転
    }

    // BGMを再生、停止する関数（所要時間1秒）
    playBGM(url) {
        const bgm = document.getElementById('bgm');
        // 今のBGMをフェードアウト
        const duration = 1000; // フェードアウト時間
        const steps = 20; // 何ステップで消すか
        const interval = duration / steps; // 1ステップごとの時間
        const volumeStep = bgm.volume / steps; // 1ステップごとに下げる音量

        const fade = setInterval(() => {
            if (bgm.volume - volumeStep > 0) {
                bgm.volume -= volumeStep; // volumeStep分、音量ダウンを繰り返す
            } else {
                bgm.volume = 0;
                bgm.pause(); // BGMをオフにする
                clearInterval(fade); //タイマーもストップ
            }
        }, interval);
        if (url === 'none') return; // urlが'none'の場合 → BGMオフで終了
        // 新しいBGMを再生
        setTimeout (() => {
            bgm.src = url;
            bgm.loop = true; // 自動でループする
            if (!this.state.isBgmPlaying) { // ミュート状態の場合（下で定義）
                bgm.volume = 0;
            } else { // ミュート状態でない場合
                bgm.volume = 0.3;
            }
            bgm.play().catch(err => { // エラーの場合、コンソールに以下を表示
                console.warn('自動再生がブロックされました:', err);
            });
        }, duration); // フェードアウト待ち
    }
}