
// 背景切り替えの定義
function changeBackground(newImageUrl) {
    const bg1 = document.getElementById('bg1');
    const bg2 = document.getElementById('bg2');
    // bg2 に画像をセットしてフェードイン
    bg2.style.backgroundImage = `url('${newImageUrl}')`;
    bg2.style.opacity = 1;
    // 少し待ってから bg1 と bg2 の役割を入れ替える
    setTimeout(() => { // フェードイン待ち3秒
        bg1.style.backgroundImage = `url('${newImageUrl}')`;
        bg2.style.opacity = 0;
    }, 3000);
}

// タイトル画面の表示、非表示を切り替える関数
function displayTitlePage(visible) {
    const ids = ['game-title', 'newgame', 'continue', 'reset', 'hint', 'title-box'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (visible && el) { // visibleが true の場合→表示
            el.style.display = 'block';
            setTimeout(() => {
                el.style.opacity = '1';
            }, 10);
        } else if (!visible && el) { // visibleが false の場合→非表示
            el.style.opacity = '0';
            setTimeout(() => { // フェードアウト待ち3秒
                el.style.display = 'none';
            }, 3000);
        }
    });
}

// セットアップボタンの表示、非表示を切り替える関数
function displaySetupButton(visible) {
    document.querySelectorAll('.setup-button').forEach(btn => {
        btn.style.display = visible ? 'block' : 'none'; // visibleが true なら表示、false なら非表示
    });
}

// テキストボックスの表示、非表示を切り替える関数
function displayTextBox(visible) {
    const textBox = document.getElementById('text-box');
    const next = document.getElementById('next');
    if (visible) { // trueの場合→表示
        // text-boxのフェードイン
        textBox.style.display = 'block';
        setTimeout(() => {
            textBox.style.opacity = '1';
        }, 10); 
        // 次へボタン、セットアップボタンの表示
        next.style.display = 'block';
        displaySetupButton(true);

    } else if (!(visible)) { // falseの場合→非表示
        // 次へボタン、セットアップボタンの非表示
        next.style.display = 'none';
        displaySetupButton(false);
        // text-boxのフェードアウト
        textBox.style.opacity = '0';
        setTimeout(() => { // フェードアウト待ち1秒
            textBox.style.display = 'none';
        }, 1000);
    }
}

// 日数を表示→非表示にする関数
function displayDays(dayText, callback) {
    const days = document.getElementById('days');
    days.style.display = 'block';
    if (dayText == 'day') { // 日数を出力する場合'day'を入力
        days.textContent = `〜${dayCount}日目〜`;
    } else { // 日数以外を表示する場合はこっち
        days.textContent = `〜${dayText}〜`;
    }
    setTimeout(() => {
        days.style.opacity = '1';
        setTimeout(function () { // フェードイン待ち1秒+1秒間表示
            days.style.opacity = '0';
            setTimeout(function () { // フェードアウト待ち1秒
                days.style.display = 'none';
                if (callback) callback(); // 実行後に呼び出し
            }, 1000);
        }, 2000);
    }, 10);
}

// キャラクター画像を切り替える関数の定義
function changeFace(charDiv, newUrl) {
    const imgElement = charDiv.querySelector('img'); // imgを取得
    // newUrlが'stay'なら変更なし
    if (newUrl === 'stay') return;

    charDiv.style.opacity = '0'; // 現在の画像をフェードアウト
    // char-mainのみフェードアウト時間が違うためtimeの定義を場合分け
    if(charDiv === mainDiv) {
        time = 1500;
    } else {
        time = 300;
    }
    setTimeout(() => { // フェードアウト待ちtime秒
        charDiv.style.display = 'none';
        // newUrlが'none'ならフェードアウトのみ
        if (newUrl === 'none') return;
  
        imgElement.setAttribute('src', newUrl); // imgのsrcを新しい画像のURLに更新
        // 新しい画像をフェードイン
        charDiv.style.display = 'block';
        setTimeout(() => {
            charDiv.style.opacity = '1';
        }, 10);
    }, time);
}

// 分岐の定義（選択肢を作成、表示 → 選択した回答を記録＆自動で対応する移動先へ）
function showChoices(choiceArray) {
    const choicesBox = document.getElementById('choices');
    choicesBox.innerHTML = ''; // 前の選択肢を全てクリア
    choicesBox.style.display = 'flex';
    choiceArray.forEach(choice => { //choicesの各要素に対して
        const btn = document.createElement('button'); // ボタンを作る
        btn.classList.add('choice'); // chiceクラスに加える
        btn.textContent = choice.text;
        btn.addEventListener('click', () => {
            lastChoiceText = choice.text; // 選んだ回答を記録
            choicesBox.style.display = 'none'; //　ボタンを非表示
            // 移動先の指定
            const nextScene = choice.nextScene
            if (Array.isArray(choice.nextScene)) { // 6日目以降の分岐の場合、skipPartsCountで移動先を指定
                currentScene = currentScene + skipPartsCount(nextScene[0], nextScene[1]);
            } else {
                currentScene = currentScene + choice.nextScene; // (現在の番号+指定数字)の番号に飛ぶ
            }
            // 次へボタンを表示&有効化
            next.style.display = 'block';
            next.disabled = false;
            next.click(); // 自動で次へをクリック
        });
        choicesBox.appendChild(btn); // choiceBoxにボタンを追加（次回クリアするため）
    });
}

