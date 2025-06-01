// ======= シーンの切り替えを管理するclass =======

import * as constants from '../constants.js';
import {state} from '../state.js';

export class SceneManager {
    constructor(uiManager, audioManager, saveManager, imageManager) {
        this.uiManager = uiManager;
        this.audioManager = audioManager;
        this.saveManager = saveManager;
        this.imageManager = imageManager;
        this.state = state;
        this.constants = constants;
    }

    changeNextScene() {
        const scene = this.constants.scenes[this.state.currentScene];
        this.constants.next.disabled = true; // 次へボタン無効化（連打対策）
        // セットアップボタンを無効化（バグ対策）
        document.querySelectorAll('.setup-button').forEach(btn => {
            btn.disabled = true;
        });
        // 吹き出しの文字をフェードアウト
        this.constants.Name.style.opacity = '0';
        this.constants.textContainer.style.opacity = '0';

        if (scene.dayText) { // daysを表示する場合（待機時間が異なるため場合わけ）
            this.state.dayCount++; // 日付を更新
            const wait1 = 1000; // days表示前に1秒間を開ける。
            setTimeout(() => {
                const backgroundKey = scene.background;
                this.state.backgroundUrl = this.constants.backgroundImage[backgroundKey];
                if (scene.dayText != 'day') {
                    // showDaysが日付表示でない場合（ = テキスト表示の場合）→ 先に背景を変更
                    this.imageManager.changeBackground(this.state.backgroundUrl);
                    this.audioManager.playBGM(this.constants.bgmArray['stop']); // bgmをストップ
                } 
                this.uiManager.showDays(scene.dayText, () => { // showDays完了後に呼ばれる：所要時間3.01秒
                    // BGMのURLを取得 → 変更
                    if (scene.bgm) {
                        const bgmKey = scene.bgm;
                        this.state.bgmUrl = this.constants.bgmArray[bgmKey];
                        this.audioManager.playBGM(this.state.bgmUrl); // BGMの再生
                    }
                    this.uiManager.displayTextBox(true) // text-boxのフェードイン
                    this.constants.text.innerHTML = scene.text; // テキストの指定
                    this.constants.textContainer.style.opacity = '1'; // textのフェードイン
                    
                    this.state.currentScene++; // scene番号+1で次のシーンを指定

                    // showDaysが日付表示の場合（ = テキスト表示でない場合）→ 最後に背景を変更
                    let wait2 = 0; // 背景変更待ち時間（変更なしの場合:0）
                    if (scene.dayText == 'day' && scene.background) {
                        this.imageManager.changeBackground(this.state.backgroundUrl);
                        wait2 = 3000; // 背景変更の所要時間3秒
                    }
                    // 次へボタン、セットアップボタンの有効化
                    setTimeout(() => {
                        this.constants.next.disabled = false;
                        document.querySelectorAll('.setup-button').forEach(btn => {
                            btn.disabled = false;
                        });
                    }, wait2);
                });
            }, wait1);
        } else { // daysを表示しない場合
            // キャラ画像のURLを取得 → 変更
            const sceneFaceKeys = {main: scene.mainFace, wife: scene.wifeFace, son: scene.sonFace}; // このシーンの表情keyを取得
            for (let key in this.constants.charDivs) {
                if (sceneFaceKeys[key] && sceneFaceKeys[key] != 'stay') { // 表情keyが存在かつstayでない場合
                    const faceImage = this.constants.faceImages[key]; // keyの画像配列を取得
                    const faceKey = sceneFaceKeys[key]; // ↑の画像配列内でのkeyを取得
                    this.state.charFaceUrls[key] = faceImage[faceKey]; // URLを更新
                    this.imageManager.changeFace(this.constants.charDivs[key], this.state.charFaceUrls[key]); // キャラ画像を変更
                }
            }
            // キャラ画像のスタイル修正（scenesで指定があった場合のみ）
            if (scene.position === 'son') { // char-sonの画像を左に移動（sonとwifeの会話発生に備えて＆伏線）
                this.constants.sonDiv.style.right = 'none';
                this.constants.sonDiv.style.left = '-198px';
            } else if (scene.position === 'main') { // char-mainの画像を拡大（後半の画像サイズに合わせて調整）
                this.constants.mainDiv.style.width = '70%';
                this.constants.mainDiv.style.bottom = '-10px';
            }

            // BGMのURLを取得 → 変更
            if (scene.bgm) {
                const bgmKey = scene.bgm;
                this.state.bgmUrl = this.constants.bgmArray[bgmKey];
                this.audioManager.playBGM(this.state.bgmUrl); // BGMの再生
            }

            // 背景変更の場合わけ
            if (scene.end) { // エンディングの場合（scene に end がある場合）
                this.state.endingCount++; // エンディング到達回数を記録
                this.saveManager.updateSaveData({ endingCount: this.state.endingCount }) // エンディング到達回数を上書き保存 
                this.uiManager.displayTextBox(false); // テキストボックスを非表示
                const endMessage = document.getElementById('days') // daysをエンディングメッセージに用いる
                endMessage.style.opacity = '0'; // 透明度0
                const wait1 = 2000; // フェードアウト待ち1秒 + 1秒間を開ける
                setTimeout(() => {
                    const backgroundKey = scene.background;
                    this.state.backgroundUrl = this.constants.backgroundImage[backgroundKey]; // 背景のURLを更新
                    this.imageManager.changeBackground(this.state.backgroundUrl); // 背景変更
                    const wait2 = 3000; // 背景変更待ち3秒
                    setTimeout(() => {
                        // エンディングメッセージの表示
                        endMessage.style.transition = 'opacity 3s ease'; // フェードイン時間を3sに
                        endMessage.style.display = 'block';
                        endMessage.innerHTML = scene.end; // メッセージを指定
                        setTimeout(() => {
                            endMessage.style.opacity = '1'; // メッセージをフェードイン
                            document.getElementById('save').disabled = true; // セーブボタンの無効化（バグ対策）
                            if (scene.background === 'endT') { // TRUE ENDの場合 → エンドロールを表示
                                const wait2 = 5000; // 5秒後エンドロールを表示
                                setTimeout (() => {
                                    this.imageManager.showEndroll()
                                }, wait2);
                            } else { // 通常時 → セットアップボタンの表示
                                this.uiManager.displaySetupButton(true);
                            }
                        }, 10); // 時間差でバグ回避
                    }, wait2);
                }, wait1);
            } else if (scene.background) {  // 通常時の背景の変更（scene に background がある場合）
                const backgroundKey = scene.background;
                this.state.backgroundUrl = this.constants.backgroundImage[backgroundKey]; // 背景のURLを更新
                // 車椅子移動演出の有無
                if (scene.wheel) { // 演出あり
                    this.imageManager.wheelChair(this.constants.backgroundImage[scene.wheel], this.state.backgroundUrl); // 車椅子移動演出の呼び出し
                } else { //演出なし（通常の背景変更のみ）
                    // 次へボタン、セットアップボタンの非表示
                    this.constants.next.style.display = 'none';
                    this.uiManager.displaySetupButton(false);
                    this.imageManager.changeBackground(this.state.backgroundUrl); // 背景を変更
                    const wait = 3000; //背景変更待ち3秒
                    setTimeout(() => {
                        // 次へボタン、セットアップボタンの表示
                        this.constants.next.style.display = 'block';
                        this.uiManager.displaySetupButton(true);
                    }, wait);
                }
            }

            // 吹き出し内の表示（名前、テキスト、選択肢）
            const wait = 500; // 文字のフェードアウト待ち0.5秒
            setTimeout(() => {
                this.constants.Name.innerHTML = scene.name;
                this.constants.text.innerHTML = scene.text.replace('${lastChoiceText}', this.state.lastChoiceText); // 選択肢の回答をテキストにも表示可能
                setTimeout(() => {
                    // テキスト、名前をフェードイン
                    this.constants.Name.style.opacity = '1';
                    this.constants.textContainer.style.opacity = '1';
                }, 10); // 時間差でバグ回避

                // 次のシーン指定の場合わけ
                if (scene.choices && scene.choices.length > 0) { // 選択肢がある場合
                    this.constants.next.style.display = 'none'; // 次へボタンの非表示
                    this.showChoices(scene.choices); // 分岐の定義関数適用
                } else if (
                    scene.nextSceneAns && 
                    this.state.pass.join(',') === 'くつした,ルマンダ,マインクリエイティブ,いつも凡人だった君たちへ,すいか'
                ) { // 隠しルートへの分岐
                    this.state.currentScene = this.state.currentScene + scene.nextSceneAns;
                } else if (Array.isArray(scene.nextScene)) { // 6日目以降の分岐先の指定（2×1で指定）
                    const nextScene = scene.nextScene
                    this.state.currentScene = this.state.currentScene + this.skipPartsCount(nextScene[0], nextScene[1]);
                } else if (scene.nextScene) { // その他の移動先の指定（1×1で指定）
                    this.state.currentScene = this.state.currentScene + scene.nextScene;
                } else { // 通常時はscene番号+1で次のシーンを指定
                    this.state.currentScene++;
                }
                // 次へボタン、セットアップボタンの有効化
                this.constants.next.disabled = false;
                document.querySelectorAll('.setup-button').forEach(btn => {
                    btn.disabled = false;
                });
            }, wait);
        }
    }    

