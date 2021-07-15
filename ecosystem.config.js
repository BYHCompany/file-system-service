module.exports = {
  apps: [
    {
      script: 'index.js',
      // Delay between restart
      watch_delay: 1000,
      ignore_watch: ['node_modules', 'static'],
    },
  ],
};
