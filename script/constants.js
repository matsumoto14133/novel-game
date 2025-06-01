// ======= 定数をまとめたJSファイル =======

// 全てのシーンをimport
import * as scenesDay1 from './scenes/scenes_day1.js';
import * as scenesDay2 from './scenes/scenes_day2.js';
import * as scenesDay3 from './scenes/scenes_day3.js';
import * as scenesDay4 from './scenes/scenes_day4.js';
import * as scenesDay5 from './scenes/scenes_day5.js';
import * as scenesDay6_1 from './scenes/scenes_day6_1.js';
import * as scenesDay6_2 from './scenes/scenes_day6_2.js';
import * as scenesDay6_3 from './scenes/scenes_day6_3.js';
import * as scenesDay7 from './scenes/scenes_day7.js';

// 画像、BGMのURLをまとめたオブジェクト
export const backgroundImage = {
    room: 'background/background_room.png',
    roomF: 'background/background_room_fire.png',
    kitchen: 'background/background_kitchen.png',
    kitchenF: 'background/background_kitchen_fire.png',
    kareki: 'background/background_gurden_kareki.png',
    notree: 'background/background_gurden_notree.png',
    nae: 'background/background_gurden_nae.png',
    tsubomi: 'background/background_gurden_tsubomi.png',
    sakura: 'background/background_gurden_sakura.png',
    entranceE: 'background/background_entrance_evening.png',
    entranceN: 'background/background_entrance_night.png',
    hospital: 'background/background_hospital.png',
    black: 'background/background_black.png',
    yellow1: 'background/background_yellow_1.png',
    yellow2: 'background/background_yellow_2.png',
    yellow3: 'background/background_yellow_3.png',
    yellow4: 'background/background_yellow_4.png',
    yellow5: 'background/background_yellow_5.png',
    yellow6: 'background/background_yellow_6.png',
    endB1H: 'background/background_end_bad1_happy.png',
    endB2: 'background/background_end_bad2.png',
    endB3: 'background/background_end_bad3.png',
    endT: 'background/background_end_true.png',
}
export const mainImage = {
    normal: 'character/character_main_normal.png',
    resolve: 'character/character_main_resolve.png',
    back: 'character/character_main_back.png',
    memo: 'character/character_main_memo.png', //中央に表示するためここに追加
    hidden: 'none',
}
export const wifeImage = {
    normal: 'character/character_wife_normal.png',
    smile: 'character/character_wife_smile.png',
    surprised: 'character/character_wife_surprised.png',
    rushing: 'character/character_wife_rushing.png',
    cry: 'character/character_wife_cry.png',
    youngN: 'character/character_wife_young_normal.png',
    youngS: 'character/character_wife_young_smile.png',
    youngC: 'character/character_wife_young_cry.png',
    hidden: 'none',
}
export const sonImage = {
    normal: 'character/character_son_normal.png',
    resolve: 'character/character_son_resolve.png',
    smile: 'character/character_son_smile.png',
    youngN: 'character/character_son_young_normal.png',
    youngA: 'character/character_son_young_angry.png',
    complain: 'character/character_son_complain.png',
    hidden: 'none',
}
export const bgmArray = {
    main: 'BGM/BGM_main.mp3',
    past: 'BGM/BGM_past.mp3',
    serious: 'BGM/BGM_serious.mp3',
    fire: 'BGM/BGM_fire.mp3',
    ending: 'BGM/BGM_ending.mp3',
    stop: 'none',
}
// 画像オブジェクトのまとめ配列（プリロード用）
export const imageSources = [backgroundImage, mainImage, wifeImage, sonImage];
// キャラ画像オブジェクトのまとめオブジェクト（一括画像変更用）
export const faceImages = {main: mainImage, wife: wifeImage, son: sonImage}

// 全てのシーンのtext、Name、キャラの表情差分等（各パートを展開して結合）
export const scenes = [
    ...scenesDay1.scenesPart1_1,
    ...scenesDay1.scenesPart1_2,
    ...scenesDay2.scenesPart2_1,
    ...scenesDay2.scenesPart2_2,
    ...scenesDay3.scenesPart3_1,
    ...scenesDay3.scenesPart3_2,
    ...scenesDay4.scenesPart4_1,
    ...scenesDay4.scenesPart4_2,
    ...scenesDay5.scenesPart5_1,
    ...scenesDay5.scenesPart5_2,
    ...scenesDay6_1.scenesPart6_1,
    ...scenesDay6_1.scenesPart6_2,
    ...scenesDay6_2.scenesPart6_2_1,
    ...scenesDay6_2.scenesPart6_2_2,
    ...scenesDay6_3.scenesPart6_2_3,
    ...scenesDay6_3.scenesPart6_2_3_1,
    ...scenesDay6_3.scenesPart6_2_3_2,
    ...scenesDay7.scenesPart7_1,
    ...scenesDay7.scenesPart7_2,
    ...scenesDay7.scenesPart7_3,
    ...scenesDay7.scenesPart7_4,
];

// 変更を与える対象のIDの取得
export const next = document.getElementById('next'); // 次へボタン
export const Name = document.getElementById('name'); // 話しているキャラの名前
export const textContainer = document.getElementById('text-container'); // 吹き出し内テキストのスタイル指定用
export const text = document.getElementById('text'); // 吹き出し内テキスト
export const mainDiv = document.getElementById('char-main'); // mainキャラ画像のdiv
export const wifeDiv = document.getElementById('char-wife'); // wifeキャラ画像のdiv
export const sonDiv = document.getElementById('char-son'); // sonキャラ画像のdiv
export const charDivs = {main: mainDiv, wife: wifeDiv, son: sonDiv}; // divをまとめたオブジェクト


// ======= SceneManagerのskipPartsCountの計算で用いる配列 =======

// 6日目以降の各パートの長さの配列（級数配列の作成用）
const partLength = [
    scenesDay6_1.scenesPart6_1.length,
    scenesDay6_1.scenesPart6_2.length,
    scenesDay6_2.scenesPart6_2_1.length,
    scenesDay6_2.scenesPart6_2_2.length,
    scenesDay6_3.scenesPart6_2_3.length,
    scenesDay6_3.scenesPart6_2_3_1.length,
    scenesDay6_3.scenesPart6_2_3_2.length,
    scenesDay7.scenesPart7_1.length,
    scenesDay7.scenesPart7_2.length,
    scenesDay7.scenesPart7_3.length,
    scenesDay7.scenesPart7_4.length,
];
// 6日目以降の各パートの長さの級数の配列（計算用）
export const partLengthSum = new Array(11); // サイズを指定
partLengthSum[0] = partLength[0]; // 級数の初項を代入
// partLengthの値を繰り返し足して級数を定義
for (let i = 0; i < partLengthSum.length-1; i++) {
    partLengthSum[i+1] = partLengthSum[i] + partLength[i+1];
} 
// nowPart, nextPartの候補（インデックス番号が partLengthSum と対応 → 計算に用いる）
export const partNumber = [
    '6_1', '6_2', '6_2_1', '6_2_2', '6_2_3', '6_2_3_1',
    '6_2_3_2', '7_1', '7_2', '7_3', '7_4',
];