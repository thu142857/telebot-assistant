const _ = require('lodash');
const path = require('path');
const middlewares = require('../middlewares');
const { apiActions } = require('../common/constant.js');
const utils = require('../common/utils');

const setupRoutes = (router) => {
  
  console.log('Setup Routes...');
  const routeConfigFiles = utils.walkDir(__dirname + '/routes');
  const controllerFiles = utils.walkDir(__dirname + '/controllers');

  _.each(routeConfigFiles, routeFile => {
    const route = require(routeFile);
    const routeName = path.basename(routeFile);

    // check route's version
    const elementsInName = _.split(routeName, '.');
    if (!elementsInName[2] || elementsInName[2] !== 'js')
      throw new Error('Route config file name should be correct structure [name].[version].js');

    const routeVersion = elementsInName[1];
    _.each(Object.keys(route), apiPath => {
      const apiConfig = route[apiPath];
      _.each(Object.keys(apiConfig), action => {
        // check api's action
        if (!_.includes(apiActions, action))
          throw new Error(`API action should be ${apiActions}`);

        var actionConfig = apiConfig[action];
        // arrayify
        if (!_.isArray(actionConfig)) actionConfig = [actionConfig];

        const apiFullPath = '/' + routeVersion + apiPath;
        const funcController = actionConfig.pop();
        // apply middleware
        _.each(actionConfig, mw => {
          if (!_.isFunction(middlewares[mw]))
            throw new Error(`${mw} is not defined.`);
          router[action](apiFullPath, middlewares[mw]);
        });

        const ctllerName = _.split(funcController, '.')[0];
        const ft = _.split(funcController, '.')[1];
        if (!ctllerName || !ft)
          throw new Error(`${funcController} missed structure [controller].[feature]`);
        const ctllerPath = _.find(controllerFiles, controllerFile => _.includes(controllerFile, `${ctllerName}.js`));
        if (!ctllerPath)
          throw new Error(`${ctllerName} not found.`);
        const controller = require(ctllerPath);

        // Apply feature for api
        if (!_.isFunction(controller[ft]))
          throw new Error(`${ft} is not defined.`);
        router[action](apiFullPath, controller[ft]);
      });
    });
  });

}


module.exports = { setupRoutes }