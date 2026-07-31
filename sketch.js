let mode = 0;
let playerX;
let playerY;
let playerRadius;
let playerAngle;
let bubbleX;
let bubbleY;
let bubbleRadius;
let bubbleSpeedX;
let bubbleSpeedY;
let bubbleAlive;
let bulletX;
let bulletY;
let bulletRadius;
let bulletSpeedX;
let bulletSpeedY;
let bulletAlive;
let startTime;
let scoreTime;
let bubbleHitCount;
let lastBubbleSpawnTime;
let lastGoodBubbleSpawnTime;
let invincibleMode;
let deathMode;
let startInput;
let goodBubbleX;
let goodBubbleY;
let goodBubbleRadius;
let goodBubbleSpeedX;
let goodBubbleSpeedY;
let goodBubbleAlive;
let startSound;
let invincibleSound;
let deathSound;

function preload() {
    startSound = loadSound("onnsei/ほら貝を吹き鳴らす.mp3");
    invincibleSound = loadSound("onnsei/黄色い悲鳴.mp3");
    deathSound = loadSound("onnsei/ホラー文字表示音.mp3");
}

function playStartSound() {
    if (startSound) {
        userStartAudio();
        startSound.stop();
        startSound.play();
    }
}

function playInvincibleSound() {
    if (invincibleSound) {
        userStartAudio();
        invincibleSound.stop();
        invincibleSound.play();
    }
}

function playDeathSound() {
    if (deathSound) {
        userStartAudio();
        deathSound.stop();
        deathSound.play();
    }
}

function setup() {
    createCanvas(500, 500);

    playerX = width / 2;
    playerY = height / 2;
    playerRadius = 15;
    playerAngle = 0;

    // シャボン玉の位置・半径をランダムに決める
    bubbleX = [];
    bubbleY = [];
    bubbleRadius = [];
    bubbleSpeedX = [];
    bubbleSpeedY = [];
    bubbleAlive = [];
    bulletX = [];
    bulletY = [];
    bulletRadius = [];
    bulletSpeedX = [];
    bulletSpeedY = [];
    bulletAlive = [];

    let bubbleCount = 10;
    let bubbleSpeedMin = -4;
    let bubbleSpeedMax = 4;
    if (deathMode) {
        bubbleCount = 15;
        bubbleSpeedMin = -7;
        bubbleSpeedMax = 7;
    }

    for (let i = 0; i < bubbleCount; i++) {
        // プレイヤーから少し離れた位置に出す
        let x = random(0, width);
        let y = random(0, height);
        while (dist(x, y, playerX, playerY) < 100) {
            x = random(0, width);
            y = random(0, height);
        }
        bubbleX.push(x);
        bubbleY.push(y);
        bubbleRadius.push(random(20, 40));
        bubbleSpeedX.push(random(bubbleSpeedMin, bubbleSpeedMax));
        bubbleSpeedY.push(random(bubbleSpeedMin, bubbleSpeedMax));
        bubbleAlive.push(true);
    }

    goodBubbleX = [];
    goodBubbleY = [];
    goodBubbleRadius = [];
    goodBubbleSpeedX = [];
    goodBubbleSpeedY = [];
    goodBubbleAlive = [];
    for (let i = 0; i < 3; i++) {
        let x = random(0, width);
        let y = random(0, height);
        while (dist(x, y, playerX, playerY) < 120) {
            x = random(0, width);
            y = random(0, height);
        }
        goodBubbleX.push(x);
        goodBubbleY.push(y);
        goodBubbleRadius.push(random(15, 25));
        goodBubbleSpeedX.push(random(-2.5, 2.5));
        goodBubbleSpeedY.push(random(-2.5, 2.5));
        goodBubbleAlive.push(true);
    }

    startTime= millis();
    lastBubbleSpawnTime = millis();
    lastGoodBubbleSpawnTime = millis();
    bubbleHitCount = 0;
    invincibleMode = false;
    startInput = "";
}

