//const proxy = require('http-proxy-middleware');
//const  HttpProxyMiddleware = require('http-proxy-middleware');
//const cors = require('cors')
// module.exports = function(app) {
//   app.use(proxy('/bitmart',{ target: 'https://api-cloud.bitmart.com', changeOrigin: false }));

// };
module.exports = function(app) {
    //app.use(cors());
    // app.use(function(req, res, next) {
    //     res.header('Content-Type', 'application/json;charset=UTF-8')
    //     res.header('Access-Control-Allow-Credentials', true)
    //     res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //     next();
    //   });
// app.use(HttpProxyMiddleware('/bitmart', {
//    target: "https://api-cloud.bitmart.com", secure:false, changeOrigin: true,
//    cookieDomainRewrite: "localhost",
//  }));
}