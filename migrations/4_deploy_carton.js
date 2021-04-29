const Carton = artifacts.require("Carton");

module.exports = function (deployer) {
  return false;
  deployer.deploy(Carton, "0xd45427d298100f9b9D1Cbc9aDB8b0f15A56E10E3");
};
