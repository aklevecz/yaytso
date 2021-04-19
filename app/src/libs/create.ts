export const createBlobs = (json: object): FormData => {
  const output = JSON.stringify(json);
  const blob = new Blob([output], { type: "text/json" });
  const data = new FormData();
  data.append("gltf", blob);

  const eggvg = document.getElementById("eggvg") as any;
  const eggClone = eggvg.cloneNode(true);
  const outerHTML = eggClone.outerHTML;
  const svgBlob = new Blob([outerHTML], {
    type: "image/svg+xml;charset=utf-8",
  });
  data.append("svg", svgBlob);
  return data;
};
