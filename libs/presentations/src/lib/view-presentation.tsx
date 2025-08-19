import { useEffect, useState } from 'react';
import { PRESENTATIONS } from './presentations';
import afterRemarkLoaded from './post-remark-load.js?raw';

import './view-presentation.scss';

/* eslint-disable-next-line */
export interface PresentationsProps {
  presentationSlug: string;
}

export function ViewPresentation(props: PresentationsProps) {
  const [remarkLoaded, setRemarkedLoaded] = useState(false);
  const [md, setMd] = useState<string | undefined>();

  useEffect(() => {
    const p = PRESENTATIONS[props.presentationSlug];
    if (p?.mdUrl) {
      (async function () {
        const res = await import(
          `../presentation-data/${p.slug}/${p.mdUrl}.md?raw`
        ).then((m) => m.default);
        setMd(res.replace(/`/g, '\\`').replace(/\${/g, '\\${'));
      })();
    }

    const existingStyle = document.getElementById('presentation-style');
    if (existingStyle) {
      existingStyle.remove();
    }
    if (import.meta.env.DEV) {
      const styles = Array.from(
        document.querySelectorAll('head link[rel="stylesheet"]')
      );
      for (const style of styles) {
        if ((style as HTMLLinkElement).href.includes('presentation-data')) {
          style.remove();
        }
      }
    }
    if (p?.scssUrl) {
      const scssFiles = import.meta.glob('../presentation-data/**/*.scss', {
        query: '?inline',
      });
      scssFiles[`../presentation-data/${p.slug}/${p.scssUrl}.scss`]().then(
        (scss) => {
          const style = document.createElement('style');
          style.id = 'presentation-style';
          style.innerHTML = (scss as { default: string }).default;
          document.head.appendChild(style);
        }
      );
    }
    if (p?.htmlUrl) {
      (async function () {
        const html = await import(
          `../presentation-data/${p.slug}/${p.htmlUrl}.html?raw`
        );
        document.body.innerHTML = html.default;
      })();
    }
  }, [props.presentationSlug]);

  useScript(
    { url: 'https://remarkjs.com/downloads/remark-latest.min.js' },
    () => {
      setRemarkedLoaded(true);
    }
  );

  useScript({
    // eslint-disable-next-line no-template-curly-in-string
    body: afterRemarkLoaded.replace('`${md}`', `\`${md}\``),
    waitFor: !!(remarkLoaded && md),
  });

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
}

function useScript(
  options: { body: string; waitFor?: boolean },
  onReady?: () => void
): void;
function useScript(
  options: { url: string; waitFor?: boolean },
  onReady?: () => void
): void;
function useScript(
  { url, body, waitFor }: { url?: string; body?: string; waitFor?: boolean },
  onReady?: () => void
): void {
  useEffect(() => {
    const cleanupTasks: Array<() => void> = [];
    if (waitFor === undefined || waitFor) {
      const script = document.createElement('script');
      if (url) {
        script.src = url;
      } else if (body) {
        script.innerHTML = body;
      }

      document.body.appendChild(script);

      if (onReady) {
        script.onload = onReady;
      }

      cleanupTasks.push(() => {
        document.body.removeChild(script);
      });
    }

    return () => {
      for (const task of cleanupTasks) {
        task();
      }
    };
  }, [body, url, onReady, waitFor]);
}

export default ViewPresentation;
