// ======= ボタン操作を管理するclass =======

export class EventBinder {
    constructor(uiManager, audioManager, saveManager, sceneManager, gameManager) {
        this.uiManager = uiManager;
        this.audioManager = audioManager;
        this.saveManager = saveManager;
        this.sceneManager = sceneManager;
        this.gameManager = gameManager;
    }

    bindEvents() {
        // ======= タイトル画面操作時の実行内容 =======

        // 起動時：特定変数の読み込み、タイトル画面での背景、タイトルの表示
        window.addEventListener('DOMContentLoaded', () => {
            this.gameManager.startGame();
        });
        // BGMマークのクリック時：ミュートのオン/オフ切り替え
        document.getElementById('bgm-toggle').addEventListener('click', () => {
            this.audioManager.bgmMute();
        });
        // newgameクリック時：ゲーム画面に切り替える
        document.getElementById('newgame').addEventListener('click', () => {
            this.gameManager.newGame(); // 
        });
        // continueクリック時：セーブしたゲーム画面に切り替える
        document.getElementById('continue').addEventListener('click', () => {
            this.gameManager.continueGame();
        });
        // resetクリック時：confirmで確認 → okならセーブデータを削除（endingCount, trueEndingCountもリセット）
        document.getElementById('reset').addEventListener('click', () => {
            this.gameManager.resetData();
        });
        // hintクリック時：ヒントを表示
        document.getElementById('hint').addEventListener('click', () => {
            this.uiManager.showHint();
        });

        // ======= セットアップボタン操作時の実行内容 =======
        
        // セーブをクリック時：confirmで確認 → okならセーブ
        document.getElementById('save').addEventListener('click', () => {
            this.saveManager.saveGame();
        });
        // タイトルへをクリック時：確認画面を表示 → yesでタイトル画面に戻る / noで確認画面を閉じる
        document.getElementById('title-back').addEventListener('click', () => {
            this.gameManager.titleBack();
        });
        
        // ======= ゲーム画面進行時の実行内容 =======

        // 次へボタンのクリックでゲーム画面を進行
        document.getElementById('next').addEventListener('click', () => {
            this.sceneManager.changeNextScene();
        });
    }

}