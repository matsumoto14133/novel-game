// ======= UIを管理するclass =======

import * as constants from '../constants.js';
import {state} from '../state.js';

export class UiManager {
    constructor() {
        this.state = state;
        this.constants = constants;
    }

    // hintをクリックした場合：ヒントを表示
    showHint() {
        const hintMessage = document.getElementById('check-message');
        // タイトルボタンを非表示
        document.querySelectorAll('.title-button').forEach(btn => {
            btn.style.display = 'none';
        });
        // ヒントの表示
        if (this.state.endingCount > 0) { // エンディング到達前
            hintMessage.innerHTML = 'ヒント①：エンディングは全部で5つ<br><br>ヒント②：選択肢の「頭文字」';
        } else { // エンディング到達後
            hintMessage.innerHTML = 'ヒント①：エンディングは全部で5つ<br><br>ヒント②：こっちは一周クリア後に解放';
        }
        hintMessage.style.display ='block';
        const back = document.getElementById('back')
        back.style.display = 'block'; // 戻るボタン表示
        // 戻るボタンをクリックした場合：タイトル画面に戻る
        back.addEventListener('click', () => {
            hintMessage.style.display ='none'; // ヒントを非表示
            back.style.display = 'none'; // 戻るボタンを非表示
            // タイトルボタンを表示
            document.querySelectorAll('.title-button').forEach(btn => {
                btn.style.display = 'block';
            });
        });
    }

    // ======= 関数の定義（見た目、BGM変更系） =======
        // バグ回避の影響で、フェードイン時間 = フェードアウト時間 + 0.01秒 となる。

    // タイトル画面の表示、非表示を切り替える関数（フェード3秒、ただしタイトル以外は1秒）
    displayTitlePage(visible) {
        const ids = ['game-title', 'newgame', 'continue', 'reset', 'hint', 'title-box'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (visible && el) { // visibleが true の場合→表示
                el.style.display = 'block';
                setTimeout(() => {
                    el.style.opacity = '1';
                }, 10); // 時間差でバグ回避
            } else if (!visible && el) { // visibleが false の場合→非表示
                el.style.opacity = '0';
                const wait = 3000; // フェードアウト待ち3秒
                setTimeout(() => {
                    el.style.display = 'none';
                }, wait);
            }
        });
    }

    // セットアップボタンの表示、非表示を切り替える関数（フェードなし）
    displaySetupButton(visible) {
        document.querySelectorAll('.setup-button').forEach(btn => {
            // visibleが true なら表示、false なら非表示
            btn.style.display = visible ? 'block' : 'none';
        });
    }

    // テキストボックスの表示、非表示を切り替える関数（フェード1秒）
    displayTextBox(visible) {
        const textBox = document.getElementById('text-box');
        if (visible) { // trueの場合→表示
            textBox.style.display = 'block';
            setTimeout(() => {
                textBox.style.opacity = '1';
            }, 10);  // 時間差でバグ回避
            // 次へボタン、セットアップボタンの表示（テキストボックスと連動させる）
            this.constants.next.style.display = 'block';
            this.displaySetupButton(true);

        } else if (!(visible)) { // falseの場合→非表示
            // 次へボタン、セットアップボタンの非表示（テキストボックスと連動させる）
            this.constants.next.style.display = 'none';
            this.displaySetupButton(false);
            textBox.style.opacity = '0';
            const wait = 1000; // フェードアウト待ち1秒
            setTimeout(() => {
                textBox.style.display = 'none';
            }, wait);
        }
    }

    // 日数を表示し、自動で非表示にする関数（所要時間3.51秒+実行後の操作時間）
    showDays(dayText, callback) {
        this.displayTextBox(false); // テキストボックスを非表示
        const days = document.getElementById('days');
        days.style.display = 'block';
        if (dayText == 'day') { // 日数を出力する場合
            days.textContent = `〜${this.state.dayCount}日目〜`;
        } else { // 日数以外を表示する場合
            days.textContent = `〜${dayText}〜`;
        }
        const wait1 = 2500; // フェードイン待ち1秒+1.5秒表示
        setTimeout(() => {
            days.style.opacity = '1';
            const wait2 = 1000; // フェードアウト待ち1秒
            setTimeout(() => {
                days.style.opacity = '0';
                setTimeout(() => {
                    days.style.display = 'none';
                    if (callback) callback(); // 実行後の操作を呼び出す
                }, wait2);
            }, wait1);
        }, 10);
    }
}