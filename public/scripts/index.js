const paint = {
  getElementPos: function(obj) {
    let top = 0;
    let left = 0;
    while (obj && obj.tagName != "BODY") {
      top += obj.offsetTop - obj.scrollTop;
      left += obj.offsetLeft - obj.scrollLeft;
      obj = obj.offsetParent;
    }
    return {
      top: top,
      left: left
    };
  },

  getMousePosition: function(e) {
    const mouseX = e.pageX - this.getElementPos(this.canvasElem).left;
    const mouseY = e.pageY - this.getElementPos(this.canvasElem).top;
    return {
      x: mouseX,
      y: mouseY
    };
  },

  mouseMove: function(e) {
    if (this.canDraw) {
      const mousePos = this.getMousePosition(e);

      if (this.mode === "draw") {
        this.ctx.lineTo(mousePos.x, mousePos.y);
        this.ctx.stroke();
      }
    }
  },

  mouseEnable: function(e) {
    this.canDraw = true;

    const mousePos = this.getMousePosition(e);

    this.startX = mousePos.x;
    this.startY = mousePos.y;

    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY);
  },

  mouseDisable: function(e) {
    this.canDraw = false;
  },

  bindElements: function() {
    this.sizeElem.addEventListener("change", this.changeSize.bind(this));
    this.sizeElem.addEventListener("input", this.changeSize.bind(this));

    this.colorElem.addEventListener("change", this.changeColor.bind(this));

    this.canvasCnt.addEventListener("mousemove", this.mouseMove.bind(this));
    this.canvasCnt.addEventListener("mouseup", this.mouseDisable.bind(this));
    this.canvasCnt.addEventListener("mousedown", this.mouseEnable.bind(this));

    this.btnsMode.forEach(function(el) {
      el.addEventListener(
        "click",
        function(e) {
          e.currentTarget.classList.add("active");
          this.mode = e.currentTarget.dataset.mode;

          this.btnsMode.forEach(function(el2) {
            if (el2 !== e.currentTarget) {
              el2.classList.remove("active");
            }
          });
        }.bind(this)
      );
    }, this);
  },

  setupInitialCtx: function() {
    this.ctx.drawImage(this.canvasBg, 0, 0);

    this.ctx.lineWidth = this.sizeElem.value;
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.ctx.strokeStyle = this.colorElem.value;
  },

  changeSize: function(e) {
    this.sizeElemVal.innerText = e.target.value;
    this.ctx.lineWidth = e.target.value;
  },

  changeColor: function(e) {
    const color = this.colorElem.value;
    this.ctx.strokeStyle = color;
  },

  enableMode: function(mode) {
    if (this.avaibleMode.indexOf(mode) !== -1) {
      this.mode = mode;
    }
  },

  createCanvas: function() {
    const canvasElem = document.createElement("canvas");
    canvasElem.width = this.canvasCnt.offsetWidth;
    canvasElem.height = this.canvasCnt.offsetHeight;
    return canvasElem;
  },

  init: function() {
    this.canvasBg = new Image();
    this.canvasBg.addEventListener(
      "load",
      function() {
        this.avaibleMode = ["draw", "line", "rectangle"];

        //elementy belki
        this.canvasCnt = document.querySelector(".paint-canvas-cnt");

        this.canvasElem = this.createCanvas();
        this.canvasCnt.appendChild(this.canvasElem);
        this.ctx = this.canvasElem.getContext("2d");

        this.sizeElem = document.querySelector(".paint-size");
        this.sizeElemVal = document.querySelector(".paint-size-val");
        this.sizeElemVal.innerText = this.sizeElem.value;

        //przycisk wyboru koloru
        this.colorElem = document.querySelector(".paint-color");

        //przyciski akcji - zamienamy na tablicę by łatwiej działać
        this.btnsMode = [].slice.call(document.querySelectorAll(".paint-buttons-cnt .button-mode"));

        this.btnsMode
          .filter(function(el) {
            return el.dataset.mode === "draw";
          })[0]
          .classList.add("active");

        //czy mozemy rysowac
        this.canDraw = false;
        this.mode = "draw";

        //podpina elementy canvasl
        this.bindElements();

        //ustawia domyślne ustawienia dla canvasu
        this.setupInitialCtx();
      }.bind(this)
    );
    this.canvasBg.src = "images/rycina.jpg";
  }
};

paint.init();
