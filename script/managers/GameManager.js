// ======= ゲームの読み込み、データの初期化を管理するclass =======

import * as constants from '../constants.js';
import {state} from '../state.js';

export class GameManager {
    constructor(uiManager, audioManager, saveManager, imageManager, sceneManager) {
        this.uiManager = uiManager;
        this.audioManager = audioManager;
        this.saveManager = saveManager;
        this.imageManager = imageManager;
        this.sceneManager = sceneManager;
        this.state = state;
        this.constants = constants;
    }

    // 起動時：特定変数の読み込み、タイトル画面での背景、タイトルの表示
    startGame() {
        const saveData = localStorage.getItem('mySaveData');
        if (saveData) {
            const parsed = JSON.parse(saveData);
            // 一部のセーブデータだけ読み込む
                // endingCount：ヒントの表示に影響
                // trueEndingCount：背景変更に影響
            if (parsed.endingCount) {
                this.state.endingCount = parsed.endingCount;
            }
            if (parsed.trueEndingCount) {
                this.state.trueEndingCount = parsed.trueEndingCount;
            }
        }
        this.imageManager.preloadImagesFromObjects(this.constants.imageSources); // 全ての画像のプリロード
        // 起動時の背景の表示
        const bg1 = document.getElementById('bg1');
        if (this.state.trueEndingCount > 0) { // TRUE END回収後
            bg1.style.backgroundImage = `url('${this.constants.backgroundImage.sakura}')`;
        } else { // 通常時
            bg1.style.backgroundImage = `url('${this.constants.backgroundImage.tsubomi}')`;
        }
        // ゲームタイトルの表示
        document.getElementById('game-title').textContent = document.title;
    }

    // newgameクリック時：ゲーム画面に切り替える
    newGame() {
        this.uiManager.displayTitlePage(false); // タイトル画面を消す
        const wait = 3000; // タイトルのフェードアウト待ち3秒＆背景切り替え待ち3秒
        setTimeout(() => {
            this.imageManager.changeBackground(this.state.backgroundUrl); // 背景を切り替える（初期値）
            setTimeout(() => {
                // 日付の自動表示
                this.uiManager.showDays(this.constants.scenes[this.state.currentScene].dayText, () => { // showDays完了後に呼ばれる：所要時間3.01秒
                    this.audioManager.playBGM(this.state.bgmUrl); // BGMの再生
                    this.uiManager.displayTextBox(true); // text-boxのフェードイン
                    this.constants.text.innerHTML = this.constants.scenes[this.state.currentScene].text; // 最初のシーンのテキストを指定
                    this.constants.textContainer.style.display = 'flex';
                    setTimeout (() => {
                        this.constants.textContainer.style.opacity = '1'; // textのフェードイン
                    }, 10); // 時間差でバグ回避
                    this.state.currentScene++; // scene番号+1で次のシーンを指定
                });
            }, wait);
        }, wait);
    }

    // continueクリック時：セーブしたゲーム画面に切り替える
    continueGame() {
        const loaded = this.saveManager.loadGame() // セーブデータをロード＆成功したかどうかを取得
        if (loaded) { // ロードできた場合
            // キャラ画像のフェードイン準備
            for (let key in this.constants.charDivs) {
                if (this.constants.charDivs[key].style.display == 'none') { // 'none'の場合 → URLも'none'に書き換え
                    this.state.charFaceUrls[key] = 'none';
                }
                this.constants.charDivs[key].style.display = 'none'; //一旦非表示
                this.constants.charDivs[key].style.opacity = '0'; // 透明度リセット
            }
            this.uiManager.displayTitlePage(false); // タイトル画面を消す
            const wait1 = 2000; // タイトルのフェードアウト完了待ち3秒-調整1秒
            setTimeout(() => {
                this.imageManager.changeBackground(this.state.backgroundUrl); // 背景を切り替える
                // テキスト、名前の透明度をリセット
                this.constants.textContainer.style.opacity = '0';
                this.constants.Name.style.opacity = '0';
                const wait2 = 3000; // 背景の切り替え待ち3秒
                setTimeout(() => {
                    // 日付の自動表示
                    let dayText = (this.state.dayCount <= 7) ? 'day' : '数年後'; // 7日目までと数年後の場合で表示を変える
                    this.uiManager.showDays(dayText, () => { // showDays完了後に呼ばれる：所要時間3.01秒
                        this.audioManager.playBGM(this.state.bgmUrl); // BGMの再生
                        // キャラ画像のフェードイン
                        for (let key in this.constants.charDivs) {
                            this.imageManager.changeFace(this.constants.charDivs[key], this.state.charFaceUrls[key]);
                        }
                        this.uiManager.displayTextBox(true) // text-boxのフェードイン
                        this.constants.textContainer.style.display = 'flex';
                        this.constants.Name.style.display = 'block';
                        setTimeout (() => {
                            this.constants.textContainer.style.opacity = '1'; // textのフェードイン
                            this.constants.Name.style.opacity = '1'; // 名前のフェードイン
                        }, 10);
                        const scene = this.constants.scenes[this.state.currentScene];
                        // セーブしたシーンに選択肢がある場合の処理
                        if (scene.choices && scene.choices.length > 0) {
                            this.constants.next.style.display = 'none'; // 次へボタンの非表示
                            this.sceneManager.showChoices(scene.choices); // 分岐の定義関数適用
                        }
                    });
                }, wait2);
            }, wait1);
        }
    }

