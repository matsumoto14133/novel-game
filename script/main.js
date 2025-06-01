// 全てのclassをimport
import { GameManager } from './managers/GameManager.js';
import { UiManager } from './managers/UiManager.js';
import { AudioManager } from './managers/AudioManager.js';
import { ImageManager } from './managers/ImageManager.js';
import { SceneManager } from './managers/SceneManager.js';
import { SaveManager } from './managers/SaveManager.js';
import { EventBinder } from './managers/EventBinder.js';

// classを呼び出し
const uiManager = new UiManager();
const audioManager = new AudioManager();
const saveManager = new SaveManager();
const imageManager = new ImageManager(uiManager, saveManager);
const sceneManager = new SceneManager(uiManager, audioManager, saveManager, imageManager);
const gameManager = new GameManager(uiManager, audioManager, saveManager, imageManager, sceneManager);
const eventBinder = new EventBinder(uiManager, audioManager, saveManager, sceneManager, gameManager);

// 実行
eventBinder.bindEvents();