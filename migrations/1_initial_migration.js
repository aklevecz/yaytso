const Migrations = artifacts.require("Migrations");

module.exports = function(deployer) {
  return false
  deployer.deploy(Migrations);
};
