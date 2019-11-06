const windowClientHeight = () => document.documentElement.clientHeight;
const windowClientWidth = () => document.documentElement.clientWidth;

const hasClientScroll = () => document.documentElement.scrollHeight !== document.documentElement.clientHeight;

export default {
  windowClientHeight,
  windowClientWidth,

  hasClientScroll,
};