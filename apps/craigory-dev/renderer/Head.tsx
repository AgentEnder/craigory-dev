export function Head() {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      ></meta>
      <meta name="description" content="${desc}"></meta>
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
