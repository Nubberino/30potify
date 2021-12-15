
const appInfo = {
  name: 'Tyo',
  author: 'Ty',
  spotify: {
    clientId: process.env.NODE_ENV === 'development' ? '5fa82ad5deeb4fbcb14d14427f96fff7' : 'fad3d187e1f04710ad4675f57d26366c'
  },
  gitInfo: GIT_DESCRIBE
};

export default {
  ...appInfo
};
