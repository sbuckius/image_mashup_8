let images = new Array(8);
let uploaded = new Array(8).fill(false);

function setup() {
  createCanvas(600, 400);
  noLoop();

  for (let i = 0; i < 8; i++) {
    const input = document.getElementById(`imgUpload${i + 1}`);
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        loadImage(URL.createObjectURL(file), (img) => {
          images[i] = img;
          uploaded[i] = true;
          redraw();
        });
      }
    });
  }
}

function draw() {
  background(255);

  if (uploaded[0]) {
    image(images[0], 0, 0, width, height);
  }

  if (uploaded.slice(1).some(Boolean)) {
    applyCutouts();
  }
}

function generateCollage() {
  if (uploaded[0] && uploaded.slice(1).some(Boolean)) {
    redraw();
  } else {
    alert('Upload at least background image (1) and one other image!');
  }
}

function saveCollage() {
  if (uploaded[0]) {
    saveCanvas('image-mashup', 'png');
  } else {
    alert('Please create a mashup first!');
  }
}

function applyCutouts() {
  const mainShapes = 10;
  const stripCount = 16;

  // Get available source images from slots 1–7 (images[1] to images[7])
  const sourceImages = images.slice(1).filter((img, i) => uploaded[i + 1]);

  // Large cutout shapes
  for (let i = 0; i < mainShapes; i++) {
    let w = int(random(100, 180));
    let h = int(random(100, 180));
    let x = int(random(width - w));
    let y = int(random(height - h));
    let shapeType = int(random(3));
    let srcImg = random(sourceImages);

    let maskG = createGraphics(w, h);
    maskG.background(0);
    maskG.noStroke();
    maskG.fill(255);

    if (shapeType === 0) {
      maskG.rect(0, 0, w, h);
    } else if (shapeType === 1) {
      maskG.triangle(random(w), 0, w, h, 0, h);
    } else {
      drawStar(maskG, w / 2, h / 2, w / 6, w / 2.5, 5);
    }

    let maskImg = maskG.get();
    let crop = createImage(w, h);
    crop.copy(srcImg, x, y, w, h, 0, 0, w, h);
    crop.mask(maskImg);
    image(crop, x, y);
  }

  // Thin strips
  for (let i = 0; i < stripCount; i++) {
    let isVertical = random() < 0.5;
    let w = isVertical ? int(random(4, 10)) : int(random(80, 160));
    let h = isVertical ? int(random(80, 160)) : int(random(4, 10));
    let x = int(random(width - w));
    let y = int(random(height - h));
    let srcImg = random(sourceImages);

    let maskG = createGraphics(w, h);
    maskG.background(0);
    maskG.noStroke();
    maskG.fill(255);
    maskG.rect(0, 0, w, h);

    let maskImg = maskG.get();
    let crop = createImage(w, h);
    crop.copy(srcImg, x, y, w, h, 0, 0, w, h);
    crop.mask(maskImg);
    image(crop, x, y);
  }
}

function drawStar(pg, x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  pg.beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    pg.vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    pg.vertex(sx, sy);
  }
  pg.endShape(CLOSE);
}