function draw() {
    background(180, 220, 255);

    if (mode == 0) {
        // スタート画面の表示
        fill(0);
        textAlign(CENTER);
        text("シャボン玉に触れないように逃げよう", width / 2, height / 2 - 40);
        text("矢印キーで移動", width / 2, height / 2 - 10);
        text("スペースキーでスタート", width / 2, height / 2 + 30);
        if (invincibleMode) {
            text("無敵モード発動", width / 2, height / 2 + 60);
        }
        if (deathMode) {
            text("死神モード", width / 2, height / 2 + 90);
        }
    }

    if (mode == 1) {
        // プレイヤーをキーボードで動かす (02)
        let moveX = 0;
        let moveY = 0;
        if (keyIsDown(LEFT_ARROW)) {
            moveX = moveX - 1;
        }
        if (keyIsDown(RIGHT_ARROW)) {
            moveX = moveX + 1;
        }
        if (keyIsDown(UP_ARROW)) {
            moveY = moveY - 1;
        }
        if (keyIsDown(DOWN_ARROW))  {
            moveY = moveY + 1;
        }

        if (moveX !== 0 || moveY !== 0) {
            playerAngle = atan2(moveY, moveX);
        }

        if (millis() - lastBubbleSpawnTime >= 5000) {
            let x = random(0, width);
            let y = random(0, height);
            while (dist(x, y, playerX, playerY) < 100) {
                x = random(0, width);
                y = random(0, height);
            }
            bubbleX.push(x);
            bubbleY.push(y);
            bubbleRadius.push(random(20, 40));
            bubbleSpeedX.push(random(-4, 4));
            bubbleSpeedY.push(random(-4, 4));
            bubbleAlive.push(true);
            lastBubbleSpawnTime = millis();
        }

        if (millis() - lastGoodBubbleSpawnTime >= 10000) {
            let x = random(0, width);
            let y = random(0, height);
            while (dist(x, y, playerX, playerY) < 120) {
                x = random(0, width);
                y = random(0, height);
            }
            goodBubbleX.push(x);
            goodBubbleY.push(y);
            goodBubbleRadius.push(random(15, 25));
            goodBubbleSpeedX.push(random(-2.5, 2.5));
            goodBubbleSpeedY.push(random(-2.5, 2.5));
            goodBubbleAlive.push(true);
            lastGoodBubbleSpawnTime = millis();
        }

        playerX = playerX + moveX * 7;
        playerY = playerY + moveY * 7;
        playerX = constrain(playerX, playerRadius, width - playerRadius);
        playerY = constrain(playerY, playerRadius, height - playerRadius);

        // 弾を動かす
        for (let i = 0; i < bulletX.length; i++) {
            if (!bulletAlive[i]) {
                continue;
            }

            bulletX[i] = bulletX[i] + bulletSpeedX[i];
            bulletY[i] = bulletY[i] + bulletSpeedY[i];

            if (
                bulletX[i] < -20 || bulletX[i] > width + 20 ||
                bulletY[i] < -20 || bulletY[i] > height + 20
            ) {
                bulletAlive[i] = false;
            }
        }

        // 弾がシャボン玉に当たったら破壊
        for (let i = 0; i < bulletX.length; i++) {
            if (!bulletAlive[i]) {
                continue;
            }

            for (let j = 0; j < bubbleX.length; j++) {
                if (!bubbleAlive[j]) {
                    continue;
                }

                if (dist(bulletX[i], bulletY[i], bubbleX[j], bubbleY[j]) < bulletRadius[i] + bubbleRadius[j]) {
                    bulletAlive[i] = false;
                    bubbleAlive[j] = false;
                    break;
                }
            }

            if (!bulletAlive[i]) {
                continue;
            }

            for (let j = 0; j < goodBubbleX.length; j++) {
                if (!goodBubbleAlive[j]) {
                    continue;
                }

                if (dist(bulletX[i], bulletY[i], goodBubbleX[j], goodBubbleY[j]) < bulletRadius[i] + goodBubbleRadius[j]) {
                    bulletAlive[i] = false;
                    goodBubbleAlive[j] = false;
                    break;
                }
            }
        }

        // シャボン玉を等速で動かし、画面の外に出たら反対側から出てくる (03)
        for (let i = 0; i < bubbleX.length; i++) {
            if (!bubbleAlive[i]) {
                continue;
            }

            bubbleX[i] = bubbleX[i] + bubbleSpeedX[i];
            bubbleY[i] = bubbleY[i] + bubbleSpeedY[i];

            if (bubbleX[i] < 0) {
                bubbleX[i] = width
            }
            if (bubbleX[i] > width) {
                bubbleX[i] = 0;
            }
            if (bubbleY[i] < 0) {
                bubbleY[i] = height;
            }
            if (bubbleY[i] > height) {
                bubbleY[i] = 0;
            }
        }

        for (let i = 0; i < goodBubbleX.length; i++) {
            if (!goodBubbleAlive[i]) {
                continue;
            }

            goodBubbleX[i] = goodBubbleX[i] + goodBubbleSpeedX[i];
            goodBubbleY[i] = goodBubbleY[i] + goodBubbleSpeedY[i];

            if (goodBubbleX[i] < 0) {
                goodBubbleX[i] = width;
            }
            if (goodBubbleX[i] > width) {
                goodBubbleX[i] = 0;
            }
            if (goodBubbleY[i] < 0) {
                goodBubbleY[i] = height;
            }
            if (goodBubbleY[i] > height) {
                goodBubbleY[i] = 0;
            }
        }

        // シャボン玉に触れたら割れて、3回割れたらゲームオーバー (04)
        for (let i = 0; i < bubbleX.length; i++) {
            if (!bubbleAlive[i]) {
                continue;
            }

            if (
                dist(playerX, playerY,bubbleX[i],bubbleY[i]) <
                playerRadius + bubbleRadius[i]
            ) {
                if (invincibleMode) {
                    bubbleAlive[i] = false;
                } else {
                    bubbleAlive[i] = false;
                    bubbleHitCount = bubbleHitCount + 1;
                    if (bubbleHitCount >= 3) {
                        scoreTime = floor((millis() - startTime) / 1000);
                        mode = 2;
                    }
                }
            }
        }

        for (let i = 0; i < goodBubbleX.length; i++) {
            if (!goodBubbleAlive[i]) {
                continue;
            }

            if (
                dist(playerX, playerY, goodBubbleX[i], goodBubbleY[i]) <
                playerRadius + goodBubbleRadius[i]
            ) {
                goodBubbleAlive[i] = false;
                bubbleHitCount = max(0, bubbleHitCount - 1);
            }
        }

        let allBubblesDestroyed = true;
        for (let i = 0; i < bubbleX.length; i++) {
            if (bubbleAlive[i]) {
                allBubblesDestroyed = false;
                break;
            }
        }
        if (allBubblesDestroyed) {
            scoreTime = floor((millis() - startTime) / 1000);
            mode = 3;
        }

        // プレイヤーを表示する
        fill(255, 100, 150);
        noStroke();
        circle(playerX, playerY, playerRadius * 2);

        stroke(0);
        strokeWeight(2);
        line(
            playerX,
            playerY,
            playerX + cos(playerAngle) * 20,
            playerY + sin(playerAngle) * 20
        );

        // 弾を表示する
        for (let i = 0; i < bulletX.length; i++) {
            if (!bulletAlive[i]) {
                continue;
            }

            fill(255, 200, 0);
            noStroke();
            circle(bulletX[i], bulletY[i], bulletRadius[i] * 2);
        }

        // 残りのヒット回数を表示する
        fill(0);
        textAlign(LEFT);
        textSize(14);
        text("残り: " + (3 - bubbleHitCount), 10, 25);

        // シャボン玉を表示する
        noFill();
        stroke(255);
        strokeWeight(2);
        for (let i = 0; i < bubbleX.length; i++) {
            if (bubbleAlive[i]) {
                circle(bubbleX[i], bubbleY[i], bubbleRadius[i] * 2);
            }
        }

        fill(120, 220, 255, 200);
        stroke(80, 160, 255);
        strokeWeight(2);
        for (let i = 0; i < goodBubbleX.length; i++) {
            if (goodBubbleAlive[i]) {
                circle(goodBubbleX[i], goodBubbleY[i], goodBubbleRadius[i] * 2);
            }
        }
    }

    if (mode == 2) {
        // 終了画面の表示
        fill(0);
        noStroke();
        textAlign(CENTER);
        text("ゲームオーバー", width / 2, height / 2 - 20);
        text("スペースキーでスタート画面に戻る", width / 2, height / 2 + 20);
        drawScore();
    }

    if (mode == 3) {
        fill(0);
        noStroke();
        textAlign(CENTER);
        text("クリア！", width / 2, height / 2 - 20);
        text("スペースキーでスタート画面に戻る", width / 2, height / 2 + 20);
        drawScore();
    }
}


