import { toast } from './toaster';

export function ContentMarker() {
  return (
    <div
      style={{
        display: 'inline-block',
      }}
      onClick={(e) => {
        if (e.target instanceof HTMLDivElement) {
          if (e.target.parentElement instanceof HTMLAnchorElement) {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(e.target.parentElement.href);
              toast({ content: 'Copied link to clipboard' });
            }
          }
        }
      }}
    >
      #
    </div>
  );
}