// 車椅子移動演出の定義（専用背景、main画像を4秒表示 → 自動で次の画面に切り替える）
function wheelChair(wheelChairBackgroundUrl, newBackgroundUrl) {
    // 次へボタン、セットアップボタンの非表示
    next.style.display = 'none';
    displaySetupButton(false);
    // 専用の背景に変更
    changeBackground(wheelChairBackgroundUrl);
    // mainImage.backをフェードイン
    changeFace(mainDiv, mainImage.back);
    setTimeout(() => { // キャラ画像変更待ち0.31秒+4秒表示
        changeBackground(newBackgroundUrl); // 新しい背景に変更
        changeFace(mainDiv, 'none'); // mainImageをフェードアウト
        setTimeout(() => { // 背景変更待ち3秒
            // 次へボタン、セットアップボタンの表示
            next.style.display = 'block';
            displaySetupButton(true);
            next.click(); // 自動で次へボタンをクリック
        }, 3000);
    }, 4310);
}

// 画像のURLまとめ
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
    stay: 'stay',
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
    stay: 'stay',
    hidden: 'none',
}
const sonImage = {
    normal: 'character/character_son_normal.png',
    resolve: 'character/character_son_resolve.png',
    smile: 'character/character_son_smile.png',
    youngN: 'character/character_son_young_normal.png',
    youngA: 'character/character_son_young_angry.png',
    complain: 'character/character_son_complain.png',
    stay: 'stay',
    hidden: 'none',
}

// 全てのシーンのtext、Name、キャラの表情差分（各パートを展開して結合）→ 中身は別のJS
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

// 変数の定義
let currentScene = 0; // scene番号（これを進めてゲーム進行）
let dayCount = 1; // 何日目かを数える
let lastChoiceText = ''; // 選択肢で最後に選んだ回答を記録する
let pass = ['', '', '', '', '']; // 分岐の判断に用いるパスワード
let backgroundUrl = 'none';
let mainFaceUrl = 'none';
let wifeFaceUrl = 'none';
let sonFaceUrl = 'none';

// 6日目以降の各パートの長さ
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
// 6日目以降の各パートの長さの級数
let partLengthSum = new Array(11); // サイズを指定
partLengthSum[0] = partLength[0]; // 級数の初項
for (let i = 0; i < partLengthSum.length-1; i++) { // 級数を定義
    partLengthSum[i+1] = partLengthSum[i] + partLength[i+1];
} 
const partNumber = [ // インデックス番号を各パートの識別番号とする
    '6_1', '6_2', '6_2_1', '6_2_2', '6_2_3', '6_2_3_1',
    '6_2_3_2', '7_1', '7_2', '7_3', '7_4',
];
// 6日目以降、指定したパートまでスキップする関数（これを用いる）
function skipPartsCount(nowPart, nextPart) {
    // nowPart から nextPart までの級数 +1 を返す = 6_1から nextPart までの級数 - 6_1からnowPartまでの級数 +1
    return partLengthSum[partNumber.indexOf(nextPart)-1]
     - partLengthSum[partNumber.indexOf(nowPart)] + 1;
}

// 変更を与えるCSSのID
const Name = document.getElementById('name');
const text = document.getElementById('text');
const mainDiv = document.getElementById('char-main');
const wifeDiv = document.getElementById('char-wife');
const sonDiv = document.getElementById('char-son');
const next = document.getElementById('next');

