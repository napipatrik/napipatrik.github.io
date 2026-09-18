'use strict';

const sitename = 'napipatrik';
const domain = sitename + '.hu';

// Discord clears the typing indicator after 10 seconds, so refresh it before that
const typingRefreshInterval = 8000;
const typingMaxDuration = 2 * 60 * 1000;


exports.fetchContent = async function (path) {
  const response = await fetch('https://' + domain + '/' + path);
  return response.text();
}

exports.startTyping = function (channel) {
  const sendTyping = () => channel.sendTyping().catch(console.error);
  const deadline = Date.now() + typingMaxDuration;

  sendTyping();
  const timer = setInterval(() => {
    if (Date.now() >= deadline) {
      console.error('Typing indicator ran longer than expected, stopping it');
      clearInterval(timer);
      return;
    }

    sendTyping();
  }, typingRefreshInterval);
  timer.unref();

  return function () {
    clearInterval(timer);
  };
}

exports.unaccent = function (str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

exports.sitename = sitename;
