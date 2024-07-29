let tShirtOrTextColor = "";

let colors = `
<ul class="list-group">
<li class="list-group-item color-preview" title="White" style="background-color:#ffffff;"></li>
<li class="list-group-item color-preview" title="Dark Heather" style="background-color:#616161;"></li>
<li class="list-group-item color-preview" title="Gray" style="background-color:#f0f0f0;"></li>
<li class="list-group-item color-preview" title="Charcoal" style="background-color:#5b5b5b;"></li>
<li class="list-group-item color-preview" title="Black" style="background-color:#222222;"></li>
<li class="list-group-item color-preview" title="Heather Orange" style="background-color:#fc8d74;"></li>
<li class="list-group-item color-preview" title="Heather Dark Chocolate" style="background-color:#432d26;"></li>
<li class="list-group-item color-preview" title="Salmon" style="background-color:#eead91;"></li>
<li class="list-group-item color-preview" title="Chesnut" style="background-color:#806355;"></li>
<li class="list-group-item color-preview" title="Dark Chocolate" style="background-color:#382d21;"></li>
<li class="list-group-item color-preview" title="Citrus Yellow" style="background-color:#faef93;"></li>
<li class="list-group-item color-preview" title="Avocado" style="background-color:#aeba5e;"></li>
<li class="list-group-item color-preview" title="Kiwi" style="background-color:#8aa140;"></li>
<li class="list-group-item color-preview" title="Irish Green" style="background-color:#1f6522;"></li>
<li class="list-group-item color-preview" title="Scrub Green" style="background-color:#13afa2;"></li>
<li class="list-group-item color-preview" title="Teal Ice" style="background-color:#b8d5d7;"></li>
<li class="list-group-item color-preview" title="Heather Sapphire" style="background-color:#15aeda;"></li>
<li class="list-group-item color-preview" title="Sky" style="background-color:#a5def8;"></li>
<li class="list-group-item color-preview" title="Antique Sapphire" style="background-color:#0f77c0;"></li>
<li class="list-group-item color-preview" title="Heather Navy" style="background-color:#3469b7;"></li>							
<li class="list-group-item color-preview" title="Cherry Red" style="background-color:#c50404;"></li>
</ul>
`;

function clearScreen() {
  $("#editorButtons").hide();
  $("#editorImage").hide();
  $("footer").hide();
}

$("#rotate").click(function () {
  $(".img-fluid").toggle();
  $("#preview").toggle();
});

$("#color").click(function () {
  tShirtOrTextColor = "tShirtColor";
  $("#colorModal").modal("show");
});

function drawColors() {
  return colors;
}

$("#colorDrawer").html(drawColors());

function update(activeAnchor) {
  let group = activeAnchor.getParent();
  let topLeft = group.get(".topLeft")[0];
  let topRight = group.get(".topRight")[0];
  let bottomRight = group.get(".bottomRight")[0];
  let bottomLeft = group.get(".bottomLeft")[0];
  let image = group.get("Image")[0];

  let anchorX = activeAnchor.getX();
  let anchorY = activeAnchor.getY();

  switch (activeAnchor.getName()) {
    case "topLeft":
      topRight.setY(anchorY);
      bottomLeft.setX(anchorX);
      break;
    case "topRight":
      topLeft.setY(anchorY);
      bottomRight.setX(anchorX);
      break;
    case "bottomRight":
      bottomLeft.setY(anchorY);
      topRight.setX(anchorX);
      break;
    case "bottomLeft":
      bottomRight.setY(anchorY);
      topLeft.setX(anchorX);
      break;
  }

  image.position(topLeft.position());

  let width = topRight.getX() - topLeft.getX();
  let height = bottomLeft.getY() - topLeft.getY();
  if (width && height) {
    image.width(width);
    image.height(height);
  }
}

function addAnchor(group, x, y, name) {
  let stage = group.getStage();
  let layer = group.getLayer();

  let anchor = new Konva.Circle({
    x: x,
    y: y,
    stroke: "#666",
    fill: "#ddd",
    strokeWidth: 2,
    radius: 5,
    name: name,
    draggable: true,
    dragOnTop: false,
  });

  anchor.on("dragmove", function () {
    update(this);
    layer.draw();
  });
  anchor.on("mousedown touchstart", function () {
    group.setDraggable(false);
    this.moveToTop();
  });
  anchor.on("dragend", function () {
    group.setDraggable(true);
    layer.draw();
  });

  anchor.on("mouseover", function () {
    document.body.style.cursor = "pointer";
    this.setStrokeWidth(4);
    layer.draw();
  });
  anchor.on("mouseout", function () {
    document.body.style.cursor = "default";
    this.setStrokeWidth(2);
    layer.draw();
  });

  group.add(anchor);
}

let stage = new Konva.Stage({
  container: "preview",
  width: 158,
  height: 258,
});

let layer = new Konva.Layer();
stage.add(layer);

const MAX_WIDTH = 150;

