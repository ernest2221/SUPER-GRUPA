let userInput = "";
let isCorrect = null;
let isChecking = false;
let checkStartTime = 0;

let countdown = 0;
let countdownStart = null;
let notification = "";
let notificationTimer = 0;
let skipClicks = 0;
let attemptCount = 0;

let etap = "intro";

let img_play;
let img_pasek;
let img_bg;
let img_cursor;
let img_cursor_click;
let img_bluescreen;

function preload() {
  img_play = loadImage('img_play.PNG');
  img_pasek = loadImage('IMG_pasek.PNG');
  img_bg = loadImage('IMG_bg.jpeg');
  img_cursor = loadImage('myszka.png');
  img_cursor_click = loadImage('myszka_click.png');
  img_bluescreen = loadImage('bluescreen.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Arial");
  textSize(16);
  noCursor();
}

function draw() {
  background(0);
  imageMode(CENTER);

  if (etap === "bluescreen") {
    let scaleFactor = width / img_bluescreen.width;
    let newHeight = img_bluescreen.height * scaleFactor;
    image(img_bluescreen, width / 2, height / 2, width, newHeight);
    image(img_cursor, mouseX, mouseY, 32, 32);
    return;
  }

  let scaleFactor = width / img_bg.width;
  let newHeight = img_bg.height * scaleFactor;
  image(img_bg, width / 2, height / 2, width, newHeight);

  let scaleFactorPasek = width / img_pasek.width;
  let newHeightPasek = img_pasek.height * scaleFactorPasek;
  image(img_pasek, width / 2, height - 100, width, newHeightPasek);

  if (etap === "captcha" || etap === "odliczanie") {
    fill(255);
    rectMode(CENTER);
    rect(width / 2, height / 2 - 100, 500, 200);

    fill(0);
    textAlign(LEFT, TOP);
    textStyle(NORMAL);

    if (etap === "captcha") {
      fill(50, 50, 200);
      textSize(20);
      textStyle(BOLD);
      text("CAPTCHA", width / 2 - 220, height / 2 - 180);
      textStyle(NORMAL);
      textSize(15);

      fill(0);
      text("Wpisz trzycyfrową liczbę, aby potwierdzić, że nie jesteś robotem:", width / 2 - 220, height / 2 - 150);

      fill(240);
      stroke(0);
      rect(width / 2 - 170, height / 2 - 120, 100, 30);
      fill(0);
      noStroke();
      textAlign(CENTER, CENTER);
      text(userInput, width / 2 - 170, height / 2 - 120);

      if (isChecking) {
        fill(50);
        textAlign(LEFT, TOP);
        text("🔄 Weryfikowanie odpowiedzi...", width / 2 - 220, height / 2 - 60);

        if (millis() - checkStartTime >= 3000) {
          isChecking = false;
          attemptCount++;
          isCorrect = (userInput === "584");

          if (isCorrect || attemptCount >= 3) {
            etap = "odliczanie";
            countdown = 20;
            countdownStart = millis();
            skipClicks = 0;
          }
        }
      }

      if (!isChecking && isCorrect !== null) {
        fill(isCorrect ? "green" : "red");
        textAlign(CENTER, CENTER);
        text(
          isCorrect ? "✅ Zweryfikowano" : "❌ Niepoprawna odpowiedź. Spróbuj ponownie.",
          width / 2,
          height / 2 - 40
        );
      }
    }

    if (etap === "odliczanie") {
      fill(0);
      textAlign(LEFT, TOP);
      text("Przygotowywanie odtwarzacza wideo...", width / 2 - 220, height / 2 - 160);

      if (countdownStart !== null) {
        let elapsed = millis() - countdownStart;
        let remaining = countdown - floor(elapsed / 1000);
        if (remaining < 0) remaining = 0;

        text(`Oglądanie dostępne za: ${remaining} sekund`, width / 2 - 220, height / 2 - 130);

        if (remaining === 0 && etap !== "przejscie") {
          etap = "przejscie";
          setTimeout(() => {
            etap = "bluescreen";
          }, 2000);
        }
      }

      textAlign(CENTER, CENTER);

      fill(0, 200, 0);
      rect(width / 2 - 100, height / 2 - 80, 120, 30);
      fill(255);
      text("Rozpocznij", width / 2 - 100, height / 2 - 80);

      fill(200, 0, 0);
      rect(width / 2 + 50, height / 2 - 80, 120, 30);
      fill(255);
      text("Pomiń", width / 2 + 50, height / 2 - 80);
    }

    if (notification && millis() - notificationTimer < 3000) {
      fill(255, 0, 0);
      textSize(14);
      textAlign(LEFT, TOP);
      text(notification, width / 2 - 220, height / 2 + 100);
      textSize(16);
    }
  }

  if (etap === "intro") {
    image(img_play, width / 2, height / 2);
  }

  let isHovering = etap === "intro" && dist(mouseX, mouseY, width / 2, height / 2 + 60) < img_play.width / 2;
  if (isHovering) {
    image(img_cursor_click, mouseX, mouseY, 32, 32);
  } else {
    image(img_cursor, mouseX, mouseY, 32, 32);
  }
}

function keyPressed() {
  if (etap !== "captcha" || isChecking) return;

  if (keyCode === BACKSPACE) {
    userInput = userInput.slice(0, -1);
  } else if (keyCode === ENTER) {
    if (userInput.length === 3) {
      isChecking = true;
      isCorrect = null;
      checkStartTime = millis();
    }
  } else if (key >= '0' && key <= '9' && userInput.length < 3) {
    userInput += key;
  }
}

function mousePressed() {
  if (etap === "intro") {
    let isHoveringPlay = dist(mouseX, mouseY, width / 2, height / 2 + 60) < img_play.width / 2;
    if (isHoveringPlay) {
      etap = "captcha";
    }
  }

  if (etap === "odliczanie") {
    let mx = mouseX;
    let my = mouseY;

    if (mx > width / 2 - 160 && mx < width / 2 - 40 && my > height / 2 - 95 && my < height / 2 - 65) {
      let remaining = countdown - floor((millis() - countdownStart) / 1000);
      if (remaining <= 0) {
        notification = "🎬 Rozpoczynamy seans!";
        notificationTimer = millis();
      } else {
        notification = "⏳ Musisz poczekać na zakończenie odliczania.";
        notificationTimer = millis();
      }
    }

    if (mx > width / 2 + 10 && mx < width / 2 + 130 && my > height / 2 - 95 && my < height / 2 - 65) {
      skipClicks++;
      countdown = 20 + (skipClicks * 5);
      countdownStart = millis();
      notification = `🚫 Nie możesz pominąć! Dodano ${skipClicks * 5} sekund.`;
      notificationTimer = millis();
    }
  }
}
