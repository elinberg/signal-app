module.exports = {
  apps : [{
    name:'signal-app',
    cwd: '~/signal-app/source',
    script: './index.js',
    env_production: {
      NODE_ENV: "production",
    },
    watch: '.'
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
      'post-deploy' : 'git stash && git pull && npm install && pm2 reload ~/signal-app/source/ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
