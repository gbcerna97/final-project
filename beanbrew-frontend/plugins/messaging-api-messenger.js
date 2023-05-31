// plugins/messaging-api-messenger.js

import { MessengerClient } from 'messaging-api-messenger';

export default ({ app }) => {
  const { PAGE_ACCESS_TOKEN, APP_SECRET } = process.env;
  app.$messengerClient = MessengerClient.connect({
    accessToken: PAGE_ACCESS_TOKEN,
    appSecret: APP_SECRET,
  });
};
