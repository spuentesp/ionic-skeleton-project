/**
 * Created by rodrigopalmafanjul on 06-06-17.
 */

angular.module('app').constant('ENDPOINTS', {
  SETUP: {
    TIMEOUT: 30000,
    TIMEOUT_SESSION: 30000,
    APP_NAME: '',
    API_KEY: '',
    CLIENT_SECRET: '',
    PREPAID_ACCESS_TOKEN: '',
    COLIVING_ACCESS_TOKEN: ''
  },
  URL: 'agregar.endpoint',
  ENDPOINTS_ACCESO_REGISTRO: URL + 'registrar',
  ENDPOINTS_ANALYTICS: 'COLOCAR.EL.ENDPOINT.CORRESPONDIENTE'
})