    // 選択肢による分岐の定義（選択肢を作成、表示 → 選択した回答を記録＆自動で対応する移動先へ）
    showChoices(choiceArray) {
        const choicesBox = document.getElementById('choices');
        choicesBox.innerHTML = ''; // 前の選択肢を全てクリア
        choicesBox.style.display = 'flex';
        choiceArray.forEach(choice => { //choicesの各要素に対して
            const btn = document.createElement('button'); // ボタンを作る
            btn.classList.add('choice'); // chiceクラスに加える（CSSによるレイアウトの指定）
            btn.textContent = choice.text; // テキストを指定
            // 選択肢をクリックした場合
            btn.addEventListener('click', () => {
                this.state.lastChoiceText = choice.text; // 選んだ回答を記録
                if (this.state.dayCount <= 5) {
                    this.state.pass[this.state.dayCount-1] = this.state.lastChoiceText; // 回答をパスワードとして保存
                }
                choicesBox.style.display = 'none'; //　ボタンを非表示
                // 移動先の指定
                const nextScene = choice.nextScene
                if (Array.isArray(nextScene)) { // 6日目以降の分岐の場合、skipPartsCountで移動先を指定
                    this.state.currentScene = this.state.currentScene + this.skipPartsCount(nextScene[0], nextScene[1]);
                } else { // 通常時
                    this.state.currentScene = this.state.currentScene + choice.nextScene; // (現在の番号+指定数字)の番号に飛ぶ
                }
                // 次へボタンを表示＆有効化
                this.constants.next.style.display = 'block';
                this.constants.next.disabled = false;
                this.constants.next.click(); // 自動で次へをクリック
            });
            choicesBox.appendChild(btn); // choiceBoxにボタンを追加（次回クリアするため）
        });
    }    

    // 6日目以降、指定したパート（nextPart）までスキップする関数
    skipPartsCount(nowPart, nextPart) {
        // 計算結果を返す：nextPart の１つ目のインデックス番号を指定
            // (nowPart から nextPart までの級数 +1) = (6_1から nextPart までの級数) - (6_1からnowPartまでの級数) +1
        return this.constants.partLengthSum[this.constants.partNumber.indexOf(nextPart)-1]
        - this.constants.partLengthSum[this.constants.partNumber.indexOf(nowPart)] + 1;
    }

}