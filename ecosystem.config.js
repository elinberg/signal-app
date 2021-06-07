module.exports = {
  apps : [{
    name:'signal-app',
    script: 'index.js',
    watch: '.'
  }, {
    script: './service-worker/',
    watch: ['./service-worker']
  }],

  deploy : {
    production : {
      user : 'node',
      host : 'signal',
      key: '~/.ssh/node.pem',
      ref  : 'origin/main',
      repo : 'git@github.com:elinberg/signal-app.git',
      path : '/home/node/signal-app',
      'pre-deploy-local': '',
      'post-deploy' : 'git pull && npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
