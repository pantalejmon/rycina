class Paint {
  canvasElem: any;
  canvasCnt: any;
  ctx: any;
  sizeElem: any;
  colorElem: any;
  sizeElemVal: any;
  avaibleMode: any;
  mode: any;
  canDraw: boolean;
  startX: number;
  startY: number;
  btnsMode: any = [];

  constructor() {
    this.canvasCnt = document.querySelector(".paint-canvas-cnt");
    this.createCanvas();
    this.canvasCnt.appendChild(this.canvasElem);
    this.ctx = this.canvasElem.getContext("2d");
    this.sizeElem = document.querySelector(".paint-size");
    this.sizeElemVal = document.querySelector(".paint-size-val");
    this.sizeElemVal.innerText = this.sizeElem.value;
    this.colorElem = document.querySelector(".paint-color");

    //przyciski akcji - zamienamy na tablicę by łatwiej działać

    //czy mozemy rysowac
    this.canDraw = false;
    this.mode = "draw";

    //podpina elementy canvasl
    this.bindElements();

    //ustawia domyślne ustawienia dla canvasu
    this.setupInitialCtx();
  }

  getElementPos(obj) {
    var top = 0;
    var left = 0;
    while (obj && obj.tagName != "BODY") {
      top += obj.offsetTop - obj.scrollTop;
      left += obj.offsetLeft - obj.scrollLeft;
      obj = obj.offsetParent;
    }
    return {
      top: top,
      left: left
    };
  }

  getMousePosition(e: MouseEvent) {
    const mouseX = e.pageX - this.getElementPos(this.canvasElem).left;
    const mouseY = e.pageY - this.getElementPos(this.canvasElem).top;
    return {
      x: mouseX,
      y: mouseY
    };
  }

  mouseMove(e: MouseEvent) {
    if (this.canDraw) {
      const mousePos = this.getMousePosition(e);

      if (this.mode === "draw") {
        this.ctx.lineTo(mousePos.x, mousePos.y);
        this.ctx.stroke();
      }
    }
  }

  mouseEnable(e) {
    this.canDraw = true;
    const mousePos = this.getMousePosition(e);

    this.startX = mousePos.x;
    this.startY = mousePos.y;

    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY);
  }

  mouseDisable(e) {
    this.canDraw = false;
  }

  bindElements() {
    this.sizeElem.addEventListener("change", this.changeSize.bind(this));
    this.sizeElem.addEventListener("input", this.changeSize.bind(this));
    this.colorElem.addEventListener("change", this.changeColor.bind(this));
    this.canvasCnt.addEventListener("mousemove", this.mouseMove.bind(this));
    this.canvasCnt.addEventListener("mouseup", this.mouseDisable.bind(this));
    this.canvasCnt.addEventListener("mousedown", this.mouseEnable.bind(this));
  }

  setupInitialCtx() {
    this.ctx.lineWidth = this.sizeElem.value;
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.ctx.strokeStyle = this.colorElem.value;
  }

  changeSize(e) {
    this.sizeElemVal.innerText = e.target.value;
    this.ctx.lineWidth = e.target.value;
  }

  changeColor(e) {
    const color = this.colorElem.value;
    this.ctx.strokeStyle = color;
  }

  enableMode(mode) {
    if (this.avaibleMode.indexOf(mode) !== -1) {
      this.mode = mode;
    }
  }

  createCanvas() {
    this.canvasElem = document.createElement("canvas");
    this.canvasElem.width = this.canvasCnt.offsetWidth;
    this.canvasElem.height = this.canvasCnt.offsetHeight;
  }
}

new Paint();
