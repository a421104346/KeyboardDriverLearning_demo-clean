import type { App } from 'vue';
import gsap from 'gsap';

export const vAnimateStagger = {
  mounted(el: HTMLElement) {
    const targets = el.querySelectorAll('.stagger-enter');

    const animate = (elements: NodeListOf<Element> | Element[]) => {
      gsap.fromTo(
        elements,
        {
          x: 50,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          onComplete: () => {
            if (elements instanceof NodeList) {
              elements.forEach((t) => t.classList.remove('stagger-enter'));
            } else {
              elements.forEach((t) => t.classList.remove('stagger-enter'));
            }
            gsap.set(elements, { clearProps: 'all' });
          },
        }
      );
    };

    if (targets.length > 0) {
      animate(targets);
    } else if (el.classList.contains('stagger-enter')) {
      animate([el]);
    }
  },
};

export default {
  install(app: App) {
    app.directive('animate-stagger', vAnimateStagger);
  },
};