function drawScore() {
    fill ("black");
    textAlign(LEFT);
    textSize(14);
    text("SCORE: " + scoreTime,width - 120,25)
}

function keyPressed() {
    const invincibleCode = "nitijixyou";
    const deathCode = "sinigami";

    if (mode == 0) {
        if (key === "Backspace") {
            startInput = startInput.slice(0, -1);
            return;
        }

        if (key.length === 1 && key !== " ") {
            startInput += key.toLowerCase();
            if (startInput.length > Math.max(invincibleCode.length, deathCode.length)) {
                startInput = startInput.slice(-Math.max(invincibleCode.length, deathCode.length));
            }
            if (startInput === invincibleCode) {
                invincibleMode = true;
                startInput = "";
                playInvincibleSound();
            }
            if (startInput === deathCode) {
                deathMode = true;
                startInput = "";
                playDeathSound();
            }
        }
    }

    if (key == " ") {
        if (mode == 0) {
            const startWithInvincible = invincibleMode;
            const startWithDeath = deathMode;
            startInput = "";
            setup();
            invincibleMode = startWithInvincible;
            deathMode = startWithDeath;
            mode = 1;
            playStartSound();
        }
        if (mode == 1) {
            bulletX.push(playerX + cos(playerAngle) * (playerRadius + 8));
            bulletY.push(playerY + sin(playerAngle) * (playerRadius + 8));
            bulletSpeedX.push(cos(playerAngle) * 8);
            bulletSpeedY.push(sin(playerAngle) * 8);
            bulletRadius.push(6);
            bulletAlive.push(true);
        }
        if (mode == 2 || mode == 3) {
            // スタート画面に戻る
            mode = 0;
            invincibleMode = false;
            deathMode = false;
        }
    }
}
