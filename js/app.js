let tShirtOrTextColor = "";

const colors = `
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

document.querySelector("#rotate").addEventListener("click", function () {
  document.querySelector(".img-fluid").classList.toggle("d-none");
  document.querySelector("#preview").classList.toggle("d-none");
});

document.querySelector("#color").addEventListener("click", function () {
  tShirtOrTextColor = "tShirtColor";
  $("#colorModal").modal("show");
});

document.querySelector("#colorDrawer").innerHTML = generateColorList();

function generateColorList() {
  return colors;
}

document.querySelector("#addingText").addEventListener("click", function () {
  tShirtOrTextColor = "textColor";
  $("#editorTextModal").modal("show");
});

document.querySelector("#drawText").addEventListener("click", addText);

function addText() {
  $("#editorTextModal").modal("hide");
  stage.add(layer);
  $("#addModal").modal("hide");
  $("#textMaxLength").show();

  const textNode = new Konva.Text({
    x: 5,
    y: 20,
    width: 140,
    fontSize: 22,
    align: "center",
    text: "Type your text",
    draggable: true,
    dragBoundFunc: (pos) => {
      const newX = Math.max(0, Math.min(pos.x, 16));
      const newY = Math.max(0, Math.min(pos.y, stage.height() - textNode.height()));
      return { x: newX, y: newY };
    },
  });

  layer.add(textNode);

  const tr = new Konva.Transformer({
    nodes: [textNode],
    keepRatio: true,
    enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"],
    boundBoxFunc: (oldBoundBox, newBoundBox) => (Math.abs(newBoundBox.width) > MAX_WIDTH ? oldBoundBox : newBoundBox),
  });

  textNode.on("transform", () => {
    textNode.setAttrs({ width: textNode.width() * textNode.scaleX(), scaleX: 1 });
  });

  layer.add(tr);

  textNode.on("click tap", () => handleTextNodeEdit(textNode, tr));
}

function handleTextNodeEdit(textNode, tr) {
  textNode.hide();
  tr.hide();

  const textPosition = textNode.absolutePosition();
  const areaPosition = {
    x: stage.container().offsetLeft + textPosition.x,
    y: stage.container().offsetTop + textPosition.y,
  };

  const textarea = document.createElement("textarea");
  textarea.value = textNode.text();
  Object.assign(textarea.style, {
    position: "absolute",
    top: "70px",
    left: "110px",
    width: `${textNode.width() - textNode.padding() * 2}px`,
    maxWidth: `${stage.width() * 2}px`,
    fontSize: `${textNode.fontSize()}px`,
    border: "none",
    padding: "0px",
    margin: "0px",
    overflow: "hidden",
    background: "none",
    outline: "none",
    resize: "none",
    lineHeight: textNode.lineHeight(),
    fontFamily: textNode.fontFamily(),
    textAlign: textNode.align(),
    color: textNode.fill(),
    transformOrigin: "left top",
    transform: `rotateZ(${textNode.rotation()}deg)`,
  });

  textarea.addEventListener("keyup", () => {
    if (textarea.value.length > 16) {
      textarea.style.fontSize = "16px";
    }
  });

  $("#preview").append(textarea);
  textarea.focus();

  function removeTextarea() {
    textarea.remove();
    window.removeEventListener("click", handleOutsideClick);
    textNode.show();
    tr.show();
  }

  function handleOutsideClick(e) {
    if (e.target !== textarea) {
      textNode.text(textarea.value);
      removeTextarea();
    }
  }

  setTimeout(() => {
    window.addEventListener("click", handleOutsideClick);
  });

  textarea.addEventListener("keydown", (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      textNode.text(textarea.value);
      removeTextarea();
    }
    if (e.keyCode === 27) {
      removeTextarea();
    }
  });

  textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + textNode.fontSize()}px`;
    if (textarea.value.length > 16) {
      textNode.fontSize(16);
    }
  });
}

document.querySelector("#fontColorPickerWrap h2").style.display = "block";
document.querySelector("#fontColorPicker").innerHTML = colors;

const chooseColor = document.querySelectorAll(".color-preview");

chooseColor.forEach((colorItem) => {
  colorItem.addEventListener("click", () => {
    const appliedColor = colorItem.style.backgroundColor;

    if (tShirtOrTextColor === "tShirtColor") {
      $("#colorModal").modal("hide");
      document.querySelector("#editorImage").style.backgroundColor = appliedColor;
    }

    if (tShirtOrTextColor === "textColor") {
      textNode.setAttrs({ fill: appliedColor });
      $("#editorTextModal").modal("hide");
    }
  });
});

document.querySelector("#chooseFontStyle").addEventListener("change", function () {
  const chosenFontStyle = this.value;
  textNode.setAttrs({
    fontStyle: chosenFontStyle,
    fontSize: chosenFontStyle === "bold" ? 21 : textNode.fontSize(),
  });
  $("#editorTextModal").modal("hide");
});

document.querySelector("#chooseFontFamily").addEventListener("change", function () {
  textNode.setAttrs({ fontFamily: this.value });
  $("#editorTextModal").modal("hide");
});

document.querySelector("#clearText").addEventListener("click", function () {
  textNode.text(" ");
  textNode.width(130);
  $("#editorTextModal").modal("hide");
  $("#drawText").show();
  $("#textMaxLength").hide();
});

document.querySelector("#uploadPic").addEventListener("change", handleImageUpload);

function handleImageUpload(e) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const imageObj = new Image();
    imageObj.src = event.target.result;

    imageObj.onload = () => {
      const image = new Konva.Image({
        image: imageObj,
        x: 5,
        y: 20,
        width: 150,
        height: 150,
        draggable: true,
      });

      layer.add(image);
      layer.draw();
    };
  };

  reader.readAsDataURL(e.target.files[0]);
}

document.querySelector("#compress").addEventListener("click", compressImage);

function compressImage() {
  const preview = document.querySelector("#preview");
  const file = document.querySelector("#uploadPic").files[0];

  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = function (event) {
    const img = new Image();
    img.src = event.target.result;

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
      preview.src = compressedDataUrl;
    };
  };
}
document.querySelector("#design-download").addEventListener("click", downloadDesign);

function downloadDesign() {
  // Assume `stage` is your Konva stage instance
  const dataURL = stage.toDataURL({ pixelRatio: 3 });
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'design.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function openShippingDetailsModal() {
  // Display the shipping details modal
  $("#shippingDetailsModal").modal("show");
}
document.querySelector("#openShippingModal").addEventListener("click", openShippingDetailsModal);

