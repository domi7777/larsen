if(!self.define){let e,s={};const n=(n,i)=>(n=new URL(n+".js",i).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(s[o])return;let t={};const a=e=>n(e,o),c={module:{uri:o},exports:t,require:a};s[o]=Promise.all(i.map((e=>c[e]||a(e)))).then((e=>(r(...e),t)))}}define(["./workbox-209e5686"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-8ZxxeSWY.js",revision:null},{url:"assets/phaser-pQREW5IE.js",revision:null},{url:"assets/react-H14vcryl.js",revision:null},{url:"icons/favicon-32x32.png",revision:"385f8ba6daaec15480b890f5f7343438"},{url:"icons/pwa-192x192.png",revision:"eabf4d19df264df1374b6b8ec103ece3"},{url:"icons/pwa-512x512.png",revision:"a6a962c6a584754622ba3a30d845f540"},{url:"index.html",revision:"b7e6cae569a81d2468722af0c9194669"},{url:"registerSW.js",revision:"402b66900e731ca748771b6fc5e7a068"},{url:"./icons/pwa-192x192.png",revision:"eabf4d19df264df1374b6b8ec103ece3"},{url:"./icons/pwa-512x512.png",revision:"a6a962c6a584754622ba3a30d845f540"},{url:"manifest.webmanifest",revision:"7f72e7a7dd56296347bb1d27f4279e27"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute((({url:e})=>"https://docs.google.com"===e.origin&&e.pathname.startsWith("/spreadsheets/")),new e.NetworkFirst({cacheName:"api-cache",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:50,maxAgeSeconds:86400}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")}));
