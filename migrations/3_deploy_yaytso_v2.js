const YaytsoV2 = artifacts.require("YaytsoV2");
const Carton = artifacts.require("Carton");
module.exports = async function (deployer) {
  await deployer.deploy(YaytsoV2);
  const yaytso = await YaytsoV2.deployed();
  await deployer.deploy(Carton, yaytso.address);
  const carton = await Carton.deployed();
};
