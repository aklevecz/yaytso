const fs = require("fs");
const { nextTick } = require("process");
const filePath = process.argv.slice(2)[0];
const folderPath = process.argv.slice(2)[0];
(async () => {
  const files = await fs.promises.readdir(folderPath);
  for (const file of files) {
    console.log(file);
    if (file.includes(".svg")) {
      console.log(file);
      const filePath = folderPath + file;
      const svgFile = fs

        .readFileSync(filePath, "utf-8")
        .replace(/stroke-miterlimit/g, "strokeMiterlimit")
        .replace(/stroke-width/g, "strokeWidth")
        .replace(/enable-background/g, "enableBackground")
        .replace(/font-family/g, "fontFamily")
        .replace(/font-size/g, "fontSize");

      const template = `
export function ${file.replace(".svg", "")}(){ return(${svgFile})}
`;

      fs.writeFileSync(filePath.replace(".svg", ".js"), template);
      fs.unlinkSync(filePath);
    }
  }
})();
