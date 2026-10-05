let angleY = 0;

let distortionSlider;
let speedSlider;
let sizeSlider;

const vertices = [
  [-1,-1,-1],
  [ 1,-1,-1],
  [ 1, 1,-1],
  [-1, 1,-1],
  [-1,-1, 1],
  [ 1,-1, 1],
  [ 1, 1, 1],
  [-1, 1, 1]
];

const edges = [
  [0,1],[1,2],[2,3],[3,0],
  [4,5],[5,6],[6,7],[7,4],
  [0,4],[1,5],[2,6],[3,7]
];

function setup() {

  createCanvas(windowWidth, windowHeight);

  // 縦方向補正
  distortionSlider =
    createSlider(0.4, 1.3, 0.72, 0.01);

  distortionSlider.position(10, 10);
  distortionSlider.size(130);

  // 回転速度
  speedSlider =
    createSlider(0, 0.05, 0.012, 0.001);

  speedSlider.position(10, 40);
  speedSlider.size(130);

  // 大きさ
  sizeSlider =
    createSlider(40, 180, 95, 1);

  sizeSlider.position(10, 70);
  sizeSlider.size(130);
}


function draw() {

  background(0);

  angleY += speedSlider.value();

  let cx = width / 2;
  let cy = height / 2;

  // 画面サイズに合わせた配置距離
  let d = min(width, height) * 0.28;

  // -------------------------
  // 上
  // -------------------------
  drawCube(
    cx,
    cy - d,
    PI,
    angleY
  );

  // -------------------------
  // 下
  // -------------------------
  drawCube(
    cx,
    cy + d,
    0,
    angleY + PI
  );

  // -------------------------
  // 左
  // -------------------------
  drawCube(
    cx - d,
    cy,
    HALF_PI,
    angleY + HALF_PI
  );

  // -------------------------
  // 右
  // -------------------------
  drawCube(
    cx + d,
    cy,
    -HALF_PI,
    angleY - HALF_PI
  );

  // 中央位置を確認するためのマーク
  noFill();
  stroke(80);
  strokeWeight(1);

  let centerSize =
    min(width, height) * 0.12;

  rectMode(CENTER);
  rect(cx, cy, centerSize, centerSize);

  // 説明文字
  noStroke();
  fill(180);
  textSize(11);
  textAlign(LEFT);

  text(
    "Distortion",
    150,
    25
  );

  text(
    "Speed",
    150,
    55
  );

  text(
    "Size",
    150,
    85
  );
}


// ===================================================
// 立方体を描く
// ===================================================

function drawCube(
  centerX,
  centerY,
  screenRotation,
  cubeRotation
) {

  push();

  translate(centerX, centerY);

  // スマホの4方向に合わせる
  rotate(screenRotation);

  let projected = [];

  let distortion =
    distortionSlider.value();

  let scaleFactor =
    sizeSlider.value();

  for (let v of vertices) {

    let x = v[0];
    let y = v[1];
    let z = v[2];

    // -------------------------
    // Y軸回転
    // -------------------------

    let xr =
      x * cos(cubeRotation)
      +
      z * sin(cubeRotation);

    let zr =
      -x * sin(cubeRotation)
      +
      z * cos(cubeRotation);

    // -------------------------
    // 少し上から見る
    // -------------------------

    let tilt = -0.35;

    let yr =
      y * cos(tilt)
      -
      zr * sin(tilt);

    let zr2 =
      y * sin(tilt)
      +
      zr * cos(tilt);

    // -------------------------
    // 透視投影
    // -------------------------

    let cameraDistance = 5;

    let perspective =
      cameraDistance /
      (cameraDistance + zr2);

    let px =
      xr * perspective;

    let py =
      yr * perspective;

    // -------------------------
    // ペッパーズゴースト用
    // 縦方向補正
    // -------------------------

    py *= distortion;

    projected.push({
      x: px * scaleFactor,
      y: py * scaleFactor
    });
  }


  // -------------------------
  // 発光風の太い線
  // -------------------------

  stroke(
    0,
    120,
    255,
    80
  );

  strokeWeight(9);

  drawEdges(projected);


  // -------------------------
  // 本線
  // -------------------------

  stroke(
    100,
    220,
    255
  );

  strokeWeight(3);

  drawEdges(projected);


  // -------------------------
  // 頂点
  // -------------------------

  stroke(255);
  strokeWeight(7);

  for (let p of projected) {

    point(
      p.x,
      p.y
    );
  }

  pop();
}


// ===================================================
// 辺を描く
// ===================================================

function drawEdges(p) {

  for (let e of edges) {

    let a =
      p[e[0]];

    let b =
      p[e[1]];

    line(
      a.x,
      a.y,
      b.x,
      b.y
    );
  }
}


// ===================================================
// 画面サイズ変更
// ===================================================

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );
}