// セーブ関数
function saveGame() {
    // 保存内容
    const saveData = {
        // 重要変数
        currentScene: currentScene,
        dayCount: dayCount,
        lastChoiceText: lastChoiceText,
        pass: pass,
        // テキスト、名前
        currentText: text.innerText,
        currentName:Name.innerText,
        // 画像URL
        currentBackgroundUrl: backgroundUrl,
        currentMainFaceUrl: mainFaceUrl,
        currentWifeFaceUrl: wifeFaceUrl,
        currentSonFaceUrl: sonFaceUrl,
        // キャラの表示状態
        mainDivDisplay: mainDiv.style.display,
        wifeDivDisplay: wifeDiv.style.display,
        sonDivDisplay: sonDiv.style.display,
    };
    // ローカルストレージに保存
    localStorage.setItem('mySaveData', JSON.stringify(saveData));
    alert('セーブしました！');
}
// ロード関数
function loadGame() {
    const saveData = localStorage.getItem('mySaveData');
    let load = false;
    if (!saveData) {
        alert('セーブデータがありません。');
        return;
    }
    const parsed = JSON.parse(saveData);
    // 各変数に復元
    currentScene = parsed.currentScene;
    dayCount = parsed.dayCount;
    lastChoiceText = parsed.lastChoiceText;
    pass = parsed.pass;

    // テキスト、名前を復元
    text.innerText = parsed.currentText;
    Name.innerText = parsed.currentName;

    // 背景、キャラ画像の復元
    const savedBackgroundUrl = parsed.currentBackgroundUrl;
    let savedMainFaceUrl = parsed.currentMainFaceUrl;
    let savedWifeFaceUrl = parsed.currentWifeFaceUrl;
    let savedSonFaceUrl = parsed.currentSonFaceUrl;
    if (parsed.mainDivDisplay === 'none') {savedMainFaceUrl = 'none';}
    if (parsed.wifeDivDisplay === 'none') {savedWifeFaceUrl = 'none';}
    if (parsed.sonDivDisplay === 'none') {savedSonFaceUrl = 'none';}
    
    load = true;
}

// 以下、実行内容
// 起動時：タイトル画面での背景、タイトルの表示
document.getElementById('bg1').style.backgroundImage = `url('${backgroundImage.tsubomi}')`;
document.getElementById('game-title').textContent = document.title;

// newgameクリック時：ゲーム画面に切り替える
document.getElementById('newgame').addEventListener('click', function() {
    // タイトル画面を消す
    displayTitlePage(false);
    setTimeout(function() { // タイトルのフェードアウト完了待ち3秒
        changeBackground(backgroundImage.room); // 背景を切り替える
        setTimeout(function() { // 背景切り替え完了待ち3秒
            // 日付の自動表示
            displayDays(scenes[currentScene].dayText, () => { // displayDays完了後に呼ばれる
                displayTextBox(true) // text-boxのフェードイン
                text.innerHTML = scenes[currentScene].text;
                text.style.display = 'block';
                setTimeout (() => {
                    text.style.opacity = '1'; // textのフェードイン
                }, 10);
                currentScene++; // scene番号+1で次のシーンを指定
            });
        }, 3000);
    }, 3000);
});

// continuegameクリック時：セーブしたゲーム画面に切り替える
document.getElementById('continue').addEventListener('click', function() {
    loadGame() // セーブデータをロード
    if (load) {
        // タイトル画面を消す
        displayTitlePage(false);
        setTimeout(function() { // タイトルのフェードアウト完了待ち3秒
            changeBackground(savedBackgroundUrl); // 背景を切り替える
            // テキスト、名前の透明度をリセット
            text.style.opacity = '0';
            Name.style.opacity = '0';
            setTimeout(function() { // 背景切り替え完了待ち3秒
                // 日付の自動表示
                displayDays('day', () => { // displayDays完了後に呼ばれる
                    changeFace(mainDiv, savedMainFaceUrl);
                    changeFace(wifeDiv, savedWifeFaceUrl);
                    changeFace(sonDiv, savedSonFaceUrl);
                    displayTextBox(true) // text-boxのフェードイン
                    text.style.display = 'block';
                    Name.style.display = 'block';
                    setTimeout (() => {
                        text.style.opacity = '1';
                        Name.style.opacity = '1';
                    }, 10);
                    currentScene++; // scene番号+1で次のシーンを指定
                });
            }, 3000);
        }, 3000);
    }
});

// セーブボタンをクリックした場合
document.getElementById('save').addEventListener('click', function() {
    saveGame() 
});
// タイトルへをクリックした場合
document.getElementById('title-back').addEventListener('click', function() {
    displayTextBox(false); // テキストボックスを非表示
    // タイトルボタンを無効化
    document.querySelectorAll('.title-button').forEach(btn => {
        btn.disabled = true;
    });
    // 変数をリセット
    currentScene = 0;
    dayCount = 1;
    lastChoiceText = '';
    pass = ['', '', '', '', ''];
    // 背景画像を変更
    changeBackground(backgroundImage.tsubomi)
    // キャラを非表示
    changeFace(mainDiv, 'none');
    changeFace(wifeDiv, 'none');
    changeFace(sonDiv, 'none');
    // タイトル画面を表示
    displayTitlePage(true);
    setTimeout (() => { // フェードイン待ち3秒
        // タイトルボタンを有効化
        document.querySelectorAll('.title-button').forEach(btn => {
            btn.disabled = false;
        });
    }, 3000);
});

