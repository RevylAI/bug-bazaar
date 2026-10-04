const { withPodfile } = require("expo/config-plugins");

const MIN_IOS_DEPLOYMENT_TARGET = "15.1";
const POST_INSTALL_HOOK = /post_install do \|installer\|\n/;
const RAISE_POD_DEPLOYMENT_TARGETS = `    installer.pods_project.targets.each { |t| t.build_configurations.each { |c| c.build_settings["IPHONEOS_DEPLOYMENT_TARGET"] = "${MIN_IOS_DEPLOYMENT_TARGET}" if c.build_settings["IPHONEOS_DEPLOYMENT_TARGET"].to_f < ${MIN_IOS_DEPLOYMENT_TARGET} } }\n`;

module.exports = function withPodDeploymentTarget(config) {
  return withPodfile(config, (config) => {
    const podfile = config.modResults.contents;
    if (podfile.includes(RAISE_POD_DEPLOYMENT_TARGETS)) {
      return config;
    }
    if (!POST_INSTALL_HOOK.test(podfile)) {
      throw new Error("with-pod-deployment-target: Podfile has no post_install hook");
    }
    config.modResults.contents = podfile.replace(
      POST_INSTALL_HOOK,
      (hook) => `${hook}${RAISE_POD_DEPLOYMENT_TARGETS}`
    );
    return config;
  });
};
