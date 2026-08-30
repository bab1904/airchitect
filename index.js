import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}
const root = ReactDOM.createRoot(rootElement);
root.render(_jsx(React.StrictMode, { children: _jsxs(_Fragment, { children: [_jsx(App, {}), _jsx("div", { id: "__click-logger-root", style: { position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999 } }), _jsx("script", { dangerouslySetInnerHTML: { __html: `
        (function(){
          const root = document.getElementById('__click-logger-root');
          if(!root) return;
          function handleClick(e){
            try{
              const x = e.clientX; const y = e.clientY;
              console.log('[CLICK LOGGER]', { x, y, target: e.target ? e.target.tagName : null });
              const el = document.createElement('div');
              el.style.position = 'fixed';
              el.style.left = (x - 12) + 'px';
              el.style.top = (y - 12) + 'px';
              el.style.width = '24px';
              el.style.height = '24px';
              el.style.borderRadius = '50%';
              el.style.background = 'rgba(99,102,241,0.9)';
              el.style.boxShadow = '0 0 8px rgba(99,102,241,0.6)';
              el.style.pointerEvents = 'none';
              el.style.zIndex = '100000';
              el.style.transition = 'opacity 400ms ease-out, transform 400ms ease-out';
              el.style.transform = 'scale(1)';
              root.appendChild(el);
              setTimeout(()=>{ el.style.opacity = '0'; el.style.transform = 'scale(1.6)'; }, 50);
              setTimeout(()=>{ try{ root.removeChild(el);}catch(e){} }, 500);
            }catch(err){ console.error(err); }
          }
          document.addEventListener('click', handleClick, true);
          // expose for manual removal
          window.__CLICK_LOGGER = { remove: ()=> document.removeEventListener('click', handleClick, true) };
        })();
      ` } })] }) }));
