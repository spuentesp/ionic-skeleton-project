angular.module("Core").provider("ConnectionProvider", function() { // eslint-disable-line no-undef
  var uniqueRequests = false;
  var requests = [];
  Object.toparams = function(obj) {
    var p = [];
    for (var key in obj) {
      p.push(key + "=" + encodeURIComponent(obj[key]));
    }
    return p.join("&");
  };

  return {
    $get: ["$rootScope", "$http", "UtilsService", "$log", "$q", "ENDPOINTS",
      function($rootScope, $http, UtilsService, $log, $q, ENDPOINTS) {

        var doRequest = function(endpoint, params, data, headers, success, failure, method) {
          var id = _.uniqueId();
          $log.debug("[" + id + "] REQUEST " + method, endpoint);
          var defer = $q.defer();
          defer.promise.then(function(response) {
            success(response);
          }, function(err) {
            failure(err);
          });

          var request = {
            method: method,
            responseType: "json",
            url: endpoint,
            headers: headers,
            params: params,
            data: JSON.stringify(data),
            timeout: ENDPOINTS.SETUP.TIMEOUT
          };
          if (_.findIndex(requests, request) >= 0 && uniqueRequests) {
            return false;
          }

          try {
            requests.push(request);
            $http(request).then(function(response) {
              requests = _.drop(requests, request);
              $log.groupCollapsed("[" + id + "] RESULT REQUEST " + method.toUpperCase() + "[" + endpoint + "]");
              $log.debug("Params: ", params);
              $log.debug("Data: ", data);
              $log.debug("Response: ", response);
              $log.groupEnd();
              defer.resolve(response);
            }, function(err) {
              requests = _.drop(requests, request);
              $log.groupCollapsed("[" + id + "] ERROR REQUEST " + method.toUpperCase() + " [" + endpoint + "]");
              $log.error("Params: ", params);
              $log.error("Data: ", data);
              $log.error("Response: ", err);
              $log.groupEnd();
              if (err.data == null) { //timeout
                err = timeoutError;
              }
              defer.reject(err);
            });

          } catch (error) {
            defer.reject(error);
          }
          return defer.promise;
        };

        var sendPost = function(endpoint, params, data, headers, success, failure) { // jshint ignore:line
          doRequest(endpoint, params, data, headers, success, failure, "POST");
        };

        var sendGet = function(endpoint, params, data, headers, success, failure) { // jshint ignore:line
          doRequest(endpoint, params, data, headers, success, failure, "GET");
        };

        var sendPut = function(endpoint, params, data, headers, success, failure) { // jshint ignore:line
          doRequest(endpoint, params, data, headers, success, failure, "PUT");
        };

        var sendDelete = function(endpoint, params, data, headers, success, failure) { // jshint ignore:line
          doRequest(endpoint, params, data, headers, success, failure, "DELETE");
        };



        var timeoutError = {
          data: {
            status: "408",
            msg: "Se alcanzó el tiempo máximo de espera"
          },
          status: 408
        };

        return {
          sendPost: sendPost,
          sendPut: sendPut,
          sendDelete: sendDelete,
          sendGet: sendGet
        };
      }
    ]
  }
});