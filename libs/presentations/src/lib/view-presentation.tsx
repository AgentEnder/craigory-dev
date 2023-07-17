import { useEffect, useState } from 'react';

import './view-presentation.scss'

/* eslint-disable-next-line */
export interface PresentationsProps {
  mdUrl: string
}

export function ViewPresentation(props: PresentationsProps) {
  const [remarkLoaded, setRemarkedLoaded] = useState(false);
  const [md, setMd] = useState<string | undefined>();

  useEffect(() => {
    (async function () {
      const res = await import(`../md/${props.mdUrl}.md?raw`).then(m => m.default);
      setMd(res);
    })()
  }, [props.mdUrl])
  
  useScript(
    { url: 'https://remarkjs.com/downloads/remark-latest.min.js' },
    () => {
      setRemarkedLoaded(true);
    }
  );

  useScript({
    body: `remark.create({source: \`${md}\`, ratio: '16:9'})`,
    waitFor: !!(remarkLoaded && md),
  });

  return (
    <></>
  );
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