// 次へボタンのクリックでゲーム画面を進行
next.addEventListener('click', function() {
    const scene = scenes[currentScene];
    next.disabled = true; // 次へボタン無効化（バグ対策）
    // セットアップボタンを無効化（バグ対策）
    document.querySelectorAll('.setup-button').forEach(btn => {
        btn.disabled = true;
    });
    // 吹き出しの文字をフェードアウト
    Name.style.opacity = '0';
    text.style.opacity = '0';

    if (scene.dayText) { // daysを表示する場合
        dayCount++; // 日付を更新
        setTimeout(() => { // days表示前に1.5秒間を開ける。
            const backgroundKey = scene.background;
            backgroundUrl = backgroundImage[backgroundKey];
            if (scene.dayText != 'day') {
                // 日付表示でない場合、先に背景を変更
                changeBackground(backgroundUrl);
            } 
            displayDays(scene.dayText, () => { // displayDays完了後に呼ばれる
                displayTextBox(true) // text-boxのフェードイン
                text.innerHTML = scene.text;
                text.style.opacity = '1'; // textのフェードイン
                
                currentScene++; // scene番号+1で次のシーンを指定

                // 次へボタン、セットアップボタンの有効化
                next.disabled = false;
                document.querySelectorAll('.setup-button').forEach(btn => {
                    btn.disabled = false;
                });

                // 日付表示の場合の背景の変更
                if (scene.dayText == 'day' && scene.background) {
                    changeBackground(backgroundUrl);
                }
            });
        }, 1500);
    } else { // daysを表示しない場合
        // キャラクター画像のURLを取得 → 変更
        if (scene.mainFace) {
            const mainFaceKey = scene.mainFace;
            mainFaceUrl = mainImage[mainFaceKey];
            changeFace(mainDiv, mainFaceUrl);
        }
        if (scene.wifeFace) {
            const wifeFaceKey = scene.wifeFace;
            wifeFaceUrl = wifeImage[wifeFaceKey];
            changeFace(wifeDiv, wifeFaceUrl);
        }
        if (scene.sonFace) {
            const sonFaceKey = scene.sonFace;
            sonFaceUrl = sonImage[sonFaceKey];
            changeFace(sonDiv, sonFaceUrl);
        }
        // 画像位置の修正（scenesで指定があった場合のみ）
        if (scene.position === 'son') {
            sonDiv.style.right = 'none';
            sonDiv.style.left = '-198px';
        } else if (scene.position === 'main') {
            mainDiv.style.width = '70%';
            mainDiv.style.bottom = '-10px';
        }

        // 背景変更の場合わけ
        if (scene.end) { // エンディングの場合
            displayTextBox(false);
            setTimeout(function(){
                // 背景の変更
                const backgroundKey = scene.background;
                backgroundUrl = backgroundImage[backgroundKey];
                changeBackground(backgroundUrl);
                // エンディングメッセージの透明度を初期化、フェード時間を修正
                const endMessage = document.getElementById('days')
                endMessage.style.opacity = '0';
                endMessage.style.transition = 'opacity 2.5s ease';
                setTimeout(function() {
                    // エンディングメッセージの表示
                    endMessage.style.display = 'block';
                    endMessage.innerHTML = scene.end;
                    setTimeout(function() {
                        endMessage.style.opacity = '1';
                        // セットアップボタンの表示
                        displaySetupButton(true);
                    }, 10);
                }, 2000);
            }, 2000);
        } else if (scene.background) {  // 通常時の背景の変更
            const backgroundKey = scene.background;
            backgroundUrl = backgroundImage[backgroundKey];
            // 車椅子演出の有無
            if (scene.wheel) { // 演出あり
                wheelChair(backgroundImage[scene.wheel], backgroundUrl);
            } else { //演出なし = 通常の背景変更のみ
                next.style.display = 'none'; // 次へボタンの非表示
                displaySetupButton(false);
                changeBackground(backgroundUrl);
                setTimeout(function() { //背景変更待ち3秒
                    next.style.display = 'block'; // 次へボタンの表示
                    displaySetupButton(true);
                }, 3000);
            }
        }
        // 吹き出し内の表示（名前、テキスト、選択肢）
        setTimeout(function() { // 文字のフェードアウト待ち0.5秒+0.01秒
            Name.innerHTML = scene.name;
            text.innerHTML = scene.text.replace('${lastChoiceText}', lastChoiceText); // 選択肢の回答を本文にも表示可能
            setTimeout(function() { // バグ回避のため0.01秒間を開ける
                Name.style.opacity = '1';
                text.style.opacity = '1';
            }, 10);

            // 次のシーン指定の場合わけ
            if (scene.choices && scene.choices.length > 0) { // 選択肢がある場合
                next.style.display = 'none'; // 次へボタンの非表示
                showChoices(scene.choices); // 分岐の定義関数適用
                if (dayCount <= 5) {
                    pass[dayCount-1] = lastChoiceText; // 選択肢の回答をパスワードとして保存
                }
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
        }, 510);
    }
});