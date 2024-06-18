const config = require('./config.json');

const baseUrl = config.baseUrls[config.environment];

export const apiUrls = {
  models: baseUrl + config.endpoints.models,
  modelStatus: baseUrl + config.endpoints.modelStatus,
  result: baseUrl + config.endpoints.result,
  imageUrl: baseUrl + config.endpoints.imageUrl,
  startService: baseUrl + config.endpoints.startService,
  stopService: baseUrl + config.endpoints.stopService,
};
