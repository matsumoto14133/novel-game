// ======= 変数をまとめたJSファイル =======

// constants.jsをimport → 背景、BGMの配列から初期値を取得
import * as constants from './constants.js';

export const state = {
    currentScene: 0, // scene番号（これを進めてゲーム進行）
    dayCount: 1, // 何日目かを数える
    lastChoiceText: '', // 選択肢で最後に選んだ回答を記録
    pass: ['', '', '', '', ''], // 6日目の分岐の判断に用いるパスワード
    endingCount: 0, // エンディングに到達した回数を記録
    trueEndingCount: 0, // TRUE ENDに到達した回数を記録
    backgroundUrl: constants.backgroundImage.room, // 背景のURL = 最初の背景
    charFaceUrls: {main: 'none', wife: 'none', son: 'none'}, // charのURLを保存
    bgmUrl: constants.bgmArray.main, // BGMのURL = 最初のBGM
    isBgmPlaying: true, // BGMの再生状態（最初はオン）
}