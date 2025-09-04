import { useEffect, useState } from 'react';
import { PRESENTATIONS } from './presentations';
import afterRemarkLoaded from './post-remark-load.js?raw';
import remark from './remark.js?raw';

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
        try {
          const mdModule = await import(
            `../presentation-data/${p.slug}/${p.mdUrl}.md?raw`
          );
          const res = mdModule.default as string;
          console.log('Raw markdown:', res);
          const normalized = res.replace(/`/g, '\\`').replace(/\${/g, '\\${');
          console.log('Normalized markdown:', normalized);
          setMd(normalized);
        } catch (error) {
          console.error('Failed to load markdown:', error);
        }
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

  // useScript({ body: remark }, () => {
  //   setRemarkedLoaded(true);
  // });

  useScript(
    { url: 'https://remarkjs.com/downloads/remark-latest.min.js' },
    () => {
      console.log('remark script loaded');
      setRemarkedLoaded(true);
    }
  );

  useScript(
    {
      // eslint-disable-next-line no-template-curly-in-string
      body: afterRemarkLoaded.replace('`${md}`', `\`${md}\``),
      waitFor: [remarkLoaded, md],
    },
    () => {
      console.log('afterRemarkLoaded executed');
    }
  );

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
}

function useScript(
  options: { body: string; waitFor?: unknown[] },
  onReady?: () => void
): void;
function useScript(
  options: { url: string; waitFor?: unknown[] },
  onReady?: () => void
): void;
function useScript(
  { url, body, waitFor }: { url?: string; body?: string; waitFor?: unknown[] },
  onReady?: () => void
): void {
  useEffect(() => {
    const cleanupTasks: Array<() => void> = [];
    console.log('waitFor:', waitFor);
    if (waitFor === undefined || waitFor.every((w) => !!w)) {
      console.log('Inserting script:', { url, body, waitFor });
      const script = document.createElement('script');
      script.className = 'dynamic-script';

      if (url) {
        console.log('Setting up external script:', url);
        script.src = url;
        if (onReady) {
          script.onload = () => {
            console.log('External script loaded:', url);
            onReady();
          };
          script.onerror = (error) => {
            console.error('Failed to load external script:', url, error);
          };
        }
        console.log('Script element created with src:', script.src);
      } else if (body) {
        console.log('Setting up inline script, length:', body.length);
        // Escape </script> tags to prevent HTML parser issues
        const escapedBody = body.replace(/<\/script>/gi, '<\\/script>');
        script.innerHTML = escapedBody;
      }

      console.log('Appending script to body...');
      document.body.appendChild(script);

      // For inline scripts, call onReady after a brief delay to ensure execution
      if (body && onReady) {
        setTimeout(onReady, 0);
      }

      cleanupTasks.push(() => {
        script.remove();
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
