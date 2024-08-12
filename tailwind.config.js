/** @type {import('tailwindcss').Config} */
module.exports = {
  // 不在 content glob表达式中包括的文件，在里面编写tailwindcss class，是不会生成对应的css工具类的
  content: [
    "./public/home.html",
    "./src/**/*.{html,js,ts,jsx,tsx}",
    // {
    //   "flex-center": "flex justify-center items-center",
    //   "flex-col": "flex flex-col",
    //   "flex-col-center": "flex flex-col justify-center items-center",
    // },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    // 小程序不需要 preflight，因为这主要是给 h5 的，如果你要同时开发多端，你应该使用 process.env.TARO_ENV 环境变量来控制它
    preflight: false,
  },
};
