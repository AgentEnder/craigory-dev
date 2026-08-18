import { usePageContext } from 'vike-react/usePageContext';
import { absoluteSiteUrl } from './site-url';
import { resolveSetting } from './settings';

export function Head() {
  const context = usePageContext();
  const config = context.config as Record<string, unknown>;
  const description = resolveSetting(config.desc, context);
  const imageAlt = resolveSetting(config.imageAlt, context);

  return (
    <>
      <meta charSet="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      ></meta>
      {/* vike-react emits og:title and og:image itself, but only emits
          og:description from a setting named `description` — this site's is
          named `desc`, so without this the social card had no summary at all. */}
      {description ? (
        <>
          <meta name="description" content={description}></meta>
          <meta property="og:description" content={description}></meta>
        </>
      ) : null}
      <meta
        property="og:url"
        content={absoluteSiteUrl(context.urlPathname)}
      ></meta>
      {imageAlt ? (
        <>
          <meta property="og:image:alt" content={imageAlt}></meta>
          <meta name="twitter:image:alt" content={imageAlt}></meta>
        </>
      ) : null}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/obsidian.min.css"
      ></link>
      {/*<!-- Google tag (gtag.js) -->*/}
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-1180FLF5RC"
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
        function gtag() {
          dataLayer.push(arguments);
        }
        gtag('js', new Date());
  
        gtag('config', 'G-1180FLF5RC');
          `,
        }}
      ></script>
    </>
  );
}