$("#addingText").click(function () {
  tShirtOrTextColor = "textColor";
  $("#editorTextModal").modal("show");
});

$("#drawText").click(addText);

let textNode = new Konva.Text();

function addText() {
  $("#editorTextModal").modal("hide");
  stage.add(layer);

  textNode.setAttrs({
    x: 5,
    y: 20,
    width: 140,
    height: "auto",
    fontSize: 22,
    keepRatio: true,
    align: "center",
    text: "Type your text",
    draggable: true,
    dragBoundFunc: function (pos) {
      let newX = pos.x < 0 ? 0 : pos.x > 16 ? 16 : pos.x;
      let newY = pos.y < 0 ? 0 : pos.y > stage.height() - textNode.height() ? stage.height() - textNode.height() : pos.y;
      return { x: newX, y: newY };
    },
  });

  layer.add(textNode);

  let tr = new Konva.Transformer({
    nodes: [textNode],
    keepRatio: true,
    align: "center",
    enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"],
    boundBoxFunc: function (oldBoundBox, newBoundBox) {
      if (Math.abs(newBoundBox.width) > MAX_WIDTH) {
        return oldBoundBox;
      }
      return newBoundBox;
    },
  });

  textNode.on("transform", function () {
    textNode.setAttrs({
      width: textNode.width() * textNode.scaleX(),
      scaleX: 1,
    });
  });

  layer.add(tr);

  textNode.on("click tap", () => {
    textNode.hide();
    tr.hide();

    let textPosition = textNode.absolutePosition();
    let areaPosition = {
      x: stage.container().offsetLeft + textPosition.x,
      y: stage.container().offsetTop + textPosition.y,
    };

    let textarea = document.createElement("textarea");
    textarea.addEventListener("keyup", (e) => {
      if (e.target.value.length > 16) {
        textarea.style.fontSize = "16px";
      }
    });

    $("#preview").append(textarea);
    textarea.value = textNode.text();
    textarea.style.position = "absolute";
    textarea.style.top = "70px";
    textarea.style.left = "110px";
    textarea.style.width = textNode.width() - textNode.padding() * 2 + "px";
    textarea.style.maxWidth = stage.width() * 2 + "px";
    textarea.style.fontSize = textNode.fontSize() + "px";
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.lineHeight = textNode.lineHeight();
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = "left top";
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill();

    let rotation = textNode.rotation();
    let transform = "";
    if (rotation) {
      transform += "rotateZ(" + rotation + "deg)";
    }
    let px = stage.container().offsetLeft + textPosition.x;
    let py = stage.container().offsetTop + textPosition.y;

    transform += "translateY(" + py + "px)";
    transform += "translateX(" + px + "px)";
    textarea.style.transform = transform;

    textarea.focus();

    function removeTextarea() {
      textNode.text(textarea.value);
      textNode.show();
      tr.show();
      textarea.remove();
      layer.batchDraw();
    }

    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        removeTextarea();
      }
    });

    textarea.addEventListener("blur", removeTextarea);
  });

  layer.draw();
}

function saveImage() {
  let imageData = stage.toDataURL({ pixelRatio: 2 });
  let compressedData = imageConversion.compress(imageData, { maxSizeMB: 1 });

  let form = document.createElement("form");
  form.method = "POST";
  form.action = "https://docs.google.com/forms/d/e/1FAIpQLSeI5GpfklKD4GnM1hf86uOkl_r5ZT-zm_Ndsq2xK_E6sMlNDg/formResponse";

  let inputImage = document.createElement("input");
  inputImage.name = "entry.1700842435";
  inputImage.value = compressedData;
  form.appendChild(inputImage);

  let inputName = document.createElement("input");
  inputName.name = "entry.1678458930";
  inputName.value = "Sample Name";
  form.appendChild(inputName);

  let inputColor = document.createElement("input");
  inputColor.name = "entry.483028855";
  inputColor.value = "Sample Color";
  form.appendChild(inputColor);

  let inputText = document.createElement("input");
  inputText.name = "entry.1144876090";
  inputText.value = "Sample Text";
  form.appendChild(inputText);

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

$("#downloadImage").click(function () {
  let form = $('<form>', {
    'method': 'POST',
    'action': 'https://docs.google.com/forms/d/e/1FAIpQLSeI5GpfklKD4GnM1hf86uOkl_r5ZT-zm_Ndsq2xK_E6sMlNDg/formResponse'
  });

  form.append($('<input>', {
    'name': 'entry.1700842435',
    'value': stage.toDataURL()
  }));
  
  form.append($('<input>', {
    'name': 'entry.1678458930',
    'value': 'Sample Name'
  }));
  
  form.append($('<input>', {
    'name': 'entry.483028855',
    'value': 'Sample Color'
  }));
  
  form.append($('<input>', {
    'name': 'entry.1144876090',
    'value': 'Sample Text'
  }));
  
  $('body').append(form);
  form.submit();
  $('body').remove(form);
});
