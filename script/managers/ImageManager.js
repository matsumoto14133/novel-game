// ======= 画像の読み込み、切り替えを管理するclass =======

import * as constants from '../constants.js';
import {state} from '../state.js';

export class ImageManager {
    constructor(uiManager, saveManager) {
        this.uiManager = uiManager;
        this.saveManager = saveManager
        this.state = state;
        this.constants = constants;
    }

    // 背景画像を切り替える関数（フェード3秒）
    changeBackground(newImageUrl) {
        // 初期状態は、bg1で画像を表示、bg2は透明、z座標:bg1<bg2 とする
        const bg1 = document.getElementById('bg1');
        const bg2 = document.getElementById('bg2');
        // bg2 に新しい画像をセットしてフェードイン
        bg2.style.backgroundImage = `url('${newImageUrl}')`;
        bg2.style.opacity = 1;
        const wait = 3000; // フェードイン待ち3秒
        setTimeout(() => {
            // bg1にも画像をセット、bg2 → opacity: 0 で初期状態へ戻す
            bg1.style.backgroundImage = `url('${newImageUrl}')`;
            bg2.style.opacity = 0;
        }, wait);
    }

    // キャラクター画像を切り替える関数の定義（フェード0.3秒、char-mainのみ1.5秒）
    changeFace(charDiv, newUrl) {
        const imgElement = charDiv.querySelector('img'); // imgを取得
        charDiv.style.opacity = '0'; // 現在の画像をフェードアウト
        let wait = (charDiv === this.constants.mainDiv) ? 1500 : 300; // フェードアウト待ちmain：1.5秒、その他：0.3秒
        setTimeout(() => {
            charDiv.style.display = 'none';
            // newUrlが'none'ならフェードアウトのみで終了
            if (newUrl === 'none') return;

            // imgのsrcを新しい画像のURLに更新 → フェードイン
            imgElement.setAttribute('src', newUrl);
            charDiv.style.display = 'block';
            setTimeout(() => {
                charDiv.style.opacity = '1';
            }, 10); // 時間差でバグ回避
        }, wait);
    }

    // 車椅子移動演出の定義（所要時間7.51秒）
    wheelChair(wheelChairBackgroundUrl, newBackgroundUrl) {
        // 次へボタン、セットアップボタンの非表示
        this.constants.next.style.display = 'none';
        this.uiManager.displaySetupButton(false);
        // 演出中の背景に変更
        this.changeBackground(wheelChairBackgroundUrl);
        // mainImage.backをフェードイン（下の画像配列参照）
        this.changeFace(this.constants.mainDiv, this.constants.mainImage.back);
        const wait1 = 4510; // メインキャラ画像変更待ち0.51秒+3秒表示 
        setTimeout(() => {
            this.changeBackground(newBackgroundUrl); // 新しい背景に変更
            this.changeFace(this.constants.mainDiv, 'none'); // mainImageをフェードアウト
            const wait2 = 3000; // 背景変更待ち3秒
            setTimeout(() => {
                // 次へボタン、セットアップボタンの表示
                this.constants.next.style.display = 'block';
                this.uiManager.displaySetupButton(true);
                this.constants.next.click(); // 自動で次へボタンをクリック（次のシーンに進める）
            }, wait2);
        }, wait1);
    }

    // エンドロールを流す関数
    showEndroll() {
        // TRUE END到達回数を記録＆上書き保存
        this.state.trueEndingCount++;
        this.saveManager.updateSaveData({ trueEndingCount: this.state.trueEndingCount }) // 下で定義
        // エンドロールにタイトルを指定
        document.querySelector('.endroll-title').textContent = document.title;
        // エンドロールを流す
        document.getElementById('endroll-container').style.display = 'flex';
        const wait = 13000; // アニメーション時間+余裕
        setTimeout(() => {
            document.getElementById('endroll-container').style.display = 'none'; // エンドロールを非表示
            this.uiManager.displaySetupButton(true); // セットアップボタンを表示（タイトルに戻れるようにする）
        }, wait);
    }

    // 画像のプリロード用関数（フェードの乱れ対策）
    preloadImagesFromObjects(objectsArray) {
        for (const imageObj of objectsArray) {
            for (const key in imageObj) {
                const url = imageObj[key];
                if (url !== 'none') { // 'none' の場合はスキップ
                    new Image().src = url; // ブラウザに先に画像を読み込ませる
                }
            }
        }
    }
}