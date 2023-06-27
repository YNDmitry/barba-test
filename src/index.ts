import barba from '@barba/core';
import { restartWebflow } from '@finsweet/ts-utils';
import { gsap } from 'gsap';

window.Webflow ||= [];
window.Webflow.push(() => {
  const svgCode = `
    <div id="shape" 			style="
        display: none;
        opacity: 0;
				min-height: 100vh;
				position: fixed;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				z-index: 999;
			">
        <svg viewBox="0 0 1000 1000">
            <rect
                class="rect"
                x="0"
                y="1000"
                width="100%"
                height="100%"
                stroke="none"
                fill="#fff"
                ry="1000"
                rx="1000"
            ></rect>
        </svg>
    </div>
  `;

  const svgElement = document.createElement('div');
  svgElement.innerHTML = svgCode;

  document.body.appendChild(svgElement);
  const shape = document.querySelector('#shape');
  const shapeSVG = shape?.querySelector('.rect');

  barba.init({
    transitions: [
      {
        name: 'default',
        async leave(data) {
          await gsap.to(shape, {
            display: 'block',
            opacity: 1,
            duration: 0,
          });
          await gsap.fromTo(
            shapeSVG,
            {
              duration: 1,
              attr: {
                y: '1000',
                ry: '700',
                rx: '700',
              },
            },
            {
              duration: 0.5,
              attr: {
                y: '-0',
                ry: '0',
                rx: '0',
              },
            }
          );
        },
        async after(data) {
          await gsap.to(shapeSVG, {
            duration: 0.5,
            attr: {
              y: '-1000',
              ry: '700',
              rx: '700',
            },
          });
          await gsap.to(shape, {
            display: 'none',
            opacity: 0,
            duration: 0,
          });
        },
      },
      {
        name: 'contact',
        to: {
          namespace: ['contact'],
        },
        async leave(data) {
          await gsap.to(data.current.container, {
            opacity: 0,
            duration: 0.2,
          });
        },
        async after(data) {
          await window.scroll(0, 0);
          await gsap.to(data.current.container, {
            opacity: 1,
            duration: 0.2,
          });
        },
      },
      {
        name: 'blog',
        to: {
          namespace: ['blog'],
        },
        from: {
          namespace: ['blog'],
        },
        async leave(data) {
          await gsap.to(data.current.container, {
            x: '100%',
            opacity: 0,
            duration: 0.5,
          });
        },
        async after(data) {
          await gsap.fromTo(
            data.next.container,
            {
              x: '-100%',
              opacity: 0,
            },
            {
              x: '0%',
              opacity: 1,
              duration: 0.5,
            }
          );
        },
      },
    ],
  });

  barba.hooks.after(async () => {
    await window.scroll(0, 0);
    await restartWebflow();
  });
});