    // resetクリック時：confirmで確認 → okならセーブデータを削除（endingCount, trueEndingCountもリセット）
    resetData() {
        if (confirm('クリア回数もリセットされます。\n本当にセーブデータを削除しますか？')) {
            localStorage.removeItem('mySaveData'); // セーブデータを削除
            this.state.endingCount = 0; // エンディング到達回数をリセット
            this.state.trueEndingCount = 0; // TRUE END到達回数をリセット
            this.imageManager.changeBackground(this.constants.backgroundImage.tsubomi); // 通常時のタイトル画面背景に戻す
            alert('セーブデータを削除しました😭');
        }
    }

    // タイトルへをクリックした場合：確認画面を表示 → yesでタイトル画面に戻る / noで確認画面を閉じる
    titleBack() {
        const titleBox = document.getElementById('title-box');
        const checkMessage = document.getElementById('check-message');
        // 選択肢のボタンを非表示（重なり回避）
        document.getElementById('choices').style.display = 'none';
        // 一旦全てのボタンを無効化
        document.querySelectorAll('button').forEach(btn => {
            btn.disabled = true;
        });
        // 確認ボタン（yes/no）を表示＆有効化
        document.querySelectorAll('.check-button').forEach(btn => {
            btn.style.display = 'block'; 
            btn.disabled = false;
        });
        titleBox.style.display = 'block';
        checkMessage.innerHTML = 'セーブしていないデータは消えますが、<br>本当にタイトルに戻りますか？';
        checkMessage.style.display ='block'; // 確認メッセージを表示
        setTimeout(() => {
            titleBox.style.opacity = '1'; // タイトルボックスをフェードイン
        }, 10); // 時間差でバグ回避

        // no をクリックした場合：確認画面を閉じる
        document.getElementById('no').addEventListener('click', () => {
            checkMessage.style.display ='none'; // 確認メッセージを非表示
            titleBox.style.display = 'none'; //タイトルボックスを非表示
            titleBox.style.opacity = '0'; // 透明度リセット
            // 選択肢がある場合 → 選択肢のボタンを表示
            const scene = this.constants.scenes[this.state.currentScene]
            if (scene && scene.choices) {
                document.getElementById('choices').style.display = 'flex';
            }
            // 確認ボタンを非表示
            document.querySelectorAll('.check-button').forEach(btn => {
                btn.style.display = 'none'; 
            });
            // 全てのボタンを有効化（セーブボタンのみ、無効の場合は無効状態を維持）
            const saveButton = document.getElementById('save');
            const saveButtonDisabled = saveButton.disabled;
            document.querySelectorAll('button').forEach(btn => {
                btn.disabled = false;
            });
            saveButton.disabled = saveButtonDisabled;
        });
        // yes をクリックした場合：タイトル画面に戻る＆変数リセット
        document.getElementById('yes').addEventListener('click', () => {
            checkMessage.style.display ='none'; // 確認メッセージを非表示
            // 確認ボタンを非表示
            document.querySelectorAll('.check-button').forEach(btn => {
                btn.style.display = 'none'; 
            });
            this.audioManager.playBGM(this.constants.bgmArray.stop); // BGMを止める
            this.uiManager.displayTextBox(false); // テキストボックスを非表示
            document.getElementById('days').style.display = 'none'; // エンディングメッセージを非表示
            // 変数を初期値に戻す（endingCount, trueEndingCount, isBgmPlayingを除く）
            this.state.currentScene = 0;
            this.state.dayCount = 1;
            this.state.lastChoiceText = '';
            this.state.pass = ['', '', '', '', ''];
            this.state.backgroundUrl = this.constants.backgroundImage.room;
            this.state.charFaceUrls = {main: 'none', wife: 'none', son: 'none'};
            this.state.bgmUrl = this.constants.bgmArray.main
            // 背景画像を変更
            if (this.state.trueEndingCount > 0) { // TRUE END到達済みの場合
                this.imageManager.changeBackground(this.constants.backgroundImage.sakura);
            } else { // 通常時
                this.imageManager.changeBackground(this.constants.backgroundImage.tsubomi);
            }
            // キャラ画像のインラインスタイルを削除（CSSの状態にリセット）
            for (let key in this.constants.charDivs) {
                this.constants.charDivs[key].removeAttribute('style');
            }
            document.getElementById('days').removeAttribute('style'); // daysのインラインスタイルを削除
            // タイトル画面を表示
            this.uiManager.displayTitlePage(true);
            const wait = 3000; // フェードイン待ち3秒
            setTimeout (() => {
                // 全てのボタンを有効化
                document.querySelectorAll('button').forEach(btn => {
                    btn.disabled = false;
                });
            }, wait);
        });
    }
}