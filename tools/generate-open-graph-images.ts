import { webkit } from 'playwright';
import { blogPosts } from '../libs/blog-posts/src';
import { join } from 'path';
import { formatDateString } from '../libs/date-utils/src';
import { PRESENTATIONS } from '../libs/presentations/src';

const styles = `
body {
    font-family: sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    display: grid;
    place-items: center;
    height: 100vh;
    width: 100vw;
    background: rgb(2,0,36);
    background: radial-gradient(circle, rgba(2,0,36,1) 58%, rgba(0,77,93,1) 100%);
}
body > div {
    max-width: 900px;
    display: grid;
    gap: 1rem;
    place-items: center;
    max-height: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
}
h1 {
    margin: 0;
    color: white;
    font-size: 4rem;
}
p {
    margin: 2rem;
    color: white;
    font-size: 2rem;
}
#pageName {
    position: absolute;
    top: 1rem;
    left: 1rem;
    color: white;
    font-size: 2rem;
    font-style: italic;
    text-decoration: underline;
}
`;

const OUTPUT_BASE_PATH = join(__dirname, '../dist/apps/craigory-dev/client');

(async () => {
  console.log('Launching browser...');

  const browser = await webkit.launch({ headless: true });
  const page = await browser.newPage();

  async function generateOpenGraphImage(html: string, outputPath: string) {
    await page.setViewportSize({ width: 1200, height: 630 });
    page.setContent(html);
    await page.screenshot({ path: outputPath });
  }

  for (const blogPost of blogPosts) {
    console.log('Generating image for blog post:', blogPost.slug);
    await generateOpenGraphImage(
      `
            <html>
                <head>
                    <style>
                        ${styles}
                    </style>
                </head>
                <body>
                    <span id="pageName">craigory.dev</span>
                    <div>
                        <h1>${blogPost.title}</h1>
                        <p>${blogPost.description}</p>
                    </div>
                </body>
            </html>`,
      join(
        OUTPUT_BASE_PATH,
        'blog',
        formatDateString(blogPost.publishDate),
        blogPost.slug,
        `og.png`
      )
    );
  }
  for (const presentationKey in PRESENTATIONS) {
    const presentation = PRESENTATIONS[presentationKey];
    if (!presentation.mdUrl) {
      continue;
    }
    console.log('Generating image for presentation:', presentation.slug);
    await generateOpenGraphImage(
      `
            <html>
                <head>
                    <style>
                        ${styles}
                    </style>
                </head>
                <body>
                    <span id="pageName">craigory.dev</span>
                    <div>
                        <h1>${presentation.title}</h1>
                    </div>
                </body>
            </html>`,
      join(
        OUTPUT_BASE_PATH,
        'presentations',
        'view',
        presentation.slug,
        `og.png`
      )
    );
  }
  browser.close();
})();
