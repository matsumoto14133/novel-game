// ======= 関数の定義（見た目、BGM変更系） =======
    // バグ回避の影響で、フェードイン時間 = フェードアウト時間 + 0.01秒 となる。

// 背景画像を切り替える関数（フェード3秒）
function changeBackground(newImageUrl) {
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

// タイトル画面の表示、非表示を切り替える関数（フェード3秒、ただしタイトル以外は1秒）
function displayTitlePage(visible) {
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
function displaySetupButton(visible) {
    document.querySelectorAll('.setup-button').forEach(btn => {
        // visibleが true なら表示、false なら非表示
        btn.style.display = visible ? 'block' : 'none';
    });
}

// テキストボックスの表示、非表示を切り替える関数（フェード1秒）
function displayTextBox(visible) {
    const textBox = document.getElementById('text-box');
    const next = document.getElementById('next');
    if (visible) { // trueの場合→表示
        textBox.style.display = 'block';
        setTimeout(() => {
            textBox.style.opacity = '1';
        }, 10);  // 時間差でバグ回避
        // 次へボタン、セットアップボタンの表示（テキストボックスと連動させる）
        next.style.display = 'block';
        displaySetupButton(true);

    } else if (!(visible)) { // falseの場合→非表示
        // 次へボタン、セットアップボタンの非表示（テキストボックスと連動させる）
        next.style.display = 'none';
        displaySetupButton(false);
        textBox.style.opacity = '0';
        const wait = 1000; // フェードアウト待ち1秒
        setTimeout(() => {
            textBox.style.display = 'none';
        }, wait);
    }
}

// 日数を表示し、自動で非表示にする関数（所要時間3.51秒+実行後の操作時間）
function showDays(dayText, callback) {
    displayTextBox(false); // テキストボックスを非表示
    const days = document.getElementById('days');
    days.style.display = 'block';
    if (dayText == 'day') { // 日数を出力する場合
        days.textContent = `〜${dayCount}日目〜`;
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

// キャラクター画像を切り替える関数の定義（フェード0.3秒、char-mainのみ1.5秒）
function changeFace(charDiv, newUrl) {
    const imgElement = charDiv.querySelector('img'); // imgを取得
    charDiv.style.opacity = '0'; // 現在の画像をフェードアウト
    let wait = (charDiv === mainDiv) ? 1500 : 300; // フェードアウト待ちmain：1.5秒、その他：0.3秒
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
function wheelChair(wheelChairBackgroundUrl, newBackgroundUrl) {
    // 次へボタン、セットアップボタンの非表示
    next.style.display = 'none';
    displaySetupButton(false);
    // 演出中の背景に変更
    changeBackground(wheelChairBackgroundUrl);
    // mainImage.backをフェードイン（下の画像配列参照）
    changeFace(mainDiv, mainImage.back);
    const wait1 = 4510; // メインキャラ画像変更待ち0.51秒+3秒表示 
    setTimeout(() => {
        changeBackground(newBackgroundUrl); // 新しい背景に変更
        changeFace(mainDiv, 'none'); // mainImageをフェードアウト
        const wait2 = 3000; // 背景変更待ち3秒
        setTimeout(() => {
            // 次へボタン、セットアップボタンの表示
            next.style.display = 'block';
            displaySetupButton(true);
            next.click(); // 自動で次へボタンをクリック（次のシーンに進める）
        }, wait2);
    }, wait1);
}

// BGMを再生、停止する関数（所要時間1秒）
function playBGM(url) {
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
        if (!isBgmPlaying) { // ミュート状態の場合（下で定義）
            bgm.volume = 0;
        } else { // ミュート状態でない場合
            bgm.volume = 0.3;
        }
        bgm.play().catch(err => { // エラーの場合、コンソールに以下を表示
            console.warn('自動再生がブロックされました:', err);
        });
    }, duration); // フェードアウト待ち
}

// エンドロールを流す関数
function showEndroll() {
    // TRUE END到達回数を記録＆上書き保存
    trueEndingCount++;
    updateSaveData({ trueEndingCount: trueEndingCount }) // 下で定義
    // エンドロールにタイトルを指定
    document.querySelector('.endroll-title').textContent = document.title;
    // エンドロールを流す
    document.getElementById('endroll-container').style.display = 'flex';
    const wait = 12500; // アニメーション時間+余裕
    setTimeout(() => {
        document.getElementById('endroll-container').style.display = 'none'; // エンドロールを非表示
        displaySetupButton(true); // セットアップボタンを表示（タイトルに戻れるようにする）
    }, wait);
}


// ======= 関数の定義（システム系） =======

// 6日目以降、指定したパート（nextPart）までスキップする関数
function skipPartsCount(nowPart, nextPart) {
    // 6日目以降の各パートの長さの配列（級数配列の作成用）
    const partLength = [
        scenesPart6_1.length,
        scenesPart6_2.length,
        scenesPart6_2_1.length,
        scenesPart6_2_2.length,
        scenesPart6_2_3.length,
        scenesPart6_2_3_1.length,
        scenesPart6_2_3_2.length,
        scenesPart7_1.length,
        scenesPart7_2.length,
        scenesPart7_3.length,
        scenesPart7_4.length,
    ];
    // 6日目以降の各パートの長さの級数の配列（計算用）
    let partLengthSum = new Array(11); // サイズを指定
    partLengthSum[0] = partLength[0]; // 級数の初項を代入
    // partLengthの値を繰り返し足して級数を定義
    for (let i = 0; i < partLengthSum.length-1; i++) {
        partLengthSum[i+1] = partLengthSum[i] + partLength[i+1];
    } 
    // nowPart, nextPartの候補（インデックス番号が partLengthSum と対応 → 計算に用いる）
    const partNumber = [
        '6_1', '6_2', '6_2_1', '6_2_2', '6_2_3', '6_2_3_1',
        '6_2_3_2', '7_1', '7_2', '7_3', '7_4',
    ];
    // 計算結果を返す
        // (nowPart から nextPart までの級数 +1) = (6_1から nextPart までの級数) - (6_1からnowPartまでの級数) +1
        // これにより nextPart の１つ目のインデックスを指定できる
    return partLengthSum[partNumber.indexOf(nextPart)-1]
     - partLengthSum[partNumber.indexOf(nowPart)] + 1;
}

// 選択肢による分岐の定義（選択肢を作成、表示 → 選択した回答を記録＆自動で対応する移動先へ）
function showChoices(choiceArray) {
    const choicesBox = document.getElementById('choices');
    choicesBox.innerHTML = ''; // 前の選択肢を全てクリア
    choicesBox.style.display = 'flex';
    choiceArray.forEach(choice => { //choicesの各要素に対して
        const btn = document.createElement('button'); // ボタンを作る
        btn.classList.add('choice'); // chiceクラスに加える（CSSによるレイアウトの指定）
        btn.textContent = choice.text; // テキストを指定
        // 選択肢をクリックした場合
        btn.addEventListener('click', () => {
            lastChoiceText = choice.text; // 選んだ回答を記録
            if (dayCount <= 5) {
                pass[dayCount-1] = lastChoiceText; // 回答をパスワードとして保存
            }
            choicesBox.style.display = 'none'; //　ボタンを非表示
            // 移動先の指定
            const nextScene = choice.nextScene
            if (Array.isArray(nextScene)) { // 6日目以降の分岐の場合、skipPartsCountで移動先を指定
                currentScene = currentScene + skipPartsCount(nextScene[0], nextScene[1]);
            } else { // 通常時
                currentScene = currentScene + choice.nextScene; // (現在の番号+指定数字)の番号に飛ぶ
            }
            // 次へボタンを表示＆有効化
            next.style.display = 'block';
            next.disabled = false;
            next.click(); // 自動で次へをクリック
        });
        choicesBox.appendChild(btn); // choiceBoxにボタンを追加（次回クリアするため）
    });
}
  
// セーブ関数
function saveGame() {
    // 保存内容
    const saveData = {
        // 重要変数
        currentScene: currentScene,
        dayCount: dayCount,
        lastChoiceText: lastChoiceText,
        pass: pass,
        endingCount: endingCount,
        trueEndingCount: trueEndingCount,
        // テキスト、名前
        currentText: text.innerText,
        currentName:Name.innerText,
        // 画像、BGMのURL
        currentBackgroundUrl: backgroundUrl,
        currentCharFaceUrls: charFaceUrls,
        currentBgmUrl: bgmUrl,
        // キャラ画像のインラインスタイル
        mainDivStyle: mainDiv.getAttribute('style'),
        wifeDivStyle: wifeDiv.getAttribute('style'),
        sonDivStyle: sonDiv.getAttribute('style'),
    };
    // ローカルストレージに保存
    localStorage.setItem('mySaveData', JSON.stringify(saveData));
    alert('セーブしました！ここまでプレイお疲れ様です！');
}

// ロード関数
function loadGame() {
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
    currentScene = parsed.currentScene;
    dayCount = parsed.dayCount;
    lastChoiceText = parsed.lastChoiceText;
    pass = parsed.pass;
    endingCount = parsed.endingCount;
    trueEndingCount = parsed.trueEndingCount;

    // テキスト、名前を復元
    text.innerText = parsed.currentText;
    Name.innerText = parsed.currentName;

    // 画像、bgmの復元
    backgroundUrl = parsed.currentBackgroundUrl;
    charFaceUrls = parsed.currentCharFaceUrls,
    bgmUrl = parsed.currentBgmUrl;
    // キャラ画像のインラインスタイルの復元
    mainDiv.setAttribute('style', parsed.mainDivStyle);
    wifeDiv.setAttribute('style', parsed.wifeDivStyle);
    sonDiv.setAttribute('style', parsed.sonDivStyle);
    
    return true; // ロード完了の判別に用いる
}

// 一部の値のみ上書き保存する関数（保存する値をオブジェクトで入力：複数指定可）
function updateSaveData(updatedValues) {
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


// ======= 定数、変数の宣言 =======

// 画像、BGMのURLをまとめたオブジェクト
const backgroundImage = {
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
const mainImage = {
    normal: 'character/character_main_normal.png',
    resolve: 'character/character_main_resolve.png',
    back: 'character/character_main_back.png',
    memo: 'character/character_main_memo.png', //中央に表示するためここに追加
    hidden: 'none',
}
const wifeImage = {
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
const sonImage = {
    normal: 'character/character_son_normal.png',
    resolve: 'character/character_son_resolve.png',
    smile: 'character/character_son_smile.png',
    youngN: 'character/character_son_young_normal.png',
    youngA: 'character/character_son_young_angry.png',
    complain: 'character/character_son_complain.png',
    hidden: 'none',
}
const bgmArray = {
    main: 'BGM/BGM_main.mp3',
    past: 'BGM/BGM_past.mp3',
    serious: 'BGM/BGM_serious.mp3',
    fire: 'BGM/BGM_fire.mp3',
    ending: 'BGM/BGM_ending.mp3',
    stop: 'none',
}
// キャラ画像のオブジェクトをまとめたオブジェクト
const faceImages = {main: mainImage, wife: wifeImage, son: sonImage}

// 全てのシーンのtext、Name、キャラの表情差分（各パートを展開して結合：中身は別のJS）
const scenes = [
    ...scenesPart1_1,
    ...scenesPart1_2,
    ...scenesPart2_1,
    ...scenesPart2_2,
    ...scenesPart3_1,
    ...scenesPart3_2,
    ...scenesPart4_1,
    ...scenesPart4_2,
    ...scenesPart5_1,
    ...scenesPart5_2,
    ...scenesPart6_1,
    ...scenesPart6_2,
    ...scenesPart6_2_1,
    ...scenesPart6_2_2,
    ...scenesPart6_2_3,
    ...scenesPart6_2_3_1,
    ...scenesPart6_2_3_2,
    ...scenesPart7_1,
    ...scenesPart7_2,
    ...scenesPart7_3,
    ...scenesPart7_4,
];

// 変数の宣言
let currentScene = 0; // scene番号（これを進めてゲーム進行）
let dayCount = 1; // 何日目かを数える
let lastChoiceText = ''; // 選択肢で最後に選んだ回答を記録
let pass = ['', '', '', '', '']; // 6日目の分岐の判断に用いるパスワード
let endingCount = 0; // エンディングに到達した回数を記録
let trueEndingCount = 0; // TRUE ENDに到達した回数を記録
let backgroundUrl = backgroundImage.room; // 背景のURL = 最初の背景
let charFaceUrls = {main: 'none', wife: 'none', son: 'none'}; // charのURLを保存
let bgmUrl = bgmArray.main // BGMのURL = 最初のBGM
let isBgmPlaying = true; // BGMの再生状態（最初はオン）

// 変更を与えるCSSのID
const next = document.getElementById('next'); // 次へボタン
const Name = document.getElementById('name'); // 話しているキャラの名前
const textContainer = document.getElementById('text-container'); // 吹き出し内テキストのスタイル指定用
const text = document.getElementById('text'); // 吹き出し内テキスト
const mainDiv = document.getElementById('char-main'); // mainキャラ画像のdiv
const wifeDiv = document.getElementById('char-wife'); // wifeキャラ画像のdiv
const sonDiv = document.getElementById('char-son'); // sonキャラ画像のdiv
const charDivs = {main: mainDiv, wife: wifeDiv, son: sonDiv}; // divをまとめたオブジェクト

// ======= タイトル画面操作時の実行内容 =======

// 起動時：特定変数の読み込み、タイトル画面での背景、タイトルの表示
window.addEventListener('DOMContentLoaded', () => {
    const saveData = localStorage.getItem('mySaveData');
    if (saveData) {
        const parsed = JSON.parse(saveData);
        // 一部のセーブデータだけ読み込む
            // endingCount：ヒントの表示に影響
            // trueEndingCount：背景変更に影響
        if (parsed.endingCount) {
            endingCount = parsed.endingCount;
        }
        if (parsed.trueEndingCount) {
            trueEndingCount = parsed.trueEndingCount;
        }
    }
    // 起動時の背景の表示
    const bg1 = document.getElementById('bg1');
    if (trueEndingCount > 0) { // TRUE END回収後
        bg1.style.backgroundImage = `url('${backgroundImage.sakura}')`;
    } else { // 通常時
        bg1.style.backgroundImage = `url('${backgroundImage.tsubomi}')`;
    }
    // ゲームタイトルの表示
    document.getElementById('game-title').textContent = document.title;
});

// BGMマークのクリック時：ミュートのオン/オフ切り替え
document.getElementById('bgm-toggle').addEventListener('click', () => {
    const bgm = document.getElementById('bgm');
    const toggle = document.getElementById('bgm-toggle');

    if (isBgmPlaying) {
        bgm.volume = 0; // ボリューム0
        toggle.innerText = '🔇'; // オフマークに変更
    } else {
        bgm.volume = 0.3; // 通常のボリューム
        toggle.innerText = '🔈'; // オンマークに変更
    }
    isBgmPlaying = !isBgmPlaying; // 状態を反転
});

// newgameクリック時：ゲーム画面に切り替える
document.getElementById('newgame').addEventListener('click', () => {
    displayTitlePage(false); // タイトル画面を消す
    const wait = 3000; // タイトルのフェードアウト待ち3秒＆背景切り替え待ち3秒
    setTimeout(() => {
        changeBackground(backgroundUrl); // 背景を切り替える（初期値）
        setTimeout(() => {
            // 日付の自動表示
            showDays(scenes[currentScene].dayText, () => { // showDays完了後に呼ばれる：所要時間3.01秒
                playBGM(bgmUrl); // BGMの再生
                displayTextBox(true); // text-boxのフェードイン
                text.innerHTML = scenes[currentScene].text; // 最初のシーンのテキストを指定
                textContainer.style.display = 'flex';
                setTimeout (() => {
                    textContainer.style.opacity = '1'; // textのフェードイン
                }, 10); // 時間差でバグ回避
                currentScene++; // scene番号+1で次のシーンを指定
            });
        }, wait);
    }, wait);
});

// continueクリック時：セーブしたゲーム画面に切り替える
document.getElementById('continue').addEventListener('click', () => {
    const loaded = loadGame() // セーブデータをロード＆成功したかどうかを取得
    if (loaded) { // ロードできた場合
        // キャラ画像のフェードイン準備
        for (let key in charDivs) {
            if (charDivs[key].style.display == 'none') { // 'none'の場合 → URLも'none'に書き換え
                charFaceUrls[key] = 'none';
            }
            charDivs[key].style.display = 'none'; //一旦非表示
            charDivs[key].style.opacity = '0'; // 透明度リセット
        }
        displayTitlePage(false); // タイトル画面を消す
        const wait1 = 2000; // タイトルのフェードアウト完了待ち3秒-調整1秒
        setTimeout(() => {
            changeBackground(backgroundUrl); // 背景を切り替える
            // テキスト、名前の透明度をリセット
            textContainer.style.opacity = '0';
            Name.style.opacity = '0';
            const wait2 = 3000; // 背景の切り替え待ち3秒
            setTimeout(() => {
                // 日付の自動表示
                let dayText = (dayCount <= 7) ? 'day' : '数年後'; // 7日目までと数年後の場合で表示を変える
                showDays(dayText, () => { // showDays完了後に呼ばれる：所要時間3.01秒
                    playBGM(bgmUrl); // BGMの再生
                    // キャラ画像のフェードイン
                    for (let key in charDivs) {
                        changeFace(charDivs[key], charFaceUrls[key]);
                    }
                    displayTextBox(true) // text-boxのフェードイン
                    textContainer.style.display = 'flex';
                    Name.style.display = 'block';
                    setTimeout (() => {
                        textContainer.style.opacity = '1'; // textのフェードイン
                        Name.style.opacity = '1'; // 名前のフェードイン
                    }, 10);
                    const scene = scenes[currentScene];
                    // セーブしたシーンに選択肢がある場合の処理
                    if (scene.choices && scene.choices.length > 0) {
                        next.style.display = 'none'; // 次へボタンの非表示
                        showChoices(scene.choices); // 分岐の定義関数適用
                    }
                });
            }, wait2);
        }, wait1);
    }
});

// resetクリック時：confirmで確認z → okならセーブデータを削除（endingCount, trueEndingCountもリセット）
document.getElementById('reset').addEventListener('click', () => {
    if (confirm('クリア回数もリセットされます。\n本当にセーブデータを削除しますか？')) {
        localStorage.removeItem('mySaveData'); // セーブデータを削除
        endingCount = 0; // エンディング到達回数をリセット
        trueEndingCount = 0; // TRUE END到達回数をリセット
        changeBackground(backgroundImage.tsubomi); // 通常時のタイトル画面背景に戻す
        alert('セーブデータを削除しました😭');
    }
});

// hintをクリックした場合：ヒントを表示
document.getElementById('hint').addEventListener('click', () => {
    const hintMessage = document.getElementById('check-message');
    // タイトルボタンを非表示
    document.querySelectorAll('.title-button').forEach(btn => {
        btn.style.display = 'none';
    });
    // ヒントの表示
    if (endingCount > 0) { // エンディング到達前
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
});


// ======= セットアップボタン操作時の実行内容 =======

// セーブをクリックした場合：confirmで確認 → okならセーブ
document.getElementById('save').addEventListener('click', () => {
    if (confirm('前のセーブデータに上書きされます。\n本当にセーブしますか？')) {
        saveGame() // セーブする
    }
});

// タイトルへをクリックした場合：確認画面を表示 → yesでタイトル画面に戻る / noで確認画面を閉じる
document.getElementById('title-back').addEventListener('click', () => {
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
        if (scenes[currentScene].choices) {
            document.getElementById('choices').style.display = 'flex';
        }
        // 確認ボタンを非表示
        document.querySelectorAll('.check-button').forEach(btn => {
            btn.style.display = 'none'; 
        });
        // 全てのボタンを有効化
        document.querySelectorAll('button').forEach(btn => {
            btn.disabled = false;
        });
    });
    // yes をクリックした場合：タイトル画面に戻る＆変数リセット
    document.getElementById('yes').addEventListener('click', () => {
        checkMessage.style.display ='none'; // 確認メッセージを非表示
        // 確認ボタンを非表示
        document.querySelectorAll('.check-button').forEach(btn => {
            btn.style.display = 'none'; 
        });
        playBGM(bgmArray.stop); // BGMを止める
        displayTextBox(false); // テキストボックスを非表示
        document.getElementById('days').style.display = 'none'; // エンディングメッセージを非表示
        // 変数を初期値に戻す（endingCount, trueEndingCount, isBgmPlayingを除く）
        currentScene = 0;
        dayCount = 1;
        lastChoiceText = '';
        pass = ['', '', '', '', ''];
        backgroundUrl = backgroundImage.room;
        charFaceUrls = {main: 'none', wife: 'none', son: 'none'};
        bgmUrl = bgmArray.main
        // 背景画像を変更
        if (trueEndingCount > 0) { // TRUE END到達済みの場合
            changeBackground(backgroundImage.sakura);
        } else { // 通常時
            changeBackground(backgroundImage.tsubomi);
        }
        // キャラ画像のインラインスタイルを削除（CSSの状態にリセット）
        mainDiv.removeAttribute('style');
        wifeDiv.removeAttribute('style');
        sonDiv.removeAttribute('style');
        document.getElementById('days').removeAttribute('style'); // daysのインラインスタイルを削除
        // タイトル画面を表示
        displayTitlePage(true);
        const wait = 3000; // フェードイン待ち3秒
        setTimeout (() => {
            // 全てのボタンを有効化
            document.querySelectorAll('button').forEach(btn => {
                btn.disabled = false;
            });
        }, wait);
    });
});


// ======= ゲーム画面進行時の実行内容 =======

// 次へボタンのクリックでゲーム画面を進行
next.addEventListener('click', () => {
    const scene = scenes[currentScene];
    next.disabled = true; // 次へボタン無効化（連打対策）
    // セットアップボタンを無効化（バグ対策）
    document.querySelectorAll('.setup-button').forEach(btn => {
        btn.disabled = true;
    });
    // 吹き出しの文字をフェードアウト
    Name.style.opacity = '0';
    textContainer.style.opacity = '0';

    if (scene.dayText) { // daysを表示する場合（待機時間が異なるため場合わけ）
        dayCount++; // 日付を更新
        const wait = 1000; // days表示前に1秒間を開ける。
        setTimeout(() => {
            const backgroundKey = scene.background;
            backgroundUrl = backgroundImage[backgroundKey];
            if (scene.dayText != 'day') {
                // showDaysが日付表示でない場合（ = テキスト表示の場合）→ 先に背景を変更
                changeBackground(backgroundUrl);
                playBGM(scene.bgm); // bgmをストップ
            } 
            showDays(scene.dayText, () => { // showDays完了後に呼ばれる：所要時間3.01秒
                // BGMのURLを取得 → 変更
                if (scene.bgm) {
                    const bgmKey = scene.bgm;
                    bgmUrl = bgmArray[bgmKey];
                    playBGM(bgmUrl); // BGMの再生
                }
                displayTextBox(true) // text-boxのフェードイン
                text.innerHTML = scene.text; // テキストの指定
                textContainer.style.opacity = '1'; // textのフェードイン
                
                currentScene++; // scene番号+1で次のシーンを指定

                // 次へボタン、セットアップボタンの有効化
                next.disabled = false;
                document.querySelectorAll('.setup-button').forEach(btn => {
                    btn.disabled = false;
                });
                // showDaysが日付表示の場合（ = テキスト表示でない場合）→ 最後に背景を変更
                if (scene.dayText == 'day' && scene.background) {
                    changeBackground(backgroundUrl);
                }
            });
        }, wait);
    } else { // daysを表示しない場合
        // キャラ画像のURLを取得 → 変更
        const sceneFaceKeys = {main: scene.mainFace, wife: scene.wifeFace, son: scene.sonFace}; // このシーンの表情keyを取得
        for (let key in charDivs) {
            if (sceneFaceKeys[key] && sceneFaceKeys[key] != 'stay') { // 表情keyが存在かつstayでない場合
                const faceImage = faceImages[key]; // keyの画像配列を取得
                const faceKey = sceneFaceKeys[key]; // ↑の画像配列内でのkeyを取得
                charFaceUrls[key] = faceImage[faceKey]; // URLを更新
                changeFace(charDivs[key], charFaceUrls[key]); // キャラ画像を変更
            }
        }
        // キャラ画像のスタイル修正（scenesで指定があった場合のみ）
        if (scene.position === 'son') { // char-sonの画像を左に移動（sonとwifeの会話発生に備えて＆伏線）
            sonDiv.style.right = 'none';
            sonDiv.style.left = '-198px';
        } else if (scene.position === 'main') { // char-mainの画像を拡大（後半の画像サイズに合わせて調整）
            mainDiv.style.width = '70%';
            mainDiv.style.bottom = '-10px';
        }

        // BGMのURLを取得 → 変更
        if (scene.bgm) {
            const bgmKey = scene.bgm;
            bgmUrl = bgmArray[bgmKey];
            playBGM(bgmUrl); // BGMの再生
        }

        // 背景変更の場合わけ
        if (scene.end) { // エンディングの場合（scene に end がある場合）
            endingCount++; // エンディング到達回数を記録
            updateSaveData({ endingCount: endingCount }) // エンディング到達回数を上書き保存 
            displayTextBox(false); // テキストボックスを非表示
            const endMessage = document.getElementById('days') // daysをエンディングメッセージに用いる
            endMessage.style.opacity = '0'; // 透明度0
            const wait1 = 2000; // フェードアウト待ち1秒 + 1秒間を開ける
            setTimeout(() => {
                const backgroundKey = scene.background;
                backgroundUrl = backgroundImage[backgroundKey]; // 背景のURLを更新
                changeBackground(backgroundUrl); // 背景変更
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
                                showEndroll()
                            }, wait2);
                        } else { // 通常時 → セットアップボタンの表示
                            displaySetupButton(true);
                        }
                    }, 10); // 時間差でバグ回避
                }, wait2);
            }, wait1);
        } else if (scene.background) {  // 通常時の背景の変更（scene に background がある場合）
            const backgroundKey = scene.background;
            backgroundUrl = backgroundImage[backgroundKey]; // 背景のURLを更新
            // 車椅子移動演出の有無
            if (scene.wheel) { // 演出あり
                wheelChair(backgroundImage[scene.wheel], backgroundUrl); // 車椅子移動演出の呼び出し
            } else { //演出なし（通常の背景変更のみ）
                // 次へボタン、セットアップボタンの非表示
                next.style.display = 'none';
                displaySetupButton(false);
                changeBackground(backgroundUrl); // 背景を変更
                const wait = 3000; //背景変更待ち3秒
                setTimeout(() => {
                    // 次へボタン、セットアップボタンの表示
                    next.style.display = 'block';
                    displaySetupButton(true);
                }, wait);
            }
        }

        // 吹き出し内の表示（名前、テキスト、選択肢）
        const wait = 500; // 文字のフェードアウト待ち0.5秒
        setTimeout(() => {
            Name.innerHTML = scene.name;
            text.innerHTML = scene.text.replace('${lastChoiceText}', lastChoiceText); // 選択肢の回答をテキストにも表示可能
            setTimeout(() => {
                // テキスト、名前をフェードイン
                Name.style.opacity = '1';
                textContainer.style.opacity = '1';
            }, 10); // 時間差でバグ回避

            // 次のシーン指定の場合わけ
            if (scene.choices && scene.choices.length > 0) { // 選択肢がある場合
                next.style.display = 'none'; // 次へボタンの非表示
                showChoices(scene.choices); // 分岐の定義関数適用
            } else if (
                scene.nextSceneAns && 
                pass.join(',') === 'くつした,ルマンダ,マインクリエイティブ,いつも凡人だった君たちへ,すいか'
            ) { // 隠しルートへの分岐
                currentScene = currentScene + scene.nextSceneAns;
            } else if (Array.isArray(scene.nextScene)) { // 6日目以降の分岐先の指定（2×1で指定）
                const nextScene = scene.nextScene
                currentScene = currentScene + skipPartsCount(nextScene[0], nextScene[1]);
            } else if (scene.nextScene) { // その他の移動先の指定（1×1で指定）
                currentScene = currentScene + scene.nextScene;
            } else { // 通常時はscene番号+1で次のシーンを指定
                currentScene++;
            }
            // 次へボタン、セットアップボタンの有効化
            next.disabled = false;
            document.querySelectorAll('.setup-button').forEach(btn => {
                btn.disabled = false;
            });
        }, wait);
    }
});