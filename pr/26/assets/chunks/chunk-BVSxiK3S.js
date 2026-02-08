import { j as jsxRuntimeExports, r as reactExports } from './chunk-BiSMlUrc.js';

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/github-pages-preview-env/contents.mdx [vike:pluginModuleBanner] */
function _createMdxContent$d(props) {
  const _components = {
    a: "a",
    code: "code",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    li: "li",
    p: "p",
    pre: "pre",
    span: "span",
    strong: "strong",
    ul: "ul",
    ...props.components
  }, {Anchor} = _components;
  if (!Anchor) _missingMdxReference$d("Anchor");
  return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [jsxRuntimeExports.jsx(_components.h1, {
      id: "setting-up-preview-environments-for-github-pages",
      children: "Setting Up Preview Environments for Github Pages"
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Github Pages provides free hosting for static websites. It’s a great way to host your personal blog, portfolio, or documentation, and is infact used to host this website. While it serves this purpose well, it is missing a feature that many newer hosting providers offer: preview environments."
    }), "\n", jsxRuntimeExports.jsx(_components.h2, {
      id: "table-of-contents",
      children: "Table of Contents"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "#what-are-preview-environments",
          children: "What are preview environments?"
        })
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "#prerequisite-deploy-with-github-actions",
          children: "Prerequisite: Deploy with Github Actions"
        })
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "#thinking-about-preview-environments-and-github-pages",
          children: "Thinking About Preview Environments and Github Pages"
        })
      }), "\n", jsxRuntimeExports.jsxs(_components.li, {
        children: [jsxRuntimeExports.jsx(_components.a, {
          href: "#setting-up-preview-environments",
          children: "Setting up Preview Environments"
        }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
          children: ["\n", jsxRuntimeExports.jsx(_components.li, {
            children: jsxRuntimeExports.jsx(_components.a, {
              href: "#building-for-the-preview-environment",
              children: "Building for the Preview Environment"
            })
          }), "\n", jsxRuntimeExports.jsx(_components.li, {
            children: jsxRuntimeExports.jsx(_components.a, {
              href: "#deploying-to-the-preview-environment",
              children: "Deploying to the Preview Environment"
            })
          }), "\n"]
        }), "\n"]
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "#commenting-on-pull-requests",
          children: "Commenting on Pull Requests"
        })
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "#cleaning-up-preview-environments",
          children: "Cleaning up Preview Environments"
        })
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "#summary-and-next-steps",
          children: "Summary and Next Steps"
        })
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "what-are-preview-environments",
      children: ["What are preview environments?", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#what-are-preview-environments",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Preview environments are temporary environments that are created for each pull request. They allow you to preview your changes before merging them into the main branch. This is especially useful for static websites, where you can’t preview your changes locally. Vercel and Netlify both offer this feature, and leave a comment on the pull request with a link to the preview environment."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "prerequisite-deploy-with-github-actions",
      children: ["Prerequisite: Deploy with Github Actions", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#prerequisite-deploy-with-github-actions",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["Before getting into the nitty-gritty of setting up preview environments, its important to have a good understanding of how deploying to GitHub Pages works. There are a variety of ways to deploy to GitHub Pages, and some official actions blocks that can make it easier. For this tutorial, we will ", jsxRuntimeExports.jsx(_components.strong, {
        children: "not"
      }), " be using the official block or even a custom one. Instead, we will be using a different method to deploy that involves pushing the build artifacts to the ", jsxRuntimeExports.jsx(_components.code, {
        children: "gh-pages"
      }), " branch."]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "In practice, the steps will look something like this:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Build the website"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Initialize a new git repository in the build directory"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Commit the build artifacts"
      }), "\n", jsxRuntimeExports.jsxs(_components.li, {
        children: ["Force push the build artifacts to the ", jsxRuntimeExports.jsx(_components.code, {
          children: "gh-pages"
        }), " branch"]
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "This creates a branch in the repository that has an unrelated history to the main branch, containing a single commit that represents the current build. This is the branch that Github Pages will use to serve the website. I typically set this up as a GitHub action that either runs on push or on workflow_dispatch. An example script that does this is below:"
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      filename: ".github/workflows/deploy.yml",
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-yaml",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "name:"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "Nightly"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "Deployment"
        }), "\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "on:"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "schedule:"
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-bullet",
          children: "-"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "cron:"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'0 0 * * *'"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "push:"
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "branches:"
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-bullet",
          children: "-"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "main"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "workflow_dispatch:"
        }), "\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "jobs:"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "deploy:"
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "runs-on:"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "ubuntu-latest"
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "permissions:"
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "contents:"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "write"
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "id-token:"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "write"
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "pages:"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "write"
        }), "\n\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "steps:"
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-bullet",
          children: "-"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "name:"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "Checkout"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "code"
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "uses:"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "actions/checkout@v2"
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "with:"
        }), "\n          ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "fetch-depth:"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-number",
          children: "0"
        }), "\n\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-bullet",
          children: "-"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "name:"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "Setup"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "Node.js"
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "uses:"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "actions/setup-node@v4"
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "with:"
        }), "\n          ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "node-version:"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'22.5.1'"
        }), "\n          ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "cache:"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'npm'"
        }), "\n\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-bullet",
          children: "-"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "name:"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "Install"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "dependencies"
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "run:"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "npm"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "ci"
        }), "\n\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-bullet",
          children: "-"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "name:"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "Setup"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "Git"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "User"
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "run:"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "|\n          git config --global user.name \"${GITHUB_ACTOR}\"\n          git config --global user.email \"${GITHUB_ACTOR}@users.noreply.github.com\"\n"
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "# Add your deployment steps here"
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-bullet",
          children: "-"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "name:"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "Deploy"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "to"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "production"
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "run:"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "|\n          node ./node_modules/.bin/nx build craigory-dev\n          node ./tools/scripts/deploy.js\n"
        })]
      })
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["The ", jsxRuntimeExports.jsx(_components.code, {
        children: "deploy.js"
      }), " script is a simple script that does the following:"]
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      filename: "tools/scripts/deploy.js",
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-javascript",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " { execSync } = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-built_in",
          children: "require"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'child_process'"
        }), ");\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "BUILD_DIR"
        }), " = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'dist/apps/craigory-dev'"
        }), ";\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "GH_PAGES_BRANCH"
        }), " = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'gh-pages'"
        }), ";\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "REMOTE_URL"
        }), " = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'https://github.com/agentender/craigory-dev.git'"
        }), ";\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// Create a new git repository in build directory, pointing to this repository"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "execSync"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "`git init`"
        }), ", { ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "cwd"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "BUILD_DIR"
        }), " });\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "execSync"
        }), "(", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-string",
          children: ["`git remote add origin ", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${REMOTE_URL}"
          }), "`"]
        }), ", { ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "cwd"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "BUILD_DIR"
        }), " });\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// Commit the build artifacts"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "execSync"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "`git add .`"
        }), ", { ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "cwd"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "BUILD_DIR"
        }), " });\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "execSync"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "`git commit -m \"Deploy\"`"
        }), ", { ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "cwd"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "BUILD_DIR"
        }), " });\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// Force push the build artifacts to the `gh-pages` branch, overwriting any existing history"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "execSync"
        }), "(", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-string",
          children: ["`git push origin --force HEAD:", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${GH_PAGES_BRANCH}"
          }), "`"]
        }), ", { ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "cwd"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "BUILD_DIR"
        }), " });\n"]
      })
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["When a push is made to the ", jsxRuntimeExports.jsx(_components.code, {
        children: "gh-pages"
      }), " branch, there is a built-in action that will deploy the website. This is how I typically setup “production” deployments to GitHub Pages."]
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "thinking-about-preview-environments-and-github-pages",
      children: ["Thinking About Preview Environments and Github Pages", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#thinking-about-preview-environments-and-github-pages",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Github Pages only allows a single deployment per repository. This means that we can’t strictly follow the same pattern as Vercel or Netlify, where each pull request gets its own deployment. Additionally, if we want to isolate our preview environments from the main branch we can’t use the same ‘gh-pages’ branch for both preview environments and production."
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["This has led me to typically deploy production build artifacts to a separate repository on GitHub. The only changes required to the above script are to change the ", jsxRuntimeExports.jsx(_components.code, {
        children: "REMOTE_URL"
      }), " to point to the new repository. This allows me to have a separate repository for the production build artifacts, and point the current ", jsxRuntimeExports.jsx(_components.code, {
        children: "gh-pages"
      }), " branch of this repository to a subdomain of the production website."]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["GitHub pages only supports static web apps. This means that the build artifacts on disk are directly served to the user. We can use this to our advantage by pushing the build artifacts of the preview environment to a subdirectory of the ", jsxRuntimeExports.jsx(_components.code, {
        children: "gh-pages"
      }), " branch. This will surface as a url like: ", jsxRuntimeExports.jsx(_components.code, {
        children: "${username}.github.io/${repository}/${whatever-directory-you-choose}"
      }), ". By picking subdirectories based on the pull request number, we can form predictable, short urls that are human readable. This is the approach I will be outlining in this tutorial."]
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "setting-up-preview-environments",
      children: ["Setting up Preview Environments", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#setting-up-preview-environments",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Knowing how this will be structured, we can break the problem down into a few steps:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Build the website on the PR branch"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Create a new temporary folder called ‘gh-pages-root’ in the repository"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Initialize a new git repository in the ‘gh-pages-root’ folder"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Copy the build artifacts to a subdirectory of ‘gh-pages-root’"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Commit the build artifacts"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Sync the ‘gh-pages-root’ folder with the ‘gh-pages’ branch"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Push the changes to the ‘gh-pages’ branch"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "building-for-the-preview-environment",
      children: ["Building for the Preview Environment", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#building-for-the-preview-environment",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["This should be ", jsxRuntimeExports.jsx(_components.strong, {
        children: "very"
      }), " similar to your current build script. The main thing that needs to change is that the base url for your page will not be ", jsxRuntimeExports.jsx(_components.code, {
        children: "/"
      }), " on the preview environment. Depending on how your web app is built, this will require different changes. This website (craigory.dev) is built using ", jsxRuntimeExports.jsx(_components.a, {
        href: "https://vike.dev",
        rel: "noopener noreferrer",
        target: "_blank",
        children: "Vike"
      }), ", a framework built on top of Vite. Vike supports passing in the base url via the ", jsxRuntimeExports.jsx(_components.code, {
        children: "base"
      }), " property in the vite config, which can be overridden on the CLI. As such, I am building the preview environment with a command like:"]
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-bash",
        children: ["nx run craigory-dev:build --base /pr/", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable",
          children: "${PR_NUMBER}"
        }), "/\n"]
      })
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Documentation about how to set the base url for different frameworks can be found here:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "https://vitejs.dev/config/shared-options.html#base",
          rel: "noopener noreferrer",
          target: "_blank",
          children: "Vite"
        })
      }), "\n", jsxRuntimeExports.jsxs(_components.li, {
        children: [jsxRuntimeExports.jsx(_components.a, {
          href: "https://angular.dev/guide/routing/common-router-tasks#base-href",
          rel: "noopener noreferrer",
          target: "_blank",
          children: "Angular"
        }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
          children: ["\n", jsxRuntimeExports.jsx(_components.li, {
            children: jsxRuntimeExports.jsx(_components.a, {
              href: "https://analogjs.org/docs/features/data-fetching/server-side-data-fetching#setting-the-public-base-url",
              rel: "noopener noreferrer",
              target: "_blank",
              children: "Analog JS"
            })
          }), "\n"]
        }), "\n"]
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "https://mademistakes.com/mastering-jekyll/site-url-baseurl/",
          rel: "noopener noreferrer",
          target: "_blank",
          children: "Jekyll"
        })
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/",
          rel: "noopener noreferrer",
          target: "_blank",
          children: "Gatsby"
        })
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "https://nextjs.org/docs/api-reference/next.config.js/basepath",
          rel: "noopener noreferrer",
          target: "_blank",
          children: "Next.js"
        })
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "https://gohugo.io/methods/site/baseurl/",
          rel: "noopener noreferrer",
          target: "_blank",
          children: "Hugo"
        })
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "https://docusaurus.io/docs/deployment#configuration",
          rel: "noopener noreferrer",
          target: "_blank",
          children: "Docusaurus"
        })
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "For other frameworks, you’ll need to find the equivalent way to pass in the base url. This is important because the base url is used to resolve assets or any relative paths, and if it is incorrect your website will not load correctly."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "deploying-to-the-preview-environment",
      children: ["Deploying to the Preview Environment", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#deploying-to-the-preview-environment",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "This is a bit more involved than the previous script, but is made up of the same basic steps. The script below will do this:"
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      filename: "tools/scripts/deploy-preview.js",
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-javascript",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " { execSync } = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-built_in",
          children: "require"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'child_process'"
        }), ");\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " fs = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-built_in",
          children: "require"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'fs'"
        }), ");\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " path = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-built_in",
          children: "require"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'path'"
        }), ");\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "BUILD_DIR"
        }), " = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'dist/apps/craigory-dev'"
        }), ";\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "GH_PAGES_ROOT"
        }), " = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'gh-pages-root'"
        }), ";\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "GH_PAGES_BRANCH"
        }), " = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'gh-pages'"
        }), ";\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "REMOTE_URL"
        }), " = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'...'"
        }), "; ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// This should be the url of the repository that will host the preview build artifacts"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "PR_NUMBER"
        }), " = process.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "env"
        }), ".", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "PR_NUMBER"
        }), "; ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// This should be passed in as an environment variable"
        }), "\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// Create a new git repository in the 'gh-pages-root' folder, pointing to this repository"
        }), "\nfs.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "mkdirSync"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "GH_PAGES_ROOT"
        }), ", { ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "recursive"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-literal",
          children: "true"
        }), " });\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "execSync"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "`git init`"
        }), ", { ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "cwd"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "GH_PAGES_ROOT"
        }), " });\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "execSync"
        }), "(", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-string",
          children: ["`git remote add origin ", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${REMOTE_URL}"
          }), "`"]
        }), ", { ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "cwd"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "GH_PAGES_ROOT"
        }), " });\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// Copy the build artifacts to a subdirectory of 'gh-pages-root'"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " dest = path.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "join"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "GH_PAGES_ROOT"
        }), ", ", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-string",
          children: ["`pr/", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${PR_NUMBER}"
          }), "`"]
        }), ");\nfs.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "mkdirSync"
        }), "(dest, { ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "recursive"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-literal",
          children: "true"
        }), " });\nfs.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "cpSync"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "BUILD_DIR"
        }), ", dest);\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// Commit the build artifacts"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "execSync"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "`git add .`"
        }), ", { ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "cwd"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "GH_PAGES_ROOT"
        }), " });\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "execSync"
        }), "(", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-string",
          children: ["`git commit -m \"Deploy preview ", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${PR_NUMBER}"
          }), "\"`"]
        }), ", { ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "cwd"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "GH_PAGES_ROOT"
        }), " });\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// Sync the 'gh-pages-root' folder with the 'gh-pages' branch"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "execSync"
        }), "(", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-string",
          children: ["`git fetch origin ", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${GH_PAGES_BRANCH}"
          }), "`"]
        }), ", { ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "cwd"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "GH_PAGES_ROOT"
        }), " });\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// The --allow-unrelated-histories flag is required because the 'gh-pages' branch has no history"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "execSync"
        }), "(", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-string",
          children: ["`git merge origin/", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${GH_PAGES_BRANCH}"
          }), " --allow-unrelated-histories`"]
        }), ", {\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "cwd"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "GH_PAGES_ROOT"
        }), ",\n});\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// Push the changes to the 'gh-pages' branch"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "execSync"
        }), "(", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-string",
          children: ["`git push origin HEAD:", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${GH_PAGES_BRANCH}"
          }), "`"]
        }), ", { ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "cwd"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "GH_PAGES_ROOT"
        }), " });\n"]
      })
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["This script should be run on every pull request. It will create a new subdirectory in the ", jsxRuntimeExports.jsx(_components.code, {
        children: "gh-pages-root"
      }), " folder, copy the build artifacts to it, and push the changes to the ", jsxRuntimeExports.jsx(_components.code, {
        children: "gh-pages"
      }), " branch. This is enough to have functioning preview environments for your Github Pages, minus a few nice-to-haves that other hosting providers offer."]
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "commenting-on-pull-requests",
      children: ["Commenting on Pull Requests", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#commenting-on-pull-requests",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["Its helpful to leave a comment on the pull request with a link to the preview environment. This can be done with the Github API, and is a nice touch that makes it easier for reviewers to see the changes. For a full example of how to do this, I’d recommend checking the script in this repository found ", jsxRuntimeExports.jsx(_components.a, {
        href: "https://github.com/agentender/craigory-dev/blob/main/tools/update-preview-comment.ts",
        rel: "noopener noreferrer",
        target: "_blank",
        children: "here"
      }), "."]
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "cleaning-up-preview-environments",
      children: ["Cleaning up Preview Environments", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#cleaning-up-preview-environments",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Preview environments are temporary, and should be cleaned up after the pull request is closed. While its not paramount to do this, it can be helpful to keep the repository clean and avoid your GitHub Pages deployment size growing too large."
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["This can be done with a simple script that deletes the subdirectory in the ", jsxRuntimeExports.jsx(_components.code, {
        children: "gh-pages-root"
      }), " folder. This script can be run on pull request close, or on a schedule. An example script that does this is below:"]
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      filename: "tools/scripts/cleanup-preview.js",
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-javascript",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " fs = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-built_in",
          children: "require"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'fs'"
        }), ");\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " path = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-built_in",
          children: "require"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'path'"
        }), ");\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " { execSync } = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-built_in",
          children: "require"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'child_process'"
        }), ");\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "GH_PAGES_ROOT"
        }), " = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'gh-pages-root'"
        }), ";\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "PR_NUMBER"
        }), " = process.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "env"
        }), ".", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "PR_NUMBER"
        }), "; ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// This should be passed in as an environment variable"
        }), "\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// Remove PR directory"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " dest = path.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "join"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "GH_PAGES_ROOT"
        }), ", ", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-string",
          children: ["`pr/", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${PR_NUMBER}"
          }), "`"]
        }), ");\nfs.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "rmSync"
        }), "(dest, { ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "recursive"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-literal",
          children: "true"
        }), " });\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// Commit the removal"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "execSync"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "`git add .`"
        }), ", { ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "cwd"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "GH_PAGES_ROOT"
        }), " });\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "execSync"
        }), "(", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-string",
          children: ["`git commit -m \"Remove preview ", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${PR_NUMBER}"
          }), "\"`"]
        }), ", { ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "cwd"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "GH_PAGES_ROOT"
        }), " });\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// Push the changes to the 'gh-pages' branch"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "execSync"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "`git push origin HEAD:gh-pages`"
        }), ", { ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "cwd"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "GH_PAGES_ROOT"
        }), " });\n"]
      })
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "There are a few things to note about this script:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "It should be ran in a GitHub action that runs on PR close."
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "It should be passed the PR number as an environment variable."
      }), "\n", jsxRuntimeExports.jsxs(_components.li, {
        children: ["It should checkout the ", jsxRuntimeExports.jsx(_components.code, {
          children: "gh-pages"
        }), " branch before running the script."]
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["Alternatively, if you are running the job on a schedule you could remove any PR directories that are older than a certain age. This would be a bit more involved, but is a good way to keep the repository clean but give preview environments a bit more longevity. This is the path this repository has taken, and the script can be found ", jsxRuntimeExports.jsx(_components.a, {
        href: "https://github.com/agentender/craigory-dev/blob/main/tools/cleanup-old-deployments.ts",
        rel: "noopener noreferrer",
        target: "_blank",
        children: "here"
      }), "."]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["Regardless of which approach you take, one caveat to keep in mind is that since the ", jsxRuntimeExports.jsx(_components.code, {
        children: "gh-pages"
      }), " branch is checked out instead of your typical ", jsxRuntimeExports.jsx(_components.code, {
        children: "main"
      }), " branch, any script that needs to be ran will need to be present inside the ", jsxRuntimeExports.jsx(_components.code, {
        children: "gh-pages"
      }), " branch. With our publishing strategy this is not a given, so you’ll need to workaround it. In this repository’s case I’ve added a command into the ", jsxRuntimeExports.jsx(_components.code, {
        children: "cleanup-pr-deployments.yml"
      }), " workflow that downloads the latest version of the ", jsxRuntimeExports.jsx(_components.code, {
        children: "gh-pages"
      }), " branch before running the cleanup script. You could also update the deployment script to include the tools folder as part of the build artifacts, but that may not be desired."]
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "summary-and-next-steps",
      children: ["Summary and Next Steps", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#summary-and-next-steps",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "We’ve covered a bit of how basic GitHub Pages deployments work, as well as how to shift that to support preview environments. This is a great way to get a bit more out of your GitHub Pages deployment without having to change hosting providers, and can be a good way to preview changes before merging them into the main branch."
    })]
  });
}
function MDXContent$d(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? jsxRuntimeExports.jsx(MDXLayout, {
    ...props,
    children: jsxRuntimeExports.jsx(_createMdxContent$d, {
      ...props
    })
  }) : _createMdxContent$d(props);
}
function _missingMdxReference$d(id, component) {
  throw new Error("Expected " + ("component" ) + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/github-pages-preview-env/post.ts [vike:pluginModuleBanner] */
const githubPagesPreviewEnv = {
  mdx: MDXContent$d,
  publishDate: new Date(2024, 6, 23),
  slug: "gh-pages-preview-env",
  title: "Setting up a GitHub Pages Preview Environment",
  description: `Many services such as Vercel and Netlify offer preview environments for pull requests, but GitHub Pages does not. This post will walk you through how to set up a GitHub Pages preview environment for your pull requests.`,
  tags: ["technical", "github", "devops", "tutorial"]
};

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/github-unlisted-repos/contents.mdx [vike:pluginModuleBanner] */
function _createMdxContent$c(props) {
  const _components = {
    a: "a",
    code: "code",
    h1: "h1",
    h2: "h2",
    li: "li",
    ol: "ol",
    p: "p",
    pre: "pre",
    span: "span",
    ul: "ul",
    ...props.components
  }, {Anchor, LinkToPost} = _components;
  if (!Anchor) _missingMdxReference$c("Anchor");
  if (!LinkToPost) _missingMdxReference$c("LinkToPost");
  return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [jsxRuntimeExports.jsx(_components.h1, {
      id: "unlisted-github-repositories",
      children: "Unlisted Github Repositories"
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Services such as YouTube provide support for unlisted videos. This allows publishing a video that is publicly accessible, but only via a direct link. This is useful for sharing content with a select group of people. It be used for getting early feedback on a video draft, or for sharing a video with a client before it goes live."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "There is no equivalent feature for GitHub repositories, but the need still exists. Some reasons I’ve needed this feature include:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Sharing issue reproductions"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Sharing more complex code snippets like multifile gists"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "These could both technically be done as a public repository, but it clutters up the profile and makes it harder to find the repositories that are actually meaningful."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "unrelated-branches",
      children: ["Unrelated Branches", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#unrelated-branches",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "A git repository frequently has many branches of code, typically waiting to be merged into the main branch. Branches, however, do not necessarily have to be related to the main branch. As such, you can push any branch to any repository, even if they don’t share a common ancestor."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "This is the key to our approach of creating unlisted repositories."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "steps-to-create-an-unlisted-repository",
      children: ["Steps to Create an Unlisted Repository", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#steps-to-create-an-unlisted-repository",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.ol, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Create a “host” repository that will contain all of your unlisted repositories. This repository will be public, but not contain code on the main branch. It differs from other repositories in that it will contain many branches, each representing a different unlisted repository. I’d recommend adding a README to this repository that explains the purpose of the repository and how to use it."
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "For example, I use https://github.com/agentender/github-issues as my host repository."
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsxs(_components.ol, {
      start: "2",
      children: ["\n", jsxRuntimeExports.jsxs(_components.li, {
        children: ["\n", jsxRuntimeExports.jsx(_components.p, {
          children: "Create or open the repository that will be published as unlisted. Only the checked out branch will be shared."
        }), "\n"]
      }), "\n", jsxRuntimeExports.jsxs(_components.li, {
        children: ["\n", jsxRuntimeExports.jsx(_components.p, {
          children: "Run the following command to push the branch to the host repository:"
        }), "\n"]
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-bash",
        children: ["git push ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable",
          children: "$HOST_REPO_REMOTE_URL"
        }), " HEAD:", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable",
          children: "$BRANCH_NAME"
        }), "\n"]
      })
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["You should replace ", jsxRuntimeExports.jsx(_components.code, {
        children: "$HOST_REPO_REMOTE_URL"
      }), " with the URL of the host repository and ", jsxRuntimeExports.jsx(_components.code, {
        children: "$BRANCH_NAME"
      }), " with the name you want to use when sharing the branch."]
    }), "\n", jsxRuntimeExports.jsxs(_components.ol, {
      start: "4",
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Share the URL of the branch with the people you want to have access to it."
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "The link should look something like this:"
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      children: jsxRuntimeExports.jsx(_components.code, {
        className: "hljs language-plaintext",
        children: "https://github.com/{user}/{host-repo}/tree/{branch-name}\n"
      })
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "supporting-infra",
      children: ["Supporting Infra", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#supporting-infra",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "If you plan to use this semi-frequently, I’d recommend creating a script or git alias to simplify the process. Here’s an example script I use:"
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-js",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable constant_",
          children: "REMOTE_URL"
        }), " = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'https://github.com/agentender/github-issues'"
        }), ";\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " tryExec = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-built_in",
          children: "require"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'./utils/try-exec'"
        }), ");\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "function"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "prompt"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-params",
          children: "message"
        }), ") {\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "return"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "new"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title class_",
          children: "Promise"
        }), "(", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-function",
          children: ["(", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-params",
            children: "resolve"
          }), ") =>"]
        }), " {\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " readline = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-built_in",
          children: "require"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'readline'"
        }), ").", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "createInterface"
        }), "({\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "input"
        }), ": process.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "stdin"
        }), ",\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "output"
        }), ": process.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "stdout"
        }), ",\n    });\n    readline.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "question"
        }), "(message, ", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-function",
          children: ["(", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-params",
            children: "answer"
          }), ") =>"]
        }), " {\n      readline.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "close"
        }), "();\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "resolve"
        }), "(answer);\n    });\n    readline.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "on"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'SIGINT'"
        }), ", ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-function",
          children: "() =>"
        }), " {\n      readline.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "close"
        }), "();\n      process.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "stdout"
        }), ".", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "write"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'\\n'"
        }), ");\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable language_",
          children: "console"
        }), ".", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "log"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'Aborted.'"
        }), ");\n      process.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "exit"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-number",
          children: "1"
        }), ");\n    });\n  });\n}\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "function"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "isForced"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-params"
        }), ") {\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "return"
        }), " process.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "argv"
        }), ".", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "includes"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'--force'"
        }), ") || process.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "argv"
        }), ".", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "includes"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'-f'"
        }), ");\n}\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "async"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "function"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "checkIfBranchAlreadyOnRemote"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-params",
          children: "branch"
        }), ") {\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " { code } = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "await"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "tryExec"
        }), "(\n    ", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-string",
          children: ["`git ls-remote --exit-code ", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${REMOTE_URL}"
          }), " ", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${branch}"
          }), "`"]
        }), ",\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-literal",
          children: "true"
        }), "\n  );\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "return"
        }), " code === ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-number",
          children: "0"
        }), ";\n}\n\n(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "async"
        }), " () => {\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " forced = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "isForced"
        }), "();\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " currentBranchName = (\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "await"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "tryExec"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'git rev-parse --abbrev-ref HEAD'"
        }), ", ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-literal",
          children: "true"
        }), ")\n  ).", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "stdout"
        }), ".", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "trim"
        }), "();\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "let"
        }), " branch = currentBranchName;\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "if"
        }), " (currentBranchName === ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'master'"
        }), " || currentBranchName === ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'main'"
        }), ") {\n    branch = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "await"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "prompt"
        }), "(\n      ", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-string",
          children: ["`What branch would you like to publish to?", jsxRuntimeExports.jsxs(_components.span, {
            className: "hljs-subst",
            children: ["${\n        forced ? ", jsxRuntimeExports.jsx(_components.span, {
              className: "hljs-string",
              children: "' (Any existing contents will be overwritten)'"
            }), " : ", jsxRuntimeExports.jsx(_components.span, {
              className: "hljs-string",
              children: "''"
            }), "\n      }"]
          }), "`"]
        }), "\n    );\n  }\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "while"
        }), " (!forced && (", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "await"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "checkIfBranchAlreadyOnRemote"
        }), "(branch))) {\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " next = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "await"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "prompt"
        }), "(\n      ", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-string",
          children: ["`Branch ", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${branch}"
          }), " already exists on remote. What branch would you like to publish to?`"]
        }), "\n    );\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "if"
        }), " (next === ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "''"
        }), ") {\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable language_",
          children: "console"
        }), ".", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "log"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'Aborted.'"
        }), ");\n      process.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "exit"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-number",
          children: "1"
        }), ");\n    }\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "if"
        }), " (branch) branch = next;\n  }\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "await"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "tryExec"
        }), "(", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-string",
          children: ["`git push ", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${REMOTE_URL}"
          }), " ", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${currentBranchName}"
          }), ":", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${branch}"
          }), "`"]
        }), ");\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable language_",
          children: "console"
        }), ".", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "log"
        }), "(", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-string",
          children: ["`✅ Published branch at ", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${REMOTE_URL}"
          }), "/tree/", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${branch}"
          }), "`"]
        }), ");\n})();\n"]
      })
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Wrapping the process in a script makes it easier to use, and ensures consistency. This also gives a spot to add additional checks or features in the future."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "The example script above for example:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Prevents accidentally overwriting an existing branch"
      }), "\n", jsxRuntimeExports.jsxs(_components.li, {
        children: ["Prompts for branch name if the current branch is ", jsxRuntimeExports.jsx(_components.code, {
          children: "master"
        }), " or ", jsxRuntimeExports.jsx(_components.code, {
          children: "main"
        }), ", or would otherwise overwrite an existing branch"]
      }), "\n", jsxRuntimeExports.jsxs(_components.li, {
        children: ["Allows forcing the push with ", jsxRuntimeExports.jsx(_components.code, {
          children: "--force"
        }), " or ", jsxRuntimeExports.jsx(_components.code, {
          children: "-f"
        })]
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["If you setup a script like this, you can add it as a git alias to make it easier to use. I’ve covered how to do this in a previous post: ", jsxRuntimeExports.jsx(LinkToPost, {
        ref: props.post,
        slug: "superpowered-git-aliases"
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "wrapping-up",
      children: ["Wrapping Up", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#wrapping-up",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "This isn’t quite as good as native support for unlisted repositories, but it’s a good workaround. Sharing reproductions will no longer clutter up your profile, and you can share more complex code snippets without needing to create a new repository for each one. Of note, this approach has limitations that native support would not."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Repo’s shared with this manner:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Can not really have more than one branch"
      }), "\n", jsxRuntimeExports.jsxs(_components.li, {
        children: ["Can not have issues or pull requests", "\n", jsxRuntimeExports.jsxs(_components.ul, {
          children: ["\n", jsxRuntimeExports.jsx(_components.li, {
            children: "This also makes it hard to test things like Github Actions or similar"
          }), "\n"]
        }), "\n"]
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Can be found by anyone with access to the host repository"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "With that said, I still think this is a useful tool to have in your toolbox."
    })]
  });
}
function MDXContent$c(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? jsxRuntimeExports.jsx(MDXLayout, {
    ...props,
    children: jsxRuntimeExports.jsx(_createMdxContent$c, {
      ...props
    })
  }) : _createMdxContent$c(props);
}
function _missingMdxReference$c(id, component) {
  throw new Error("Expected " + ("component" ) + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/github-unlisted-repos/post.ts [vike:pluginModuleBanner] */
const githubUnlistedRepos = {
  mdx: MDXContent$c,
  publishDate: new Date(2024, 8, 11),
  slug: "gh-unlisted-repos",
  title: "Unlisted GitHub Repositories",
  description: `There are times where you may want to have a publicly accessible repository on GitHub, but you don't want it to show up on your profile. Many video hosting services like YouTube have support for this, but GitHub does not. This post explores an alternative strategy.`,
  tags: ["technical", "github", "tutorial"]
};

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/multifunctional-example-files/contents.mdx [vike:pluginModuleBanner] */
function _createMdxContent$b(props) {
  const _components = {
    a: "a",
    code: "code",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    li: "li",
    p: "p",
    pre: "pre",
    span: "span",
    ul: "ul",
    ...props.components
  }, {Anchor} = _components;
  if (!Anchor) _missingMdxReference$b("Anchor");
  return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [jsxRuntimeExports.jsx(_components.h1, {
      id: "multifunctional-example-files",
      children: "Multifunctional Example Files"
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "I’ve started using a technique I’m calling “multifunctional example files” in recent projects. Using this technique, I’m able to create a single example file, and each example file becomes both:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "A page in the documentation"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "An actual typescript file, which can be played around with if you clone the project"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "An E2E test"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "This technique has been awesome, because it ensures that the documentation is always up-to-date with the code. If the documentation is out-of-date, the E2E test will fail."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Projects currently using this technique:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "https://github.com/agentender/flexi-bench",
          rel: "noopener noreferrer",
          target: "_blank",
          children: "FlexiBench"
        })
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "https://github.com/agentender/cli-forge",
          rel: "noopener noreferrer",
          target: "_blank",
          children: "CLI Forge"
        })
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "limitations",
      children: ["Limitations", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#limitations",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "This technique has a few limitations, but its also easy to extend so these could be worked around. Currently, as implemented, the technique only really works if your examples can easily be written in a single file. If you wish to have a more complex example that spans multiple files, you’d need to tweak the technique a bit."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "how-it-works",
      children: ["How it works", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#how-it-works",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "The technique is made up of 3 main parts:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "The example files themselves"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "A simple docusaurus plugin to generate pages from the example files"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "A small script to run the E2E tests based on the example files"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "example-files",
      children: ["Example Files", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#example-files",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "These are regular typescript files, with the only difference being that they have some yaml frontmatter at the top of the file. This frontmatter is used to generate the documentation page and provide data to the E2E test. As an example, consider something like below:"
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-typescript",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// ---"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// title: Example Title"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// description: Example Description"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// ---"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "export"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " example = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'example'"
        }), ";\n"]
      })
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "docusaurus-plugin",
      children: ["Docusaurus Plugin", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#docusaurus-plugin",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "The docusaurus plugin scans the examples directory, loads the contents of each file and parses out the frontmatter. The frontmatter is then stripped from the rest of the file, and the entire contents is then used to build a markdown file. The plugin code should look something like this:"
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-typescript",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "import"
        }), " { ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title class_",
          children: "LoadContext"
        }), " } ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "from"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'@docusaurus/types'"
        }), ";\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "import"
        }), " { workspaceRoot } ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "from"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'@nx/devkit'"
        }), ";\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "import"
        }), " {\n  blockQuote,\n  codeBlock,\n  h1,\n  h2,\n  lines,\n  link,\n  ul,\n} ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "from"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'markdown-factory'"
        }), ";\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "import"
        }), " { mkdirSync, readFileSync, readdirSync, writeFileSync } ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "from"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'node:fs'"
        }), ";\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "import"
        }), " { basename, dirname, join, sep } ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "from"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'node:path'"
        }), ";\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "import"
        }), " { parse ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "as"
        }), " loadYaml, stringify } ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "from"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'yaml'"
        }), ";\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "export"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "async"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "function"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "ExamplesDocsPlugin"
        }), "(", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-params",
          children: [jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-attr",
            children: "context"
          }), ": ", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-title class_",
            children: "LoadContext"
          })]
        }), ") {\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " examplesRoot = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "join"
        }), "(workspaceRoot, ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'examples'"
        }), ") + sep;\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " examples = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "collectExamples"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "join"
        }), "(examplesRoot, ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'../examples'"
        }), "));\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "for"
        }), " (", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " example ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "of"
        }), " examples) {\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " relative = example.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "path"
        }), ".", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "replace"
        }), "(examplesRoot, ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "''"
        }), ");\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " destination = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "join"
        }), "(\n      __dirname,\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'../../docs/examples'"
        }), ",\n      relative.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "replace"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'.ts'"
        }), ", ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'.md'"
        }), ")\n    );\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "ensureDirSync"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "dirname"
        }), "(destination));\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "writeFileSync"
        }), "(destination, ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "formatExampleMd"
        }), "(example));\n  }\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "ensureDirSync"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "join"
        }), "(__dirname, ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'../../docs/examples'"
        }), "));\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "writeFileSync"
        }), "(\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "join"
        }), "(__dirname, ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'../../docs/examples/index.md'"
        }), "),\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "formatIndexMd"
        }), "(examples)\n  );\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "return"
        }), " {\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// a unique name for this plugin"
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "name"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'examples-docs-plugin'"
        }), ",\n  };\n}\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "type"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title class_",
          children: "FrontMatter"
        }), " = {\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "id"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-built_in",
          children: "string"
        }), ";\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "title"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-built_in",
          children: "string"
        }), ";\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "description"
        }), "?: ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-built_in",
          children: "string"
        }), ";\n};\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "function"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "loadExampleFile"
        }), "(", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-params",
          children: [jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-attr",
            children: "path"
          }), ": ", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-built_in",
            children: "string"
          })]
        }), "): {\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "contents"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-built_in",
          children: "string"
        }), ";\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "data"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title class_",
          children: "FrontMatter"
        }), ";\n} {\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " contents = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "readFileSync"
        }), "(path, ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'utf-8'"
        }), ");\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " lines = contents.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "split"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'\\n'"
        }), ");\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " frontMatterLines = [];\n\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "let"
        }), " line = lines.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "shift"
        }), "();\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "if"
        }), " (line && line.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "startsWith"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'// ---'"
        }), ")) {\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "while"
        }), " (", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-literal",
          children: "true"
        }), ") {\n      line = lines.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "shift"
        }), "();\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "if"
        }), " (!line) {\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "throw"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "new"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title class_",
          children: "Error"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'Unexpected end of file'"
        }), ");\n      }\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "if"
        }), " (line.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "startsWith"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'// ---'"
        }), ")) {\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "break"
        }), ";\n      } ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "else"
        }), " {\n        frontMatterLines.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "push"
        }), "(line.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "replace"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-regexp",
          children: "/^\\/\\/\\s?/"
        }), ", ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "''"
        }), "));\n      }\n    }\n  } ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "else"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "if"
        }), " (line) {\n    lines.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "unshift"
        }), "(line);\n  }\n\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " yaml = frontMatterLines.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "join"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'\\n'"
        }), ");\n\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "return"
        }), " {\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "contents"
        }), ": lines.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "join"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'\\n'"
        }), "),\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "data"
        }), ": yaml ? ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "loadYaml"
        }), "(yaml) : {},\n  };\n}\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "function"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "formatExampleMd"
        }), "(", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-params",
          children: ["{\n  contents,\n  data,\n}: ", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-title class_",
            children: "ReturnType"
          }), "<", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-keyword",
            children: "typeof"
          }), " collectExamples>[", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-built_in",
            children: "number"
          }), "]"]
        }), "): ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-built_in",
          children: "string"
        }), " {\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " bodyLines = [", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "h1"
        }), "(data.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "title"
        }), ")];\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "if"
        }), " (data.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "description"
        }), ") {\n    bodyLines.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "push"
        }), "(data.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "description"
        }), ");\n  }\n  bodyLines.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "push"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "h2"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'Code'"
        }), "));\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "return"
        }), " ", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-string",
          children: ["`---\n", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${stringify(data)}"
          }), "hide_title: true\n---\n", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${lines(bodyLines)}"
          }), "\n\\`\\`\\`ts title=\"", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${data.title}"
          }), "\" showLineNumbers\n", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${contents}"
          }), "\n\\`\\`\\`\n  `"]
        }), ";\n}\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "function"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "formatIndexMd"
        }), "(", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-params",
          children: [jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-attr",
            children: "examples"
          }), ": ", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-title class_",
            children: "ReturnType"
          }), "<", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-keyword",
            children: "typeof"
          }), " collectExamples>"]
        }), "): ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-built_in",
          children: "string"
        }), " {\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "return"
        }), " ", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-string",
          children: ["`---\nid: examples\ntitle: Examples\n---\n", jsxRuntimeExports.jsxs(_components.span, {
            className: "hljs-subst",
            children: ["${h1(\n  ", jsxRuntimeExports.jsx(_components.span, {
              className: "hljs-string",
              children: "'Examples'"
            }), ",\n  ul(\n    examples.map((example) =>\n      link(", jsxRuntimeExports.jsxs(_components.span, {
              className: "hljs-string",
              children: ["`examples/", jsxRuntimeExports.jsx(_components.span, {
                className: "hljs-subst",
                children: "${example.data.id}"
              }), "`"]
            }), ", example.data?.title)\n    )\n  )\n)}"]
          }), "\n`"]
        }), ";\n}\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// returns all .ts files from given path"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "function"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "collectExamples"
        }), "(", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-params",
          children: [jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-attr",
            children: "root"
          }), ": ", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-built_in",
            children: "string"
          })]
        }), "): {\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "path"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-built_in",
          children: "string"
        }), ";\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "contents"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-built_in",
          children: "string"
        }), ";\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "data"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title class_",
          children: "FrontMatter"
        }), ";\n}[] {\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " files = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "readdirSync"
        }), "(root, { ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "withFileTypes"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-literal",
          children: "true"
        }), " });\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "collected"
        }), ": {\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "path"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-built_in",
          children: "string"
        }), ";\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "contents"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-built_in",
          children: "string"
        }), ";\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "data"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title class_",
          children: "FrontMatter"
        }), ";\n  }[] = [];\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "for"
        }), " (", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " file ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "of"
        }), " files) {\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "if"
        }), " (file.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "isDirectory"
        }), "()) {\n      collected.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "push"
        }), "(...", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "collectExamples"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "join"
        }), "(root, file.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "name"
        }), ")));\n    } ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "else"
        }), " {\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "if"
        }), " (file.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "name"
        }), ".", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "endsWith"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'.ts'"
        }), ")) {\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " path = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "join"
        }), "(root, file.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "name"
        }), ");\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " loaded = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "loadExampleFile"
        }), "(path);\n        collected.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "push"
        }), "(\n          ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "normalizeFrontMatter"
        }), "({\n            path,\n            ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "data"
        }), ": loaded.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "data"
        }), ",\n            ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "contents"
        }), ": loaded.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "contents"
        }), ",\n          })\n        );\n      }\n    }\n  }\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "return"
        }), " collected;\n}\n"]
      })
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "e2e-tests",
      children: ["E2E Tests", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#e2e-tests",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Running the E2E tests is a simple script, which works similarly to the docusaurus plugin. It starts by scanning the examples directory for typescript files. If you have written frontmatter that would influence the E2E test, the script would then need to read the file contents and parse out front matter. Then, using that data, it would run the files. A simple version that doesnt handle frontmatter could look like this:"
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-typescript",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "import"
        }), " { execSync, spawnSync } ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "from"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'child_process'"
        }), ";\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "import"
        }), " { readdirSync } ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "from"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'fs'"
        }), ";\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "import"
        }), " { workspaceRoot } ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "from"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'nx/src/devkit-exports'"
        }), ";\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "import"
        }), " { join, sep } ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "from"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'path'"
        }), ";\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// returns all .ts files from given path"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "function"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "collectExamples"
        }), "(", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-params",
          children: [jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-attr",
            children: "path"
          }), ": ", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-built_in",
            children: "string"
          })]
        }), "): ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-built_in",
          children: "string"
        }), "[] {\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " files = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "readdirSync"
        }), "(path, { ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "withFileTypes"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-literal",
          children: "true"
        }), " });\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "collected"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-built_in",
          children: "string"
        }), "[] = [];\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "for"
        }), " (", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " file ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "of"
        }), " files) {\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "if"
        }), " (file.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "isDirectory"
        }), "()) {\n      collected.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "push"
        }), "(...", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "collectExamples"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "join"
        }), "(path, file.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "name"
        }), ")));\n    } ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "else"
        }), " {\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "if"
        }), " (file.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "name"
        }), ".", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "endsWith"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'.ts'"
        }), ")) {\n        collected.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "push"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "join"
        }), "(path, file.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "name"
        }), "));\n      }\n    }\n  }\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "return"
        }), " collected;\n}\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " examples = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "collectExamples"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "join"
        }), "(__dirname, ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'../examples'"
        }), "));\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "let"
        }), " error = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-literal",
          children: "false"
        }), ";\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "for"
        }), " (", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " example ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "of"
        }), " examples) {\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " label = example.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "replace"
        }), "(", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-string",
          children: ["`", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${workspaceRoot}"
          }), jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${sep}"
          }), "`"]
        }), ", ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "''"
        }), ");\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "try"
        }), " {\n    process.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "stdout"
        }), ".", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "write"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'▶️ '"
        }), " + label);\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " a = performance.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "now"
        }), "();\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "spawnSync"
        }), "(process.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "execPath"
        }), ", [", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'--import=tsx'"
        }), ", example], {});\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " b = performance.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "now"
        }), "();\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// move cursor to the beginning of the line"
        }), "\n    process.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "stdout"
        }), ".", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "write"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'\\r'"
        }), ");\n\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable language_",
          children: "console"
        }), ".", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "log"
        }), "(\n      ", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-string",
          children: ["`✅ ", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${label}"
          }), " (", jsxRuntimeExports.jsxs(_components.span, {
            className: "hljs-subst",
            children: ["${", jsxRuntimeExports.jsx(_components.span, {
              className: "hljs-built_in",
              children: "Math"
            }), ".round((b - a) * ", jsxRuntimeExports.jsx(_components.span, {
              className: "hljs-number",
              children: "10"
            }), ") / ", jsxRuntimeExports.jsx(_components.span, {
              className: "hljs-number",
              children: "10"
            }), "}"]
          }), "ms)`"]
        }), ".", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "padEnd"
        }), "(\n        process.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "stdout"
        }), ".", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "columns"
        }), ",\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "' '"
        }), "\n      )\n    );\n  } ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "catch"
        }), " {\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// move cursor to the beginning of the line"
        }), "\n    process.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "stdout"
        }), ".", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "write"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'\\r'"
        }), ");\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable language_",
          children: "console"
        }), ".", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "log"
        }), "(", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-string",
          children: ["`❌ ", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${label}"
          }), "`"]
        }), ".", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "padEnd"
        }), "(process.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "stdout"
        }), ".", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "columns"
        }), ", ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "' '"
        }), "));\n    error = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-literal",
          children: "true"
        }), ";\n  }\n}\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "if"
        }), " (error) {\n  process.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "exit"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-number",
          children: "1"
        }), ");\n}\n"]
      })
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "references",
      children: ["References", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#references",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "https://github.com/AgentEnder/flexi-bench/blob/main/docs-site/src/plugins/examples-plugin.ts",
          rel: "noopener noreferrer",
          target: "_blank",
          children: "FlexiBench Docusaurus Plugin"
        })
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "https://github.com/AgentEnder/flexi-bench/blob/main/e2e/run-e2e.ts",
          rel: "noopener noreferrer",
          target: "_blank",
          children: "FlexiBench E2E Test Script"
        })
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "https://github.com/AgentEnder/flexi-bench/blob/main/examples/",
          rel: "noopener noreferrer",
          target: "_blank",
          children: "FlexiBench Example Files"
        })
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "https://github.com/AgentEnder/cli-forge/blob/main/docs-site/src/plugins/examples-plugin.ts",
          rel: "noopener noreferrer",
          target: "_blank",
          children: "CLI Forge Docusaurus Plugin"
        })
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "https://github.com/AgentEnder/cli-forge/blob/main/e2e/run-e2e.ts",
          rel: "noopener noreferrer",
          target: "_blank",
          children: "CLI Forge E2E Test Script"
        })
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "https://github.com/AgentEnder/cli-forge/blob/main/examples/",
          rel: "noopener noreferrer",
          target: "_blank",
          children: "CLI Forge Example Files"
        })
      }), "\n"]
    })]
  });
}
function MDXContent$b(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? jsxRuntimeExports.jsx(MDXLayout, {
    ...props,
    children: jsxRuntimeExports.jsx(_createMdxContent$b, {
      ...props
    })
  }) : _createMdxContent$b(props);
}
function _missingMdxReference$b(id, component) {
  throw new Error("Expected " + ("component" ) + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/multifunctional-example-files/post.ts [vike:pluginModuleBanner] */
const multifunctionExampleFiles = {
  mdx: MDXContent$b,
  publishDate: new Date(2024, 7, 23),
  slug: "multifunctional-example-files",
  title: "Multifunctional Example Files",
  description: `Keeping documentation and examples in sync and up-to-date is often a challenge when developing libraries or frameworks. In this, we explore how to get the most out of a single file that ensures your documentation and examples are always in sync.`,
  tags: ["technical", "tooling", "tutorial"]
};

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/nx-configuration-history/contents.mdx [vike:pluginModuleBanner] */
function _createMdxContent$a(props) {
  const _components = {
    a: "a",
    code: "code",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    li: "li",
    p: "p",
    pre: "pre",
    span: "span",
    strong: "strong",
    ul: "ul",
    ...props.components
  }, {Anchor} = _components;
  if (!Anchor) _missingMdxReference$a("Anchor");
  return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [jsxRuntimeExports.jsx(_components.h1, {
      id: "nx-from-angular-roots-to-crystal-future",
      children: "Nx: From Angular Roots to Crystal Future"
    }), "\n", jsxRuntimeExports.jsx(_components.h2, {
      id: "table-of-contents",
      children: "Table of Contents"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsxs(_components.li, {
        children: [jsxRuntimeExports.jsx(_components.a, {
          href: "#introduction",
          children: "Introduction"
        }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
          children: ["\n", jsxRuntimeExports.jsx(_components.li, {
            children: jsxRuntimeExports.jsx(_components.a, {
              href: "#the-quick-scoop-tldr",
              children: "The Quick Scoop (tldr)"
            })
          }), "\n", jsxRuntimeExports.jsx(_components.li, {
            children: jsxRuntimeExports.jsx(_components.a, {
              href: "#the-final-result",
              children: "The Final Result"
            })
          }), "\n"]
        }), "\n"]
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "#nxs-angular-beginnings",
          children: "Nx’s Angular Beginnings"
        })
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "#birth-of-the-nx-cli-evolution-beyond-angular",
          children: "Birth of the Nx CLI: Evolution Beyond Angular"
        })
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsxs(_components.a, {
          href: "#projectjson-and-splitting-workspacejson",
          children: [jsxRuntimeExports.jsx(_components.code, {
            children: "project.json"
          }), " and splitting ", jsxRuntimeExports.jsx(_components.code, {
            children: "workspace.json"
          })]
        })
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "#the-beginnings-of-inference",
          children: "The Beginnings of Inference"
        })
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "#enter-lerna",
          children: "Enter Lerna"
        })
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "#inference-api-v1-and-workspaces-support",
          children: "Inference API v1, and Workspaces Support"
        })
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "#elevating-workspaces-with-inference-api-v2",
          children: "Elevating Workspaces with Inference API v2"
        })
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "#entering-the-crystal-era-",
          children: "Entering the Crystal Era 💎"
        })
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "#conclusion",
          children: "Conclusion"
        })
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "#references-and-links",
          children: "References and Links"
        })
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "introduction",
      children: ["Introduction", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#introduction",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["Nx’s configuration has changed dramatically over the years, and it’s been a long journey to get to where we are today. I joined the Nx team in June 2021, right before we split up ", jsxRuntimeExports.jsx(_components.code, {
        children: "workspace.json"
      }), " into ", jsxRuntimeExports.jsx(_components.code, {
        children: "workspace.json"
      }), " and ", jsxRuntimeExports.jsx(_components.code, {
        children: "project.json"
      }), ". Since joining the team, I’ve had a pretty direct hand in many of these changes, and have worked closely on others."]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "There are a few misconceptions about Nx that stem from its configuration and history, and I’d like to clear some of those up."
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Nx is only for Angular"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Nx is hard to configure"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Nx has a lot of configuration."
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "the-quick-scoop-tldr",
      children: ["The Quick Scoop (tldr)", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-quick-scoop-tldr",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Nx was initially built as an Angular CLI extension. It has been its own CLI for several years, and has no direct ties to angular at this point."
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Nx’s configuration has went through several iterations, and mostly configures itself these days."
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "You shouldn’t have to worry when the configuration changes, as Nx will migrate your existing config for you."
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "the-final-result",
      children: ["The Final Result", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-final-result",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "After Nx 18, the Nx side of configuration for individual projects in a workspace can be as simple as this:"
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      filename: "apps/myapp/project.json",
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-json",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"name\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"myapp\""
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n"]
      })
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "The rest of the configuration that one may expect (targets to run as the most common example) can be inferred from configuration files present in the project’s root. This is a dramatic reduction from where we started, and hopefully makes Nx easier to adopt and learn."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "nxs-angular-beginnings",
      children: ["Nx’s Angular Beginnings", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#nxs-angular-beginnings",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Nx was initially built as an Angular CLI extension. It was a set of schematics and builders that extended the Angular CLI’s capabilities. This was a great way to get started, but it had some limitations. For example, it was difficult to add support for other frameworks, and it was difficult to add new commands to the CLI."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Angular CLI also supports monorepos, and in the beginning Nx used angular’s configuration. When you have multiple projects, the configuration would look something like this:"
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      filename: "angular.json",
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-json",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"version\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-number",
          children: "1"
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"projects\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"my-app\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"architect\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"build\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n          ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"builder\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"@angular-devkit/build-angular:browser\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n          ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"options\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n            ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"main\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"apps/my-app/src/main.ts\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n            ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"tsConfig\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"apps/my-app/tsconfig.app.json\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n            ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"assets\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "["
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"apps/my-app/src/favicon.ico\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"apps/my-app/src/assets\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "]"
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n            ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"styles\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "["
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"apps/my-app/src/styles.css\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "]"
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n            ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"scripts\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "["
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "]"
        }), "\n          ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n"]
      })
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["To help distinguish a plain Angular CLI project from an Nx workspace, and better support other tools, we added support for a ", jsxRuntimeExports.jsx(_components.code, {
        children: "workspace.json"
      }), " file. This file was identical to ", jsxRuntimeExports.jsx(_components.code, {
        children: "angular.json"
      }), "."]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["As Nx grew and added more features, we needed to add more configuration. We added a ", jsxRuntimeExports.jsx(_components.code, {
        children: "nx.json"
      }), " file to store this configuration. This file was used to store configuration for things that were specific to Nx, and that angular wouldn’t understand. For example, we added support for ", jsxRuntimeExports.jsx(_components.code, {
        children: "tags"
      }), " and ", jsxRuntimeExports.jsx(_components.code, {
        children: "implicitDependencies"
      }), " to help Nx understand the relationships between projects."]
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "birth-of-the-nx-cli-evolution-beyond-angular",
      children: ["Birth of the Nx CLI: Evolution Beyond Angular", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#birth-of-the-nx-cli-evolution-beyond-angular",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["After a bit, Nx grew apart from Angular CLI. It became a standalone tool that could be used with any framework. This meant that we needed to create our own configuration file. We created ", jsxRuntimeExports.jsx(_components.code, {
        children: "workspace.json"
      }), " to replace ", jsxRuntimeExports.jsx(_components.code, {
        children: "angular.json"
      }), ". The configuration was extraordinarily similar, but it was a different file and a few properties had a different name. The names changed to more closely match the names that Nx uses. For example, ", jsxRuntimeExports.jsx(_components.code, {
        children: "builder"
      }), " became ", jsxRuntimeExports.jsx(_components.code, {
        children: "executor"
      }), " and ", jsxRuntimeExports.jsx(_components.code, {
        children: "architect"
      }), " became ", jsxRuntimeExports.jsx(_components.code, {
        children: "targets"
      }), "."]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["These changes included some differences in ", jsxRuntimeExports.jsx(_components.code, {
        children: "nx.json"
      }), " as well. The ", jsxRuntimeExports.jsx(_components.code, {
        children: "schematics"
      }), " property was renamed as ", jsxRuntimeExports.jsx(_components.code, {
        children: "generators"
      }), "."]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "At this point, the files looked like this:"
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      filename: "workspace.json",
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-json",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"version\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-number",
          children: "2"
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"projects\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"my-app\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"targets\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"build\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n          ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"executor\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"@nrwl/web:build\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n          ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"options\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n            ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"main\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"apps/my-app/src/main.ts\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n            ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"tsConfig\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"apps/my-app/tsconfig.app.json\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n            ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"assets\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "["
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"apps/my-app/src/favicon.ico\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"apps/my-app/src/assets\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "]"
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n            ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"styles\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "["
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"apps/my-app/src/styles.css\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "]"
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n            ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"scripts\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "["
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "]"
        }), "\n          ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n"]
      })
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      filename: "nx.json",
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-json",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"projects\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"my-app\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"tags\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "["
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "]"
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"generators\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"@nrwl/angular:component\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"style\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"scss\""
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n"]
      })
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["Additionally, nx added the capability to run dependant targets before a target. This was initially done by adding a ", jsxRuntimeExports.jsx(_components.code, {
        children: "targetDependencies"
      }), " section within ", jsxRuntimeExports.jsx(_components.code, {
        children: "nx.json"
      }), ". The property was scoped to all targets with a given name, and looked like this:"]
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      filename: "nx.json",
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-json",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"targetDependencies\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"build\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "["
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"target\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"build-base\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"projects\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"self\""
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "]"
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"build-base\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "["
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"target\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"build-base\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"projects\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"dependencies\""
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "]"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n"]
      })
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["The above configuration would run the ", jsxRuntimeExports.jsx(_components.code, {
        children: "build-base"
      }), " target for all projects before running the ", jsxRuntimeExports.jsx(_components.code, {
        children: "build"
      }), " target of that same project. This was a powerful feature, but it wasn’t as general as we had hoped and needed a bit more flexibility."]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["Soon after, we renamed ", jsxRuntimeExports.jsx(_components.code, {
        children: "targetDependencies"
      }), " to ", jsxRuntimeExports.jsx(_components.code, {
        children: "targetDefaults"
      }), " + ", jsxRuntimeExports.jsx(_components.code, {
        children: "dependsOn"
      }), " and allowed specifying it on a per-project basis. This allowed us to specify different defaults for different projects. The configuration looked like this:"]
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      filename: "nx.json",
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-json",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"targetDefaults\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"build\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"dependsOn\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "["
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n          ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"target\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"build-base\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n          ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"projects\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"self\""
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "]"
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n"]
      })
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      filename: "workspace.json",
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-json",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"projects\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"my-app\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"targets\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"build\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n          ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"executor\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"@nrwl/web:build\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n          ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"options\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n            ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"main\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"apps/my-app/src/main.ts\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n            ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"tsConfig\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"apps/my-app/tsconfig.app.json\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n            ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"assets\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "["
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"apps/my-app/src/favicon.ico\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"apps/my-app/src/assets\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "]"
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n            ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"styles\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "["
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"apps/my-app/src/styles.css\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "]"
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n            ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"scripts\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "["
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "]"
        }), "\n          ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n          ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"dependsOn\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "["
        }), "\n            ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n              ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"target\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"build-base\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n              ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"projects\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"self\""
        }), "\n            ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n          ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "]"
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n"]
      })
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "projectjson-and-splitting-workspacejson",
      children: [jsxRuntimeExports.jsx(_components.code, {
        children: "project.json"
      }), " and splitting ", jsxRuntimeExports.jsx(_components.code, {
        children: "workspace.json"
      }), jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#projectjson-and-splitting-workspacejson",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["Nx is a monorepo focused tool. It’s designed to work with many projects in a single repository. As such, the ", jsxRuntimeExports.jsx(_components.code, {
        children: "workspace.json"
      }), " file can get quite large. Every time a new project is added, an existing project is modified, or an older project is removed, the ", jsxRuntimeExports.jsx(_components.code, {
        children: "workspace.json"
      }), " file needs to be updated. This can lead to merge conflicts and other issues."]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["When working with customers with over 200 projects, this was no longer scalable. We needed to split the ", jsxRuntimeExports.jsx(_components.code, {
        children: "workspace.json"
      }), " file into multiple files. We also needed to make it easier to add new projects and modify existing projects."]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["We decided that ", jsxRuntimeExports.jsx(_components.code, {
        children: "workspace.json"
      }), " would contain a map of project name to file path. This would allow us to split the configuration into multiple files. At the same time, it was important to maintain compatibility with Angular CLI schematics and builders. We wanted to do this without having to keep a copy of the Angular CLI configuration in sync with the Nx configuration."]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "As such, we created a translation layer that would handle reading and writing the configuration when angular asked for it. Doing this unlocked a ton of flexibility on our side to make changes to the configuration without breaking compatibility with Angular CLI."
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["Additionally, we took some time to reevaluate where existing configuration options lived. Since we now have a configuration file per project it made less sense to place ", jsxRuntimeExports.jsx(_components.code, {
        children: "tags"
      }), " and ", jsxRuntimeExports.jsx(_components.code, {
        children: "implicitDependencies"
      }), " in ", jsxRuntimeExports.jsx(_components.code, {
        children: "nx.json"
      }), ". We moved these properties to ", jsxRuntimeExports.jsx(_components.code, {
        children: "project.json"
      }), " as well."]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "The end result of this round of changes resulted in:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsxs(_components.li, {
        children: [jsxRuntimeExports.jsx(_components.code, {
          children: "workspace.json"
        }), " containing a map of project name to file path"]
      }), "\n", jsxRuntimeExports.jsxs(_components.li, {
        children: [jsxRuntimeExports.jsx(_components.code, {
          children: "project.json"
        }), " containing all of the configuration for a single project"]
      }), "\n", jsxRuntimeExports.jsxs(_components.li, {
        children: [jsxRuntimeExports.jsx(_components.code, {
          children: "nx.json"
        }), " containing configuration that is global to the workspace"]
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "This was a much cleaner and more scalable way to manage configuration. It meant less merge conflicts, but also made it easier to tell what projects may have been affected by a change."
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      filename: "workspace.json",
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-json",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"version\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-number",
          children: "2"
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"projects\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"myapp\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"apps/myapp\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"mylib\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"libs/mylib\""
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n"]
      })
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      filename: "apps/myapp/project.json",
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-json",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"targets\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"build\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"executor\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"@nrwl/web:build\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"options\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"main\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"apps/myapp/src/main.ts\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"tsConfig\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"apps/myapp/tsconfig.app.json\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"assets\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "["
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"apps/myapp/src/favicon.ico\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"apps/myapp/src/assets\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "]"
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"styles\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "["
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"apps/myapp/src/styles.css\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "]"
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"scripts\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "["
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "]"
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n"]
      })
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      filename: "nx.json",
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-json",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"targetDefaults\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"build\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"dependsOn\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "["
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n          ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"target\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"build-base\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n          ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"projects\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"self\""
        }), "\n        ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "]"
        }), "\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n"]
      })
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "the-beginnings-of-inference",
      children: ["The Beginnings of Inference", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-beginnings-of-inference",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["After the last round of changes, we noticed that the ", jsxRuntimeExports.jsx(_components.code, {
        children: "workspace.json"
      }), " file was not particularly useful. It was just a map of project name to file path. We decided that it should be optional, and in time we dropped support for it entirely."]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "This change required Nx to be able to locate the configuration of projects without a central file. Adding this support was not a major task, but while doing so we also decided to open up the possibility of dynamically building configuration."
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["At the same time, there was a push from non-angular users to simplify the configuration. Npm/yarn/pnpm workspaces had gained a bit of popularity and it was much easier to define targets as a ", jsxRuntimeExports.jsx(_components.code, {
        children: "package.json"
      }), " script for a segment of users. We wanted to make it easier for these users to use Nx, while also helping Nx make sense when compared to other tools. The decision was made that if there was a package.json file inside a project, Nx would be able to run its scripts as a target."]
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "enter-lerna",
      children: ["Enter Lerna", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#enter-lerna",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Lerna has been around a long time, and maintains a good amount of popularity within the JavaScript community. It’s a tool that helps manage multiple packages in a single repository. It’s a bit different from Nx, but it’s similar enough that we were already looking at making it easier to use the two together. Lerna had some functionality that Nx didn’t (publishing packages), and Nx had some functionality that Lerna didn’t (caching and code generation)."
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["Around this time, several things surrounding lerna started to become worrisome. There was an ", jsxRuntimeExports.jsx(_components.a, {
        href: "https://github.com/lerna/lerna/issues/2703",
        rel: "noopener noreferrer",
        target: "_blank",
        children: "issue"
      }), " filed stating that lerna had been unmaintained. A ", jsxRuntimeExports.jsx(_components.a, {
        href: "https://github.com/lerna/lerna/pull/3092",
        rel: "noopener noreferrer",
        target: "_blank",
        children: "PR"
      }), " had been merged adding a warning that lerna wasn’t being actively maintained, and that the community should consider using other tools."]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["These users would need to go somewhere, but any change for them would not be without difficulty. Nrwl, the company behind Nx, decided to step in and offer a solution. After talking with the maintainer, we were able to take over stewardship and step in to maintain the project. This was announced in a blog post here: ", jsxRuntimeExports.jsx(_components.a, {
        href: "https://blog.nrwl.io/lerna-is-dead-long-live-lerna-61259f97dbd9",
        rel: "noopener noreferrer",
        target: "_blank",
        children: "Lerna is dead, Long live Lerna"
      }), "."]
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "inference-api-v1-and-workspaces-support",
      children: ["Inference API v1, and Workspaces Support", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#inference-api-v1-and-workspaces-support",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "With Lerna under our purview we wanted to be able to unify the two tools. Nx should be able to work in a lerna workspace, and hopefully the portions of Lerna that Nx could already handle would then be able to invoke Nx under the hood. This would prevent us from having to maintain two copies of the same functionality, and we were optimistic we could do this without breaking any existing workflows."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "The first step of this process was to ensure that Nx could work in a Lerna repository without changing the existing structure. This meant a few things:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsxs(_components.li, {
        children: [jsxRuntimeExports.jsx(_components.code, {
          children: "workspace.json"
        }), " had to be optional"]
      }), "\n", jsxRuntimeExports.jsxs(_components.li, {
        children: [jsxRuntimeExports.jsx(_components.code, {
          children: "project.json"
        }), " had to be optional"]
      }), "\n", jsxRuntimeExports.jsxs(_components.li, {
        children: [jsxRuntimeExports.jsx(_components.code, {
          children: "nx.json"
        }), " had to be optional"]
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "If any of these 3 files had been required, it would have caught lerna users off guard and look like Nx was replacing lerna."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "This built upon our existing inference capabilities, and while opening them up further we decided to publish a version that plugin authors could take advantage of."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "The first version of these inference APIs never left experimental, and weren’t actually used internally. Rather, they acted almost as a proof of concept and allowed us to see what the API might look like. Essentially, we needed an API that would be able to turn a project’s configuration file into its actual configuration. The API looked something like this:"
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-typescript",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "import"
        }), " { ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title class_",
          children: "NxPlugin"
        }), " } ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "from"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'@nx/devkit'"
        }), ";\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "plugin"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title class_",
          children: "NxPlugin"
        }), " = {\n  projectFilePatterns = [", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'project.json'"
        }), "],\n  registerProjectTargets = ", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-function",
          children: ["(", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-params",
            children: "projectFile"
          }), ") =>"]
        }), " {\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// ..."
        }), "\n  },\n};\n"]
      })
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["In this example, ", jsxRuntimeExports.jsx(_components.code, {
        children: "projectFilePatterns"
      }), " is an array of file patterns that the plugin can handle. When Nx is looking for a project’s configuration, it will look for a file that matches one of these patterns. If it finds one, it will pass it to ", jsxRuntimeExports.jsx(_components.code, {
        children: "registerProjectTargets"
      }), " and expect it to return the targets a given project can run."]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["While we didn’t directly use this API, it was a very small inclusion in the core code to enable Nx running inside a repository that was only configured by ", jsxRuntimeExports.jsx(_components.code, {
        children: "package.json"
      }), " files. The published API was also used to show how Nx could one day be used in C# or Java repositories, without introducing new configuration files."]
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "elevating-workspaces-with-inference-api-v2",
      children: ["Elevating Workspaces with Inference API v2", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#elevating-workspaces-with-inference-api-v2",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["We were mostly happy with the inference apis and configuration loading, but there were a few things that we wanted to clean up within Nx’s codebase and the API itself. In particular we wanted to be able to streamline our handling of ", jsxRuntimeExports.jsx(_components.code, {
        children: "angular.json"
      }), " for legacy users, and wanted to migrate the ", jsxRuntimeExports.jsx(_components.code, {
        children: "project.json"
      }), " and ", jsxRuntimeExports.jsx(_components.code, {
        children: "package.json"
      }), " configuration loading into the same API."]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "In order to do this, we needed an API that:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Could provide a full project configuration, not just the targets"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Could read multiple projects from a single file (angular.json supports this)"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Additionally, there were other plugin APIs to extend the project graph that were a bit confusing when deciding if a plugin should be an inference plugin or a project graph plugin. Project graph plugins exported a single function, that received the current project graph and returned a new one. As part of this, they could add new nodes and edges to the graph. Most nodes on the graph were projects, but adding a project via these APIs resulted in odd behavior as targets couldn’t be ran because they weren’t present when Nx initially loaded project configurations."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "As such, we decided to merge the two APIs into a single one. This API is responsible for creating nodes on the project graph, and creating edges between those nodes. The API looks something like this:"
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-typescript",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "import"
        }), " { ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title class_",
          children: "NxPlugin"
        }), " } ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "from"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'@nx/devkit'"
        }), ";\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "plugin"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title class_",
          children: "NxPlugin"
        }), " = {\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "createNodes"
        }), ": [", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'**/*.csproj'"
        }), ", ", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-function",
          children: ["(", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-params",
            children: "projectFile, ctx"
          }), ") =>"]
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "readProjectsFromFile"
        }), "(projectFile)]\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "createDependencies"
        }), ": ", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-function",
          children: ["(", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-params",
            children: "ctx"
          }), ") =>"]
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "readEdgesFromContext"
        }), "(ctx)\n};\n"]
      })
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: [jsxRuntimeExports.jsx(_components.code, {
        children: "CreateNodes"
      }), " is a tuple, where the first element is a glob pattern that the plugin can handle, and the second element is a function that will read the file and return the projects it contains. ", jsxRuntimeExports.jsx(_components.code, {
        children: "createDependencies"
      }), " is a function that will be called after all of the nodes have been created, and is responsible for creating the edges between the nodes."]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["This API met all of the requirements we set out on, and ensured there was only one spot for plugin authors to add new nodes to the graph. It released as part of Nx 17, and was talked about at that years ", jsxRuntimeExports.jsx(_components.a, {
        href: "https://www.youtube.com/watch?v=bnjOu7iOrMg",
        rel: "noopener noreferrer",
        target: "_blank",
        children: "Nx Conf"
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "entering-the-crystal-era-",
      children: ["Entering the Crystal Era 💎", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#entering-the-crystal-era-",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "A large goal that the Nx team has consistently worked on is making Nx easier to adopt. Configuration changes are a large part of this, but we also took some time to reflect on how we integrate with other tools."
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["Traditionally, Nx would provide an executor that wrapped a tool like ", jsxRuntimeExports.jsx(_components.code, {
        children: "jest"
      }), ". When running test, Nx would invoke the executor which would then invoke ", jsxRuntimeExports.jsx(_components.code, {
        children: "jest"
      }), ". This was a bit of a pain point for users, as they would have to learn how to use Nx’s executors and any of the idiosyncrasies that came with them. Additionally, it made it harder to get help when things went wrong, as the error messages would be different than what the user would see when running ", jsxRuntimeExports.jsx(_components.code, {
        children: "jest"
      }), " directly. Users would frequently ask questions that would be better solved by Jest’s documentation, but they wouldn’t know that because they were using Nx’s executors."]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["Nx had been able to run arbitrary scripts in ", jsxRuntimeExports.jsx(_components.code, {
        children: "package.json"
      }), " files or arbitrary commands specified in ", jsxRuntimeExports.jsx(_components.code, {
        children: "project.json"
      }), " for a while, but it was not the default. We didn’t encourage using ", jsxRuntimeExports.jsx(_components.code, {
        children: "run-commands"
      }), " for everything, as there were some problems when using it:"]
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Terminal output was not as nice as it could be"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Tools may need some extra configuration to work properly"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Keeping the configuration in sync with the rest of the workspace was difficult"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Making the terminal output nicer was a bit of a heavy lift, but we were able to make it work. Adding support for running commands inside a pseudo-terminal allowed us to capture output as it would look on the dev’s machine, rather than the older output style that mimicked what you would see in a CI environment. Additionally, this meant that interactive commands could work how a dev would expect."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "For the second point, we decided to shift how we wrote our first party plugins. Instead of writing an executor that wrapped a tool, we can write plugins for many of the tools themselves to implement the same functionality. This would allow us to take advantage of the tool’s configuration, and would allow us to provide a better experience for users, while being a bit more transparent about our changes."
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["The inference APIs we had just added were a perfect fit for keeping the configuration in sync. If we infer that every project with a jest configuration should have a ", jsxRuntimeExports.jsx(_components.code, {
        children: "test"
      }), " target, we can add that target to the project’s configuration. This would allow us to keep the configuration in sync with the rest of the workspace, and would allow us to provide a better experience for users."]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["With these 3 pain points addressed, we made the major decision to step away from using executors for most of our first party plugins and infer targets from configuration files where possible. As far as configuration is concerned, nothing ", jsxRuntimeExports.jsx(_components.strong, {
        children: "really"
      }), " changed but things did look a bit different to users. Mainly, the ", jsxRuntimeExports.jsx(_components.code, {
        children: "targets"
      }), " section of ", jsxRuntimeExports.jsx(_components.code, {
        children: "project.json"
      }), " was no longer required to run a target."]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["Many ", jsxRuntimeExports.jsx(_components.code, {
        children: "project.json"
      }), " files can now be as simple as this:"]
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      filename: "apps/myapp/project.json",
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-json",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "{"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"name\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"myapp\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ","
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "\"tags\""
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: ":"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "["
        }), jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "]"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-punctuation",
          children: "}"
        }), "\n"]
      })
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Internally, we referred to this change as project configuration v3. It represents a major shift in how we think about configuration, and how we think about integrating with other tools. As such, we released it as Nx 18: Project Crystal 💎."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "There are some published resources that go into more detail about this change:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "https://www.youtube.com/watch?v=wADNsVItnsM",
          rel: "noopener noreferrer",
          target: "_blank",
          children: "Nx Project Crystal 💎"
        })
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "https://nx.dev/concepts/inferred-tasks#inferred-tasks-project-crystal",
          rel: "noopener noreferrer",
          target: "_blank",
          children: "Inferred Tasks documentation"
        })
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "conclusion",
      children: ["Conclusion", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#conclusion",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Nx’s configuration has changed a lot over the years, and it’s been a long journey to get to where we are today. We’ve made a lot of changes to make Nx easier to adopt, and we’ve made a lot of changes to make Nx easier to use."
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["Project Crystal helped slim down the Nx configuration within a workspace to only ", jsxRuntimeExports.jsx(_components.code, {
        children: "nx.json"
      }), " for many repos, and opens the doors for Nx to be used in a wider variety of repositories. We’re excited to see what the future holds for Nx, and as always, stay tuned 📺."]
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "references-and-links",
      children: ["References and Links", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#references-and-links",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "https://www.youtube.com/watch?v=wADNsVItnsM",
          rel: "noopener noreferrer",
          target: "_blank",
          children: "Nx Project Crystal 💎"
        })
      }), "\n"]
    })]
  });
}
function MDXContent$a(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? jsxRuntimeExports.jsx(MDXLayout, {
    ...props,
    children: jsxRuntimeExports.jsx(_createMdxContent$a, {
      ...props
    })
  }) : _createMdxContent$a(props);
}
function _missingMdxReference$a(id, component) {
  throw new Error("Expected " + ("component" ) + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/nx-configuration-history/post.ts [vike:pluginModuleBanner] */
const nxConfigurationHistory = {
  mdx: MDXContent$a,
  publishDate: new Date(2024, 1, 5),
  slug: "nx-configuration-history",
  title: "Nx Configuration History",
  description: `Nx's configuration has changed dramatically over the years, and it's been a long journey to get to where we are today. I joined the Nx team in June 2021, right before we split up \`workspace.json\` into \`workspace.json\` and \`project.json\`. Since joining the team, I've had a pretty direct hand in many of these changes, and have worked closely on others.`,
  tags: ["technical", "nx", "tooling", "javascript", "typescript"]
};

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/superpowered-git-aliases/contents.mdx [vike:pluginModuleBanner] */
function _createMdxContent$9(props) {
  const _components = {
    a: "a",
    code: "code",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    li: "li",
    p: "p",
    pre: "pre",
    span: "span",
    strong: "strong",
    ul: "ul",
    ...props.components
  }, {Anchor} = _components;
  if (!Anchor) _missingMdxReference$9("Anchor");
  return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [jsxRuntimeExports.jsx(_components.h1, {
      id: "superpowered-git-aliases-using-scripting",
      children: "Superpowered Git Aliases using Scripting"
    }), "\n", jsxRuntimeExports.jsx(_components.h2, {
      id: "table-of-contents",
      children: "Table of Contents"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsxs(_components.li, {
        children: [jsxRuntimeExports.jsx(_components.a, {
          href: "#what-are-git-aliases",
          children: "What are Git Aliases"
        }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
          children: ["\n", jsxRuntimeExports.jsx(_components.li, {
            children: jsxRuntimeExports.jsx(_components.a, {
              href: "#simple-aliases",
              children: "Simple Aliases"
            })
          }), "\n", jsxRuntimeExports.jsx(_components.li, {
            children: jsxRuntimeExports.jsx(_components.a, {
              href: "#more-complex-aliases",
              children: "More Complex Aliases"
            })
          }), "\n"]
        }), "\n"]
      }), "\n", jsxRuntimeExports.jsxs(_components.li, {
        children: [jsxRuntimeExports.jsx(_components.a, {
          href: "#setting-up-aliases-with-scripts",
          children: "Setting up Aliases with Scripts"
        }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
          children: ["\n", jsxRuntimeExports.jsx(_components.li, {
            children: jsxRuntimeExports.jsx(_components.a, {
              href: "#case-study-rebase-main--master",
              children: "Case Study: Rebase Main / master"
            })
          }), "\n", jsxRuntimeExports.jsx(_components.li, {
            children: jsxRuntimeExports.jsx(_components.a, {
              href: "#case-study-amend",
              children: "Case Study: Amend"
            })
          }), "\n", jsxRuntimeExports.jsx(_components.li, {
            children: jsxRuntimeExports.jsx(_components.a, {
              href: "#some-caveats",
              children: "Some Caveats"
            })
          }), "\n"]
        }), "\n"]
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: jsxRuntimeExports.jsx(_components.a, {
          href: "#conclusion",
          children: "Conclusion"
        })
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "what-are-git-aliases",
      children: ["What are Git Aliases", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#what-are-git-aliases",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Git aliases work similarly to regular aliases in the shell, but they are specific to Git commands. They allow you to create shortcuts for longer commands or to create new commands that are not available by default."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Aliases run in the same shell environment as other git commands, and are mostly used to simplify common workflows."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "simple-aliases",
      children: ["Simple Aliases", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#simple-aliases",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["Simple aliases call a single Git command with a set of arguments. For example, you can create an alias to show the status of the repository by running ", jsxRuntimeExports.jsx(_components.code, {
        children: "git status"
      }), " with the ", jsxRuntimeExports.jsx(_components.code, {
        children: "s"
      }), " alias:"]
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      filename: "~/.gitconfig",
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-INI",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-section",
          children: "[alias]"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "s"
        }), " = status\n"]
      })
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["You can then run ", jsxRuntimeExports.jsx(_components.code, {
        children: "git s"
      }), " to show the status of the repository. Because we configured the alias in ~/.gitconfig, it is available for all repositories on the system."]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "more-complex-aliases",
      children: ["More Complex Aliases", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#more-complex-aliases",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["You can also create git aliases that run an arbitrary shell command. To do so, the alias needs to start with a ", jsxRuntimeExports.jsx(_components.code, {
        children: "!"
      }), ". This tells git to execute the alias as if it was not a git subcommand. For example, if you wanted to run two git commands in sequence, you could create an alias that runs a shell command:"]
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      filename: "~/.gitconfig",
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-INI",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-section",
          children: "[alias]"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "my-alias"
        }), " = !git fetch && git rebase origin/master\n"]
      })
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["This alias runs ", jsxRuntimeExports.jsx(_components.code, {
        children: "git fetch"
      }), " and ", jsxRuntimeExports.jsx(_components.code, {
        children: "git rebase origin/main"
      }), " in sequence when you run ", jsxRuntimeExports.jsx(_components.code, {
        children: "git my-alias"
      }), "."]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "One limitation of git aliases is that they cannot be set to a multiline value. This means that for more complex aliases you will need to minify them."
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["Additionally, in an INI file a ", jsxRuntimeExports.jsx(_components.code, {
        children: ";"
      }), " character is used to comment out the rest of the line. This means that you cannot use ", jsxRuntimeExports.jsx(_components.code, {
        children: ";"
      }), " in your alias commands."]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["These two limitations can make it difficult to create more complex aliases using the standard git alias syntax, but it can still be done. For example, an alias using ", jsxRuntimeExports.jsx(_components.code, {
        children: "if"
      }), " to branch may look like this:"]
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      filename: "~/.gitconfig",
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-INI",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-section",
          children: "[alias]"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "branch-if"
        }), " = !bash -c ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"'!f() { if [ -z \\\"$1\\\" ]; then echo \\\"Usage: git branch-if <branch-name>\\\"; else git checkout -b $1; fi; }; f'\""
        }), "\n"]
      })
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "These limits make it way more complex to create and maintain aliases that have any form of control flow within them. This is where scripting comes in."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "setting-up-aliases-with-scripts",
      children: ["Setting up Aliases with Scripts", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#setting-up-aliases-with-scripts",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "You can script a gitalias using any programming language you’d like. If you are familiar with bash scripting and would like to use it, you can create a bash script that runs the desired git commands. The truth is that I am much stronger with JavaScript, so that is what I will use."
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["One other major benefit is that by using a scripting language, your aliases can take and operate on arguments ", jsxRuntimeExports.jsx(_components.strong, {
        children: "much"
      }), " more easily. Git will forward any arguments you pass on the CLI to your alias by appending them to the end of your command. As such, your script should be able to read them without issue. For example, in Node JS you can access the arguments passed to the script directly on ", jsxRuntimeExports.jsx(_components.code, {
        children: "process.argv"
      }), "."]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "The basic steps to set this up do not change based on the language choosen. You’ll need to:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Create a script that runs the desired git commands"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Write an alias that runs the script"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "case-study-rebase-main--master",
      children: ["Case Study: Rebase Main / master", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#case-study-rebase-main--master",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["In recent years the default branch name for new repositories has changed from ", jsxRuntimeExports.jsx(_components.code, {
        children: "master"
      }), " to ", jsxRuntimeExports.jsx(_components.code, {
        children: "main"
      }), ". This means that when you clone a new repository, the default branch may be ", jsxRuntimeExports.jsx(_components.code, {
        children: "main"
      }), " instead of ", jsxRuntimeExports.jsx(_components.code, {
        children: "master"
      }), ". There is no longer a super consistent name, as the ecosystem is in transition. This is overall a good thing, but it means that our alias above to rebase will not work in all cases."]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["We need to update our alias to check if the branch is ", jsxRuntimeExports.jsx(_components.code, {
        children: "main"
      }), " or ", jsxRuntimeExports.jsx(_components.code, {
        children: "master"
      }), " and then rebase the correct branch. This is a perfect use case for a script."]
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      filename: "~/gitaliases/git-rebase-main.js",
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-javascript",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-meta",
          children: "#!/usr/bin/env node"
        }), "\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " { execSync } = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-built_in",
          children: "require"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'child_process'"
        }), ");\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// We want to run some commands and not immediately fail if they fail"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "function"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "tryExec"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-params",
          children: "command"
        }), ") {\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "try"
        }), " {\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "return"
        }), " {\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "status"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-number",
          children: "0"
        }), "\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "stdout"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "execSync"
        }), "(command);\n    }\n  } ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "catch"
        }), " (error) {\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "return"
        }), " {\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "status"
        }), ": error.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "status"
        }), ",\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "stdout"
        }), ": error.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "stdout"
        }), ",\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "stderr"
        }), ": error.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "stderr"
        }), ",\n    }\n  }\n}\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "function"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "getOriginRemoteName"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-params"
        }), ") {\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " { stdout, code } = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "tryExec"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"git remote\""
        }), ", ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-literal",
          children: "true"
        }), ");\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "if"
        }), " (code !== ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-number",
          children: "0"
        }), ") {\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "throw"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "new"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title class_",
          children: "Error"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"Failed to get remote name. \\n\""
        }), " + stdout);\n  }\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// If there is an upstream remote, use that, otherwise use origin"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "return"
        }), " stdout.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "includes"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"upstream\""
        }), ") ? ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"upstream\""
        }), " : ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"origin\""
        }), ";\n}\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// --verify returns code 0 if the branch exists, 1 if it does not"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " hasMain = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "tryExec"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'git show-ref --verify refs/heads/main'"
        }), ").", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "status"
        }), " === ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-number",
          children: "0"
        }), ";\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// If main is present, we want to rebase main, otherwise rebase master"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " branch = hasMain ? ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'main'"
        }), " : ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'master'"
        }), ";\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " remote = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "getOriginRemoteName"
        }), "()\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// Updates the local branch with the latest changes from the remote"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "execSync"
        }), "(", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-string",
          children: ["`git fetch ", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${remote}"
          }), " ", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${branch}"
          }), "`"]
        }), ", {", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "stdio"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'inherit'"
        }), "});\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// Rebases the current branch on top of the remote branch"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "execSync"
        }), "(", jsxRuntimeExports.jsxs(_components.span, {
          className: "hljs-string",
          children: ["`git rebase ", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${remote}"
          }), "/", jsxRuntimeExports.jsx(_components.span, {
            className: "hljs-subst",
            children: "${branch}"
          }), "`"]
        }), ", {", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "stdio"
        }), ": ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'inherit'"
        }), "});\n"]
      })
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["Currently, to run the script we’d need to run ", jsxRuntimeExports.jsx(_components.code, {
        children: "node ~/gitaliases/git-rebase-main.js"
      }), ". This is not ideal, and isn’t something you’d ever get in the habit of doing. We can make this easier by creating a git alias that runs the script."]
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      filename: "~/.gitconfig",
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-INI",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-section",
          children: "[alias]"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "rebase-main"
        }), " = !node ~/gitaliases/git-rebase-main.js\n"]
      })
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["Now you can run ", jsxRuntimeExports.jsx(_components.code, {
        children: "git rebase-main"
      }), " to rebase the correct branch, regardless of if it is ", jsxRuntimeExports.jsx(_components.code, {
        children: "main"
      }), " or ", jsxRuntimeExports.jsx(_components.code, {
        children: "master"
      }), "."]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "case-study-amend",
      children: ["Case Study: Amend", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#case-study-amend",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Another alias that I set up on all my machines is to amend the last commit. This is a super common workflow for me, and I like to have it as a single command. This is a great use case for a script, as it is a simple command that I want to run often."
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      filename: "~/gitaliases/git-amend.js",
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-javascript",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-meta",
          children: "#!/usr/bin/env node"
        }), "\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-comment",
          children: "// Usage: git amend [undo]"
        }), "\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " tryExec = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-built_in",
          children: "require"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'./utils/try-exec'"
        }), ");\n\n", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "async"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "function"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "getBranchesPointingAtHead"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-params"
        }), ") {\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " { stdout, code } = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "await"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "tryExec"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'git branch --points-at HEAD'"
        }), ", ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-literal",
          children: "true"
        }), ");\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "if"
        }), " (code !== ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-number",
          children: "0"
        }), ") {\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "throw"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "new"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title class_",
          children: "Error"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'Failed to get branches pointing at HEAD. \\n'"
        }), " + stdout);\n  }\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "return"
        }), " stdout.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "split"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'\\n'"
        }), ").", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "filter"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title class_",
          children: "Boolean"
        }), ");\n}\n\n(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "async"
        }), " () => {\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "const"
        }), " branches = ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "await"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "getBranchesPointingAtHead"
        }), "();\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "if"
        }), " (branches.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "length"
        }), " !== ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-number",
          children: "1"
        }), ") {\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-variable language_",
          children: "console"
        }), ".", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "log"
        }), "(\n      ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'Current commit is relied on by other branches, avoid amending it.'"
        }), "\n    );\n    process.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "exit"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-number",
          children: "1"
        }), ");\n  }\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "if"
        }), " (process.", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-property",
          children: "argv"
        }), "[", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-number",
          children: "2"
        }), "] === ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'undo'"
        }), ") {\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "await"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "tryExec"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'git reset --soft HEAD@{1}'"
        }), ");\n  } ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "else"
        }), " {\n    ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-keyword",
          children: "await"
        }), " ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-title function_",
          children: "tryExec"
        }), "(", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "'git commit --amend --no-edit'"
        }), ");\n  }\n})();\n"]
      })
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "This script is a bit more complex than the last one, as it has some control flow in it. It will check if the current commit is relied on by other branches, and if it is it will exit with an error. This is to prevent you from amending a commit that is relied on by other branches, as doing so would cause issues when trying to merge whichever branch relies on the commit."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "To set up the alias, you can use the same method as before:"
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      filename: "~/.gitconfig",
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-INI",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-section",
          children: "[alias]"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "amend"
        }), " = !node ~/gitaliases/git-amend.js\n"]
      })
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["Now you can run ", jsxRuntimeExports.jsx(_components.code, {
        children: "git amend"
      }), " to amend the last commit, or ", jsxRuntimeExports.jsx(_components.code, {
        children: "git amend undo"
      }), " to undo the last amend. This is a script that I initially wrote inline in my gitconfig, but as it grew in complexity I moved it to a script file. This is a great way to manage complexity in your aliases. For comparison, here is the original alias:"]
    }), "\n", jsxRuntimeExports.jsx(_components.pre, {
      filename: "~/.gitconfig",
      children: jsxRuntimeExports.jsxs(_components.code, {
        className: "hljs language-INI",
        children: [jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-section",
          children: "[alias]"
        }), "\n  ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-attr",
          children: "amend"
        }), " = !bash -c ", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\"'f() { if [ $(git branch --points-at HEAD | wc -l) != 1 ]; then echo Current commit is relied on by other branches, avoid amending it.; exit 1; fi; if [ \\\"$0\\\" = \""
        }), "undo", jsxRuntimeExports.jsx(_components.span, {
          className: "hljs-string",
          children: "\" ]; then git reset --soft \\\"HEAD@{1}\\\"; else git commit --amend --no-edit; fi }; f'\""
        }), "\n"]
      })
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "This script could have been extracted to a .sh file as well, but keeping things in node lowers the maintenance burden for me personally. In the past, anytime I needed to update this alias I would have to paste it into a bash linter, make my changes, minify it, and then paste it back into my gitconfig. This was a pain, and I would often avoid updating the alias because of it. Now that it is in a script file, I can update it like any other script."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "some-caveats",
      children: ["Some Caveats", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#some-caveats",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Setting up aliases as scripts can unlock a whole new level of power in your git aliases. However, there are some things to be aware of when doing this."
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["When setting up aliases like this, its important to remember that the cwd of the script will be the current working directory of the shell that runs the script. Any relative file paths in the script will be treated as relative to the cwd of the shell, not the location of the script. This is super useful at times, and super painful at others. For our rebase-main script its not an issue though, and the only indication that this is happening is we used ", jsxRuntimeExports.jsx(_components.code, {
        children: "~"
      }), " in the file path to reference the script location as an absolute path."]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Introducing scripting into your git aliases can also make it tempting to add more and more logic to your aliases. This can make them harder to maintain and understand, but also harder to remember. Its not worth maintaining a super complex alias, as you’ll be less likely to use it anyways. Additionally, you should be careful to not intoduce anything that may take too long to run into your aliases. If you are running a script that takes a long time to run, you may want to consider if it is the right place for it."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "conclusion",
      children: ["Conclusion", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#conclusion",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["I hope this article has shown you the power of scripting in your git aliases. By using scripts you can create more complex aliases that are easier to maintain and understand. This can make your git workflow more efficient and enjoyable. For more examples of git aliases, you can look at my ", jsxRuntimeExports.jsx(_components.a, {
        href: "https://github.com/agentender/dotfiles",
        rel: "noopener noreferrer",
        target: "_blank",
        children: "dotfiles"
      }), " project. It contains a lot of the configuration that I keep on all my machines, including my git aliases."]
    })]
  });
}
function MDXContent$9(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? jsxRuntimeExports.jsx(MDXLayout, {
    ...props,
    children: jsxRuntimeExports.jsx(_createMdxContent$9, {
      ...props
    })
  }) : _createMdxContent$9(props);
}
function _missingMdxReference$9(id, component) {
  throw new Error("Expected " + ("component" ) + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/superpowered-git-aliases/post.ts [vike:pluginModuleBanner] */
const superpoweredGitAliases = {
  mdx: MDXContent$9,
  publishDate: new Date(2024, 6, 30),
  slug: "superpowered-git-aliases",
  title: "Superpowered Git Aliases with Scripting",
  description: `Git aliases are a powerful tool for improving your workflow. In this post, I'll show you how to take them to the next level by using scripting to create aliases that contain control flow and more.`,
  tags: ["technical", "git", "tooling", "tutorial"]
};

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/tiki/pineapple-parlor/contents.mdx [vike:pluginModuleBanner] */
function _createMdxContent$8(props) {
  const _components = {
    a: "a",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    li: "li",
    p: "p",
    ul: "ul",
    ...props.components
  }, {Anchor, TikiTable} = _components;
  if (!Anchor) _missingMdxReference$8("Anchor");
  if (!TikiTable) _missingMdxReference$8("TikiTable");
  return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [jsxRuntimeExports.jsx(_components.h1, {
      id: "pineapple-parlor",
      children: "Pineapple Parlor"
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "quick-review",
      children: ["Quick Review", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#quick-review",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "I thoroughly enjoyed our visit to the pineapple parlor, and would highly recommend it to anyone in the area. The concept of pairing each drink with a small dish of food was a delight, and not something that I’ve seen before nor since. The drinks were served in a timely manner and were of high quality."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "the-longer-version",
      children: ["The Longer Version", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-longer-version",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "key-info",
      children: ["Key Info:", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#key-info",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Location: Galveston, TX"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Date Visited: May 25, 2025"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Visited with: My Wife"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "our-visit",
      children: ["Our Visit:", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#our-visit",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "I knew that Pineapple Parlor was a speakeasy, but admittedly should have done more research. Our uber ride dropped us off outside of the nearby bar “Daquiri Time Out”, which I had seen in the reviews was worth checking out while waiting to get into the Pineapple Parlor. What I had missed though, was that Pineapple Parlor’s entrance is actually hidden inside of Daquiri Time Out. This left us lost, but with Google Maps at our side."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "After wandering a bit, we were convinced that it must be around the back of Daquiri Time Out, and another party had shown up looking for the bar as well. Together, we found that the entrance was through a fire exit in the back corner of the building. The entry way was marked by a pineapple hanging on the wall, which covered a keypad… to which we did not have the code."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "The other party was able to find the code online, and all 3 of the parties that had gathered were able to get past the keypad. This let us into a small breezeway, with a desk that we could check in at. When we checked in we were told there was an hour wait, and we decided to hang out inside the main Daquiri Time Out bar while we waited. My wife and I tried a few drinks there, and we received a text that our table was ready in around 25 minutes, well under the expected wait time."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "We proceeded back to the keypad, only to realize we had already managed to forget the code. After a brief moment of panic, we were able to find it again and get back inside."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "the-drinks",
      children: ["The Drinks", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-drinks",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "My wife and I each purchased two drinks, sharing a few sips along the way. All together, we tried their renditions of:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Trader Vic’s Mai Tai ($16)"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Three Dots and a Dash ($19)"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Chi Chi ($19)"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Zombie ($18)"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "The drinks were priced approximately within my expectations for a tiki bar, although a bit higher than what most may expect. Something to keep in mind with their pricing though, is that each drink was served with an appetizer that costs $5 if ordered alone, making the overall value more reasonable."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "I order a Mai Tai at almost every tiki bar we visit for my first drink, as a way to benchmark things out personally. This started as something I’d ask for wherever we were at, because of how estranged non-tiki location’s renditions of the drink have become. Tiki Bars are typically pretty consistent, so this has become my go-to drink for comparison. Pineapple Parlor’s version was not necessarily a standout, but there was nothing that tasted off or incorrect and it was thoroughly enjoyed."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "the-food",
      children: ["The food", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-food",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Each drink was paired with a small appetizer, which was a delightful touch. If you didn’t like the sound of one of the pairings, we were able to sub out for others on the menu without much fuss. All in, we sampled:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Crab Rangoon Nachos"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Pork Bao Bun w/ Angostura BBQ"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Pani Popo"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Sweet Wonton"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "We only substituted one of the appetizers, opting for the Pani Popo over a pineapple macaroni salad. We were not disappointed with any of the dishes we received, and each felt like a fair portion for the 5 dollar price point."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "decor--theming-elements",
      children: ["Decor + Theming Elements", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#decor--theming-elements",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Walking in to the pineapple parlor we were immediately transported away from Galveston, exactly what we wanted from a tiki bar. The seats at the bar were bamboo, and tiki mugs from various bars were displayed on some nearby shelves. The lighting was dim, but adequate to read menus."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "As far as show-y elements, a few drinks had special effects. When ordering one of the drinks a clip from scooby-doo was played on the TV, adding a thematic touch. Another drink came with a lit sparkler."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "All in all, the decor was a bit above average and contributed to the overall experience."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "take-home-elements",
      children: ["Take Home Elements", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#take-home-elements",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "We purchased a set of glasses from the bar, one mai tai glass and a high ball / zombie glass. They did not have mugs to purchase, nor coasters, swizzle sticks, or other keepsakes."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "tiki-rating-table",
      children: ["Tiki Rating Table", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#tiki-rating-table",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Placing Tiki bars in the table is a bit of a struggle for me, as I have two competing criteria in mind."
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "The objective ratings of the drinks recieved, decor etc"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "The subjective experience that we had that day, which often comes down to who was with me, the conversation we had etc."
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "For this visit, it was the first time since our youngest child was born that my wife and I had a night out together, just the two of us. This added a layer of significance to the experience that I can’t fully separate from the objective elements and we ultimately had a wonderful time. I don’t know exactly how to show this in the table, but it will always be tied to how I think of Pineapple Parlor."
    }), "\n", jsxRuntimeExports.jsx(TikiTable, {})]
  });
}
function MDXContent$8(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? jsxRuntimeExports.jsx(MDXLayout, {
    ...props,
    children: jsxRuntimeExports.jsx(_createMdxContent$8, {
      ...props
    })
  }) : _createMdxContent$8(props);
}
function _missingMdxReference$8(id, component) {
  throw new Error("Expected " + ("component" ) + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/tiki/pineapple-parlor/post.ts [vike:pluginModuleBanner] */
const pineappleParlor = {
  mdx: MDXContent$8,
  publishDate: new Date(2025, 7, 18),
  slug: "pineapple-parlor",
  title: "Pineapple Parlor",
  description: `A short review of our trip to the Pineapple Parlor, a hidden tiki gem in Galveston.`,
  tags: ["non-technical", "tiki", "review"]
};

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/tiki/inferno-room/contents.mdx [vike:pluginModuleBanner] */
function _createMdxContent$7(props) {
  const _components = {
    a: "a",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    li: "li",
    p: "p",
    ul: "ul",
    ...props.components
  }, {Anchor, TikiTable} = _components;
  if (!Anchor) _missingMdxReference$7("Anchor");
  if (!TikiTable) _missingMdxReference$7("TikiTable");
  return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [jsxRuntimeExports.jsx(_components.h1, {
      id: "the-inferno-room",
      children: "The Inferno Room."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "quick-review",
      children: ["Quick Review", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#quick-review",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "The Inferno Room is located near downtown Indianapolis, and offered great theming and drinks. Food pricing was a bit expensive, but portions made up for it so be prepared for the larger portions when ordering. While we visted at an awkward time, the experience was still enjoyed and I’d hope to come back in the future."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "the-longer-version",
      children: ["The Longer Version", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-longer-version",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "key-info",
      children: ["Key Info:", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#key-info",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Location: Indianapolis, IN"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Date Visited: Aug 1, 2025"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Visited with: My Wife"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "our-visit",
      children: ["Our Visit:", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#our-visit",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "We visited the Inferno Room early in the day on Thursday, August 1st, 2025. We had a concert to attend that started at 6:30, roughly 40 minutes away so with the inferno room opening at 4:00 our plan was to get there right when it opened… But, not everything ends up going according to plan and we arrived closer to 5:15 after some misnavigation to the hotel prior."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "As such we were a bit rushed, but the bar was still almost empty being early on a Thursday so wait times inside were minimal. Once inside, we were sat at the bar and offered menus to look over."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "the-drinks",
      children: ["The Drinks", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-drinks",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "My wife and I each purchased a few drinks, sharing a few sips along the way. All together, we tried their renditions of:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Heart of the Sun x 2 - My wife loved mine, and ended up with her own."
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Mango Diablo"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Titilating Tart"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Tambaran Firedancer"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Drinks were priced at $15 each, which is reasonable and about what I’d expect for a tiki bar or specialty cocktail bar. The drinks were overall very good, although the mango diablo was not enjoyable for my wife. It featured mezcal heavily, and was super smoky, which she was not expecting nor familiar with. We concluded that if someone was to like mezcal, they’d likely be fine with the drink, but for her it was a no-go."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "the-food",
      children: ["The food", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-food",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "The Inferno Room has an extensive food menu, and our plan was to eat here prior to our concert. In the end, we purchased two dishes:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Disco Fries ($13)"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Pineapple Fried Rice ($18)"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "We felt that the pricing was a bit high when looking at the website before coming, but in the end the portions were way larger than we expected and I’d consider it reasonable. Both items were really good, but they did take a bit of time to come to the table so I’d recommend ordering them as soon as you get a chance rather than waiting to finish your first round."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "decor--theming-elements",
      children: ["Decor + Theming Elements", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#decor--theming-elements",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Walking into the Inferno Room was a wild experience. Outside the building there was very little to indicate what waited inside, and it honestly felt like it was in the middle of nowhere for being downtown. Stepping inside, the theming was everywhere and immediate. Bamboo, lighting, totem poles, and a whole lot more contributed to creating the full experience."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "As for effects / interactive drinks, the Tambaran Firedancer was presented with a flaming lime half and a shaker of cinnamon and coffee creamer was used tableside to create a small fireball. I did not notice other drinks with effects, but its possible there were more."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "tiki-rating-table",
      children: ["Tiki Rating Table", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#tiki-rating-table",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Placing Tiki bars in the table is a bit of a struggle for me, as I have two competing criteria in mind."
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "The objective ratings of the drinks recieved, decor etc"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "The subjective experience that we had that day, which often comes down to who was with me, the conversation we had etc."
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "This trip was overall part of a very fun time, but the visit to the Inferno Room was hampered a bit by our time constraints and the rushed nature of our visit. Nonetheless, we enjoyed the drinks and the atmosphere, and I’d love to come back and experience it more fully in the future."
    }), "\n", jsxRuntimeExports.jsx(TikiTable, {})]
  });
}
function MDXContent$7(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? jsxRuntimeExports.jsx(MDXLayout, {
    ...props,
    children: jsxRuntimeExports.jsx(_createMdxContent$7, {
      ...props
    })
  }) : _createMdxContent$7(props);
}
function _missingMdxReference$7(id, component) {
  throw new Error("Expected " + ("component" ) + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/tiki/inferno-room/post.ts [vike:pluginModuleBanner] */
const infernoRoom = {
  mdx: MDXContent$7,
  publishDate: new Date(2025, 7, 18),
  slug: "inferno-room",
  title: "The Inferno Room",
  description: `A short review of our trip to the Inferno Room, a tiki bar near downtown Indianapolis.`,
  tags: ["non-technical", "tiki", "review"]
};

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/tiki/trader-sams-grog-grotto/contents.mdx [vike:pluginModuleBanner] */
function _createMdxContent$6(props) {
  const _components = {
    a: "a",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    li: "li",
    p: "p",
    ul: "ul",
    ...props.components
  }, {Anchor, TikiTable} = _components;
  if (!Anchor) _missingMdxReference$6("Anchor");
  if (!TikiTable) _missingMdxReference$6("TikiTable");
  return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [jsxRuntimeExports.jsx(_components.h1, {
      id: "trader-sams-grog-grotto",
      children: "Trader Sam’s Grog Grotto"
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "quick-review",
      children: ["Quick Review", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#quick-review",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "A bit less well known than Trader Sam’s Enchanted Tiki Bar in Disneyland, Trader Sam’s Grog Grotto is a tiki bar located in Disney’s Polynesian Village Resort. The drinks were good, the atmosphere was fun, but we missed the food this time. The long wait accompanied by some morning drama led to a less enjoyable experience, but objectively it was still a nice visit that I’d love to repeat in better company."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "the-longer-version",
      children: ["The Longer Version", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-longer-version",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "key-info",
      children: ["Key Info:", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#key-info",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Location: Lake Buena Vista, FL"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Date Visited: Mar 13, 2025"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Visited with: My Wife, Daughter, and Parents"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "our-visit",
      children: ["Our Visit:", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#our-visit",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "We visited Trader Sam’s about halfway through a longer trip to the Disney parks, something that my family does roughly every year and a half. With my growing Tiki obsession, along with it just being something new to do, I was anxiously awaiting this stop. Both Trader Sams locations are notorious for long waits, and do not accept reservations so I had hoped to get there a bit before opening to avoid the wait."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "We ended up getting there a bit later than planned, and waited for roughly an hour and a half before being seated. The wait was made a bit more difficult by the fact that we had our 2 year old daughter with us, and coupled with another restless party member and the awkwardness of bringing a smaller child into a bar setting, we didn’t really make the most of the experience. Additionally, we had just learned that my wife was pregnant with our second child, so she was limited to mocktails and non-alcoholic options."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "the-drinks",
      children: ["The Drinks", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-drinks",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Through our party, we tried the following drinks:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Zombie ($18, or w/ mug $35)"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "HippopotoMai-Tai ($18.50)"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Tiki Tiki Tiki Tiki Tiki Rum ($17.50)"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Skipper Sipper ($6.25, NA)"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Schweitzer Falls ($6.25, NA)"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Polynesian Punch ($12.50, NA)"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "I personally tried the Zombie, taking home the mug as a souviner as well as the HippopotoMai-Tai. I didn’t have an issue with either of the drinks I had, and appreciated the non-alcoholic options for my Wife and daughter."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "decor--theming-elements",
      children: ["Decor + Theming Elements", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#decor--theming-elements",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "As for decor, no one can beat Disney. From ride’s queues, to signature restaurants and now tiki bars the little details disney adds are always a highlight. Being nestled inside of the Polynesian, there was less of an “escapism” feel to other tiki bars, as you are already inside the theme. Nonetheless, the detail and theming elements were great. The bar itself was dark, with a lot of wood and bamboo, and the drinks were served in tiki mugs that were themed to the bar."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Notably, the bar is quite a bit smaller than one may expect for its location. The bar replaced the arcade that was in the Polynesian resort, which as an older resort was not as spacious as newer ones. This makes for a close-knit feel much more similar to some of the other tiki bars that I’ve visited than I expected."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "For every drink there was a combination of glassware, tableside effects, and other show-y elements that made the experience more fun. When ordering the HippopotoMai-Tai, the server presented it calling out something that ended with “Two Shots of Rum” that sounded throughout the bar. Additionally, some sfx of a cartoony gun was played. For the zombie, the servers wore glasses that made it look like their eyes were falling out."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "While we didn’t order it, when another table ordered the uh-oa the tables all around joined in a chant of “Uh-Oa! Uh-Oa!“. Some drinks made the virtual windows start storming, with the volcano pictured erupting."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "These effects are something pretty uniquely Disney. While other bars may have a bit of it here and there, the level of detail and commitment to the theme at Trader Sam’s is impressive and the level of effects would just be hard to replicate without Disney’s budget."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "tiki-rating-table",
      children: ["Tiki Rating Table", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#tiki-rating-table",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Placing Tiki bars in the table is a bit of a struggle for me, as I have two competing criteria in mind."
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "The objective ratings of the drinks recieved, decor etc"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "The subjective experience that we had that day, which often comes down to who was with me, the conversation we had etc."
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "The awkward circumstances surrounding our experience made things not quite as fun as they could have been, and overall probably lower my internal rating a bit more than is fair. That said, it was a fun experience that I’d love to try again with a more enthusiastic group."
    }), "\n", jsxRuntimeExports.jsx(TikiTable, {})]
  });
}
function MDXContent$6(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? jsxRuntimeExports.jsx(MDXLayout, {
    ...props,
    children: jsxRuntimeExports.jsx(_createMdxContent$6, {
      ...props
    })
  }) : _createMdxContent$6(props);
}
function _missingMdxReference$6(id, component) {
  throw new Error("Expected " + ("component" ) + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/tiki/trader-sams-grog-grotto/post.ts [vike:pluginModuleBanner] */
const traderSamsGrogGrotto = {
  mdx: MDXContent$6,
  publishDate: new Date(2025, 7, 18),
  slug: "trader-sams-grog-grotto",
  title: "Trader Sam’s Grog Grotto",
  description: `A short review of our trip to Trader Sam’s Grog Grotto, a tiki bar located in Disney’s Polynesian Village Resort.`,
  tags: ["non-technical", "tiki", "review"]
};

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/tiki/tiki-chick/contents.mdx [vike:pluginModuleBanner] */
function _createMdxContent$5(props) {
  const _components = {
    a: "a",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    li: "li",
    p: "p",
    ul: "ul",
    ...props.components
  }, {Anchor, TikiTable} = _components;
  if (!Anchor) _missingMdxReference$5("Anchor");
  if (!TikiTable) _missingMdxReference$5("TikiTable");
  return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [jsxRuntimeExports.jsx(_components.h1, {
      id: "tiki-chick",
      children: "Tiki Chick."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "quick-review",
      children: ["Quick Review", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#quick-review",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Located a quick walk from the subway, Tiki Chick was easy to get to and easy to enjoy. This was the second time I had gotten together with colleagues after joining Nx, and several of them accompanied me to check out this spot. The drinks were exactly as one would expect, and while not stand out they certainly didn’t let down. Combined with $5 chicken sandwiches and creative seating arrangements, it made for a great experience that I’d happily revisit even if there are better themed bars in the area."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "the-longer-version",
      children: ["The Longer Version", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-longer-version",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "key-info",
      children: ["Key Info:", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#key-info",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Location: NYC, NY"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Date Visited: Sep 29, 2023"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Visited with: 5-6 colleagues from work"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "our-visit",
      children: ["Our Visit:", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#our-visit",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Tiki Chick was an outing that I organized towards the end of a week-long onsite for Nx. This was the second onsite since I had joined the company, and was the second time I had seen most people in person. With everyone invited, a group of 6 - 7 of us boarded the subway near times square and made our way to the bar."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "We waited approximately 15-20 minutes to be let in, and were initally guided to a standing area with a bar-height ledge attached to the wall. This was admittedly less than ideal, but after putting in our order for our first round we were led to a new area that featured a coffee table surrounded by a small couch, and a few other chairs. The seating was arranged such that we were all in a circle, and made conversation easy and enjoyable amongst the other noise."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "the-drinks",
      children: ["The Drinks", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-drinks",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "While I cannot speak for the drinks others received, I personally enjoyed tiki chick’s:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Mai Tai ($16)"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Zombie ($16)"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "In NYC a $16 cocktail is certainly not out of the ordinary, and not above other tiki bars prices that I’ve been to since. Both cocktails were fantastic and in line with their namesake, certainly a good sign."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "the-food",
      children: ["The food", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-food",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Tiki Chick features $5 chicken sandwiches, which are not easy to find in NYC. After another colleague ordered one and enjoyed it, I also ordered one which featured hot honey. No complaints on my end, and the fried sandwiches were an excellent pairing to the heavy drinks."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "decor--theming-elements",
      children: ["Decor + Theming Elements", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#decor--theming-elements",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Decor and overall theming were not Tiki Chick’s strong point. If you are here for the escapism, this probably isn’t it. We didn’t sit in the outdoor section, but if you did I’d argue there was no theme whatsoever aside from a few boho chairs. Inside, the theme was a bit more pronounced but still overall very light. There were a few nautical elements, and drinks were served in mugs… but that was about it."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "This isn’t the bar for escapism, but is perhaps more approachable for a varied crowd looking for a casual night out."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "tiki-rating-table",
      children: ["Tiki Rating Table", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#tiki-rating-table",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Placing Tiki bars in the table is a bit of a struggle for me, as I have two competing criteria in mind."
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "The objective ratings of the drinks recieved, decor etc"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "The subjective experience that we had that day, which often comes down to who was with me, the conversation we had etc."
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "The whole trip to NYC was a whirlwind of activity with colleagues, and the night out to tiki chick was a personal favorite. Depsite the light theming, it was hard to be dissapointed with good drinks and company."
    }), "\n", jsxRuntimeExports.jsx(TikiTable, {})]
  });
}
function MDXContent$5(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? jsxRuntimeExports.jsx(MDXLayout, {
    ...props,
    children: jsxRuntimeExports.jsx(_createMdxContent$5, {
      ...props
    })
  }) : _createMdxContent$5(props);
}
function _missingMdxReference$5(id, component) {
  throw new Error("Expected " + ("component" ) + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/tiki/tiki-chick/post.ts [vike:pluginModuleBanner] */
const tikiChick = {
  mdx: MDXContent$5,
  publishDate: new Date(2025, 7, 18),
  slug: "tiki-chick",
  title: "Tiki Chick",
  description: `Tiki Chick was the first tiki bar I really went to, and the laid back environment made an excellent environment to catch up with colleagues that I seldom see in person.`,
  tags: ["non-technical", "tiki", "review"]
};

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/tiki/kaona-room/contents.mdx [vike:pluginModuleBanner] */
function _createMdxContent$4(props) {
  const _components = {
    a: "a",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    li: "li",
    p: "p",
    ul: "ul",
    ...props.components
  }, {Anchor, TikiTable} = _components;
  if (!Anchor) _missingMdxReference$4("Anchor");
  if (!TikiTable) _missingMdxReference$4("TikiTable");
  return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [jsxRuntimeExports.jsx(_components.h1, {
      id: "kaona-room",
      children: "Kaona Room"
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "key-info",
      children: ["Key Info:", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#key-info",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Location: Miami, FL"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Date Visited: Jan, 2025"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Visited with: 5-6 colleagues from work"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "our-visit",
      children: ["Our Visit:", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#our-visit",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "To truly understand and appreciate our visit to the Kaona Room, you just had to be there. The Kaona Room was once a speak-easy back room of esotico, which served similar drinks but with less theming and flair, but is now closed. Replacing esotico, was a sports bar called Canvas. Writing this now, in August of 2025, I can’t seem to find that this new Canvas location is still open but it appears Kaona is. Some information seems to point that it may now be a backroom inside the Leinster, an irish pub that opened up midway through the year."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "I mention this all for the context of the sports bar, which was open all week while the kaona room only opened on specific days. The same owner owned each, and they were part of the same building, but that was where the similarities end. Through a series of mistakes, we made it to the week-of without realizing that the Kaona Room’s limited hours did not include any of the time that would be available during our work trip, and seemed to not be available. Hope was not lost though, as our wonderful operations manager was able to get into contact with the owner, and secured us a reservation!"
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "We were not sure exactly how, or why, but we came to the understanding that the kaona room would be open and we had a reservation. Upon arriving, we had a hard time determining where the entrance even was though as we had missed the bit of research indicating that Kaona was a speakeasy inside of Canvas. After spending a few minutes wondering around inside, we entered to ask the staff there if they knew where the entry was…"
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "This was where the confusion grew by a 1000. We were informed that the same owner owned both bars, but that the Kaona Room was not open that day. We were told that it was only open on weekends, and that we would have to come back then, but that we did have a reservation… to Canvas. We were let down, but at the end of the day the fellowship with colleagues was more important than the location, so we planned to settle down."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Shortly after receiving menus for Canvas, the owner came to our table and informed us that he had an idea, if we were up for it. He opened the Kaona Room just for our group, almost like it was a party room in a larger establishment. This was amazing, and a once in a lifetime experience to get to hang out in the bar that normally is packed to its 40 person limit with just our group of 8 colleagues, but there are more limitations that lead to me not giving it a rating and ranking within the tiki bars that I have visited."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "While we were seated within the kaona room and able to enjoy the space, the drink menu that was served was Canvas’, as the bartenders for Kaona were not present and the techniques and ingredients unavailable. Additionally, the showmanship and effects typical were not on display, as like I said it was more of a private room than anything else."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "the-drinks",
      children: ["The Drinks", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-drinks",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "This section’s a bit different here as the drink menu served was not that of Kaona’s, but due to the location in Miami I was able to order a few daquiri variants that were all well made. It was nice to order them and not be met with confusion about not expecting them to be frozen, as classic daquiris are pretty popular in the area."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "decor--theming-elements",
      children: ["Decor + Theming Elements", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#decor--theming-elements",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "The decor inside Kaona room was really neat, and the run-up to the hidden speak easy built anticipation from the get go. Going from a noisy sports bar to a secluded space was neat, and put the escapism front up which was really awesome to see. The fact that we were in the space alone also meant that we had plenty of time to look around and really take in all of the details which would not have been possible in the typical setting."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "tiki-rating-table",
      children: ["Tiki Rating Table", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#tiki-rating-table",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Placing Tiki bars in the table is a bit of a struggle for me, as I have two competing criteria in mind."
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "The objective ratings of the drinks recieved, decor etc"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "The subjective experience that we had that day, which often comes down to who was with me, the conversation we had etc."
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Given the unique circumstances of our visit, I do not think it would be right to give a rating to Kaona room, but based on various online reviews and viewing the space it is a place I’d love to revisit given the opportunity."
    }), "\n", jsxRuntimeExports.jsx(TikiTable, {})]
  });
}
function MDXContent$4(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? jsxRuntimeExports.jsx(MDXLayout, {
    ...props,
    children: jsxRuntimeExports.jsx(_createMdxContent$4, {
      ...props
    })
  }) : _createMdxContent$4(props);
}
function _missingMdxReference$4(id, component) {
  throw new Error("Expected " + ("component" ) + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/tiki/kaona-room/post.ts [vike:pluginModuleBanner] */
const kaonaRoom = {
  mdx: MDXContent$4,
  publishDate: new Date(2025, 7, 18),
  slug: "kaona-room",
  title: "Kaona Room",
  description: `A truly puzzling visit that leads to a non-review, but a good time nonetheless.`,
  tags: ["non-technical", "tiki", "review"]
};

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/tiki/rum-barrel/contents.mdx [vike:pluginModuleBanner] */
function _createMdxContent$3(props) {
  const _components = {
    a: "a",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    li: "li",
    p: "p",
    ul: "ul",
    ...props.components
  }, {Anchor, TikiTable} = _components;
  if (!Anchor) _missingMdxReference$3("Anchor");
  if (!TikiTable) _missingMdxReference$3("TikiTable");
  return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [jsxRuntimeExports.jsx(_components.h1, {
      id: "rum-barrel-west",
      children: "Rum Barrel West"
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "quick-review",
      children: ["Quick Review", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#quick-review",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "We went to Rum Barrel as one of the last stops on our company’s first EU conference, with several colleagues joining. The experience was really neat, and the drinks were all well crafted. In leiu of a real “tiki bar” in the area, rum barrel was a blast that I’d be happy to visit in the future."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "the-longer-version",
      children: ["The Longer Version", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-longer-version",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "key-info",
      children: ["Key Info:", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#key-info",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Location: Amsterdam, Netherlands"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Date Visited: Apr 5, 2025"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Visited with: 8-10 colleagues"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "our-visit",
      children: ["Our Visit:", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#our-visit",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "I met up with colleagues at rum barrel one night after our conference, they had been walking around the city and I arrived a bit ahead of time walking from the hotel. The bar is situated on the corner of a street, and was not particularly busy when we arrived. The group of us were sat at a long table, which ended up splitting the conversations between different groups along the table."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "While we were wrapping up, the servers brought each of us a complementary portion of their house rum blend, which I’m sure was only done because of the large group size, but was a nice touch. Servers seemed excited when presenting the drinks, especially those with a fiery flare."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Most of the group choose Uber to get back to the hotel, but a colleague and I opted to walk back to grand centraal and take a ferry back to NDSM where our hotel was, and I have to admit its still quite amazing any time real public transit is available."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "the-drinks",
      children: ["The Drinks", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-drinks",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "I personally sampled Rum Barrel’s:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Zombie (€27.50 ≈ $32)"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Mai-Tai (€15 ≈ $17.50)"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "food",
      children: ["Food", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#food",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "We had already eaten dinner beforehand, but we sampled some of the bar snacks. The half of the table I was closer to ordered some croquettes, which were good."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "decor--theming-elements",
      children: ["Decor + Theming Elements", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#decor--theming-elements",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Rum barrel’s decor was extremely minimal, outside of a few motif’s I would not consider there to be tiki theming. That said, the zombie’s were served in a ceramic skull, topped with flaming lime and sprinkled with cinnamon grounds to create a small fireball. Amongst our party there were 3 of them ordered, and every skull got full attention from our table (as well as those around us)."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Despite not being a tiki bar really, the design was clean and everything was well thought out. The design was a lot more modern and up scale, and I think it worked for what it was going for."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "tiki-rating-table",
      children: ["Tiki Rating Table", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#tiki-rating-table",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Placing Tiki bars in the table is a bit of a struggle for me, as I have two competing criteria in mind."
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "The objective ratings of the drinks recieved, decor etc"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "The subjective experience that we had that day, which often comes down to who was with me, the conversation we had etc."
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Rum Barrel was awesome, but not really a tiki bar and that contributes to its lower ranking overall."
    }), "\n", jsxRuntimeExports.jsx(TikiTable, {})]
  });
}
function MDXContent$3(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? jsxRuntimeExports.jsx(MDXLayout, {
    ...props,
    children: jsxRuntimeExports.jsx(_createMdxContent$3, {
      ...props
    })
  }) : _createMdxContent$3(props);
}
function _missingMdxReference$3(id, component) {
  throw new Error("Expected " + ("component" ) + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/tiki/rum-barrel/post.ts [vike:pluginModuleBanner] */
const rumBarrelWest = {
  mdx: MDXContent$3,
  publishDate: new Date(2025, 7, 18),
  slug: "rum-barrel-west",
  title: "Rum Barrel West",
  description: `A short review of our trip to Rum Barrel West, a rum bar located in Amsterdam.`,
  tags: ["non-technical", "tiki", "review"]
};

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/tiki/kon-tiki/contents.mdx [vike:pluginModuleBanner] */
function _createMdxContent$2(props) {
  const _components = {
    a: "a",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    li: "li",
    p: "p",
    ul: "ul",
    ...props.components
  }, {Anchor, TikiTable} = _components;
  if (!Anchor) _missingMdxReference$2("Anchor");
  if (!TikiTable) _missingMdxReference$2("TikiTable");
  return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [jsxRuntimeExports.jsx(_components.h1, {
      id: "kon-tiki",
      children: "Kon Tiki"
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "quick-review",
      children: ["Quick Review", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#quick-review",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "After KCDC wrapped up, 2 colleagues and myself found ourselves walking to Kon Tiki to grab a drink and catch up. The vibrant space and atmosphere were inviting, with nothing too loud to prevent conversation. It was a pleasant stop that I’d happily revisit, but perhaps not themed as well as some other tiki bars."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "the-longer-version",
      children: ["The Longer Version", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-longer-version",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "key-info",
      children: ["Key Info:", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#key-info",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Location: Kansas City, MO"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Date Visited: Aug 15, 2025"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Visited with: 2 colleagues"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "our-visit",
      children: ["Our Visit:", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#our-visit",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "We visited Trader Sam’s about halfway through a longer trip to the Disney parks, something that my family does roughly every year and a half. With my growing Tiki obsession, along with it just being something new to do, I was anxiously awaiting this stop. Both Trader Sams locations are notorious for long waits, and do not accept reservations so I had hoped to get there a bit before opening to avoid the wait."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "We ended up getting there a bit later than planned, and waited for roughly an hour and a half before being seated. The wait was made a bit more difficult by the fact that we had our 2 year old daughter with us, and coupled with another restless party member and the awkwardness of bringing a smaller child into a bar setting, we didn’t really make the most of the experience. Additionally, we had just learned that my wife was pregnant with our second child, so she was limited to mocktails and non-alcoholic options."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "the-drinks",
      children: ["The Drinks", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-drinks",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "I personally sampled Kon Tiki’s"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Mai Tai"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Saturn"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Zombie"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Kon Tiki prices all of their drinks the same, at 14 USD which is a few dollars less than the other tiki bars I’ve visited. Any of the drinks can be made in a souviner mug for $34, or you can purchase the mug separately for $20. I was happy with the taste and flavor of each of the drinks that I received, but a bit dissapointed in the overall presentation of them. The saturn and mai tai were both served in the same glass, where a saturn would normally be served up in a coupe or similar, and garnish was a bit lacking. For the saturn, it had the signature garnish of the lemon peel wrapped around the cherry to look like Saturn’s rings, but it was tightly wrapped around it so some of the look was diminished. This probably sounds like nitpicking, but its a small touch that helps to elevate the drink."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "decor--theming-elements",
      children: ["Decor + Theming Elements", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#decor--theming-elements",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Kon Tiki’s decor was a bit more modern and well lit than some of the other tiki bar’s I’ve visited, but it still had plenty of tropical elements and charm to keep with the theme. Of note, topless women are featured a bit more heavily than some would be comfortable with but its not overly explicit or distracting, just a bit more than one would likely anticipate."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Floating lanterns replace the traditional fishermans floats, but give the same feel with some sharper edges. Shelves over the bar contain some nautical elements to aid with the overall theme."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "tiki-rating-table",
      children: ["Tiki Rating Table", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#tiki-rating-table",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Placing Tiki bars in the table is a bit of a struggle for me, as I have two competing criteria in mind."
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "The objective ratings of the drinks recieved, decor etc"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "The subjective experience that we had that day, which often comes down to who was with me, the conversation we had etc."
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Kon Tiki felt like a “fine” tiki bar, but nothing was particularly outstanding or memorable about it. The drinks were good, the decor was nice, but it didn’t quite reach the level of some of the other tiki bars I’ve visited and overall I’d place it at about average."
    }), "\n", jsxRuntimeExports.jsx(TikiTable, {})]
  });
}
function MDXContent$2(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? jsxRuntimeExports.jsx(MDXLayout, {
    ...props,
    children: jsxRuntimeExports.jsx(_createMdxContent$2, {
      ...props
    })
  }) : _createMdxContent$2(props);
}
function _missingMdxReference$2(id, component) {
  throw new Error("Expected " + ("component" ) + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/tiki/kon-tiki/post.ts [vike:pluginModuleBanner] */
const konTiki = {
  mdx: MDXContent$2,
  publishDate: new Date(2025, 7, 18),
  slug: "kon-tiki",
  title: "Kon Tiki",
  description: `A short review of our trip to Kon Tiki, a tiki bar located in Kansas City.`,
  tags: ["non-technical", "tiki", "review"]
};

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/tiki/sunken-harbor-club/contents.mdx [vike:pluginModuleBanner] */
function _createMdxContent$1(props) {
  const _components = {
    a: "a",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    li: "li",
    p: "p",
    ul: "ul",
    ...props.components
  }, {Anchor, TikiTable} = _components;
  if (!Anchor) _missingMdxReference$1("Anchor");
  if (!TikiTable) _missingMdxReference$1("TikiTable");
  return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [jsxRuntimeExports.jsx(_components.h1, {
      id: "sunken-harbor-club",
      children: "Sunken Harbor Club."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "quick-review",
      children: ["Quick Review", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#quick-review",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Sunken Harbor Club, located in Brooklyn NY, was an absolute treat that’s absolutely worth visiting. The food choices we sampled were both amazing, and neither my wife nor I experienced any disappointment with our selections."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "the-longer-version",
      children: ["The Longer Version", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-longer-version",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "key-info",
      children: ["Key Info:", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#key-info",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Location: Brooklyn, New York"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Date Visited: Dec 6, 2025"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Visited with: My Wife"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "our-visit",
      children: ["Our Visit:", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#our-visit",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["My wife and I take one overnight trip without the kids each year as an opportunity to reconnect and experience something new together. This year, we visited NYC and on Saturday night in particular had a pretty late night out. Sunken Harbor Club was intended to be our first stop of the night, but after receiving an estimated 2 hour wait, we visited a non-tiki prior. We walked to ", jsxRuntimeExports.jsx(_components.a, {
        href: "https://www.somedaybarnyc.com/",
        rel: "noopener noreferrer",
        target: "_blank",
        children: "Someday Bar"
      }), " to kill some time, and left after a drink. We returned to Sunken Harbor Club, stopping by a few stores on the way to get closer to the estimated time."]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "The wait was pretty close to the estimate, and we were led up the staircase attached to Gage and Tollner to be seated in SHC. We were seated at the bar, where the head bartender Garret Richards was joined by two other bartenders who were all very friendly and knowledgeable about the menu."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "the-drinks",
      children: ["The Drinks", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-drinks",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "The drinks at Sunken Harbor Club were exceptional. Each cocktail was carefully crafted with attention to detail, and the flavors were well balanced. Our exact selections are below:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Rum Barrel (me, $22)"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Rhyme of The Ancient Mariner (me, $18)"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Shattered Skull (shared, $45)"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Missionaries Downfall (my wife, $20)"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Incantation (my wife, $22)"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Of the 5, all were excellent. I think the Incantation was our lowest rated drink, but I was pleasantly surprised with the communal bowl and the rum barrel. The prices were fairly in line with 2025 NYC pricing, so despite being rather expensive it was not a shock."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "the-food",
      children: ["The Food", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-food",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "My wife and I shared two menu items:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Spam Banh Mi Sliders ($18)"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Miso Butterscotch Pudding ($12)"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "The sliders were served as a plate of 3, and the bartender that took our order offered to bump it to a plate of 4 to be able to split evenly. We opted not to, as we had came from dinner prior to arriving. The staff brought extra plates to facilitate sharing and the food was excellent."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "The pudding was a decent portion, and the taste was out of this world. The miso flavoring and the toppings provided textural delight and a creative twist on a nostalgic childhood treat."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "decor--theming-elements",
      children: ["Decor + Theming Elements", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#decor--theming-elements",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Sunken harbor club was well themed, albeit without some of the exciting effects that some tiki spots offer. The setting was definitely more classy, with a theme that made if feel like you were inside a sunken ship. At one point in our serving there was a fog machine that was turned on, with a small lazer show + bubbles. I don’t believe this was tied to any of the drinks on the menu, but likely something they do sporadically over the service."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "All in, I do wish there was a bit more interactivity with the theming and decor but the bar presents itself as a cohesive environment with plenty to look at and enjoy."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "tiki-rating-table",
      children: ["Tiki Rating Table", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#tiki-rating-table",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Placing Tiki bars in the table is a bit of a struggle for me, as I have two competing criteria in mind."
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "The objective ratings of the drinks recieved, decor etc"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "The subjective experience that we had that day, which often comes down to who was with me, the conversation we had etc."
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Sunken harbor club excelled in both regards. We found ourselves there mid-way through a day that is easily in the top 10 days of 2025 for me, and the experience at the bar only added to the enjoyment of the day."
    }), "\n", jsxRuntimeExports.jsx(TikiTable, {})]
  });
}
function MDXContent$1(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? jsxRuntimeExports.jsx(MDXLayout, {
    ...props,
    children: jsxRuntimeExports.jsx(_createMdxContent$1, {
      ...props
    })
  }) : _createMdxContent$1(props);
}
function _missingMdxReference$1(id, component) {
  throw new Error("Expected " + ("component" ) + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/tiki/sunken-harbor-club/post.ts [vike:pluginModuleBanner] */
const sunkenHarborClub = {
  mdx: MDXContent$1,
  publishDate: new Date(2025, 11, 30),
  slug: "sunken-harbor-club",
  title: "Sunken Harbor Club",
  description: `A short review of our trip to Sunken Harbor Club, a tiki bar located in Brooklyn, NY.`,
  tags: ["non-technical", "tiki", "review"]
};

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/tiki/paradise-lost/contents.mdx [vike:pluginModuleBanner] */
function _createMdxContent(props) {
  const _components = {
    a: "a",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    hr: "hr",
    li: "li",
    p: "p",
    ul: "ul",
    ...props.components
  }, {Anchor, TikiTable} = _components;
  if (!Anchor) _missingMdxReference("Anchor");
  if (!TikiTable) _missingMdxReference("TikiTable");
  return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [jsxRuntimeExports.jsx(_components.h1, {
      id: "paradise-lost",
      children: "Paradise Lost"
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "quick-review",
      children: ["Quick Review", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#quick-review",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "the-longer-version",
      children: ["The Longer Version", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-longer-version",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "key-info",
      children: ["Key Info:", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#key-info",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Location: East Village, NYC"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Date Visited: Dec 6, 2025"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Visited with: My Wife"
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "our-visit",
      children: ["Our Visit", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#our-visit",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsxs(_components.p, {
      children: ["Paradise Lost was our last stop on a long night exploring NYC. It wasn’t initially planned to be our last stop, though. We arrived at roughly 9:45, directly after leaving ", jsxRuntimeExports.jsx(_components.a, {
        href: "../sunken-harbor-club",
        children: "Sunken Harbor Club"
      }), ". We waited a good amount of time to put in our name, and were informed it would likely be quite a wait. There were roughly 25 parties ahead of us at the time, but we persisted and checked out a few more things around the area in the meantime. We recieved our text to return at 12:50 AM, and stayed till close at 2:00 AM."]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Some of our feedback is definitely influenced by the late night visit, and I’m sure the staff and presentation would have been a bit better earlier in the night."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "the-drinks",
      children: ["The Drinks", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-drinks",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Between my wife and I, we sampled:"
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "[REDACTED] ($23)"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "Pearl Diver ($20)"
      }), "\n", jsxRuntimeExports.jsxs(_components.li, {
        children: ["\n", jsxRuntimeExports.jsx(_components.hr, {}), "\n"]
      }), "\n", jsxRuntimeExports.jsxs(_components.li, {
        children: ["\n", jsxRuntimeExports.jsx(_components.hr, {}), "\n"]
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "You’ll notice there’s two blanks there. Unfortunately this visit was at the end of a long night, and while neither of us were overserved or otherwise too far gone, we unfortunately have forgotten what my wife ordered."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Nevertheless, the drinks we sampled were delightful. Nothing was too over the top garnishwise, but the flavors were there and met my admittedly pretty high expectations."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "the-food",
      children: ["The Food", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#the-food",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Because of our late arrival, the kitchen had already been closed and we were not offered a food menu."
    }), "\n", jsxRuntimeExports.jsxs(_components.h3, {
      id: "decor--theming-elements",
      children: ["Decor + Theming Elements", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#decor--theming-elements",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Paradise Lost is meant to be a “speaky-tiki”, with the door being minimal and requiring ringing a doorbell to get in. From there, you walk down a short corridor before entering the main bar area, which is dimly lit and looks a bit like the inside of a ship or even perhaps a barrel."
    }), "\n", jsxRuntimeExports.jsx("img", {
      src: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwiDy9aXTykzy7ndc7vezC7DJfm6DsIaGwpiqZz5DGQjRF491lijN4r6MYZsGOegFfZc6f0MD9rgC7YiUTNO4Xu_DcGCwsLo2F_bRBLN3C4uc4Y6PV3jlk5vgoeD4s2rb_dGzG0isyNVTjy=s1360-w1360-h1020-rw"
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "The bathrooms were also decorated, with some cultist-prayers playing dimly over the speakers within."
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "All-in, the theming was OK. The drinks were well garnished, but there was not a ton of flair in the service and the overall look was a bit of a departure from what I was personally looking for. I do imagine that the service might have been a bit more ambitous earlier in the night, and would certainly be willing to give it another go."
    }), "\n", jsxRuntimeExports.jsxs(_components.h2, {
      id: "tiki-rating-table",
      children: ["Tiki Rating Table", jsxRuntimeExports.jsx(_components.a, {
        className: "heading-link",
        href: "#tiki-rating-table",
        children: jsxRuntimeExports.jsx(Anchor, {
          className: "heading-link-anchor",
          children: "#"
        })
      })]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "Placing Tiki bars in the table is a bit of a struggle for me, as I have two competing criteria in mind."
    }), "\n", jsxRuntimeExports.jsxs(_components.ul, {
      children: ["\n", jsxRuntimeExports.jsx(_components.li, {
        children: "The objective ratings of the drinks recieved, decor etc"
      }), "\n", jsxRuntimeExports.jsx(_components.li, {
        children: "The subjective experience that we had that day, which often comes down to who was with me, the conversation we had etc."
      }), "\n"]
    }), "\n", jsxRuntimeExports.jsx(_components.p, {
      children: "We visited Paradise Lost at the end of a long day, and this meant there was no food and service was starting to wane. I’d love to give it another go earlier in the night, for a fair shot, but as we experienced it I would place it below Tiki Chick and well underneath Sunken Harbor Club."
    }), "\n", jsxRuntimeExports.jsx(TikiTable, {})]
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? jsxRuntimeExports.jsx(MDXLayout, {
    ...props,
    children: jsxRuntimeExports.jsx(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + ("component" ) + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/tiki/paradise-lost/post.ts [vike:pluginModuleBanner] */
const paradiseLost = {
  mdx: MDXContent,
  publishDate: new Date(2025, 11, 30),
  slug: "paradise-lost",
  title: "Paradise Lost",
  description: `A short review of our trip to Paradise Lost, a tiki bar located in the East Village, NYC.`,
  tags: ["non-technical", "tiki", "review"]
};

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/posts/index.ts [vike:pluginModuleBanner] */
function partition(arr, size) {
  const result = [];
  const inProgress = [...arr];
  while (inProgress.length) {
    result.push(inProgress.splice(0, Math.min(size, inProgress.length)));
  }
  return result;
}
const ALL_BLOG_POSTS = [
  nxConfigurationHistory,
  githubPagesPreviewEnv,
  superpoweredGitAliases,
  multifunctionExampleFiles,
  githubUnlistedRepos,
  pineappleParlor,
  infernoRoom,
  traderSamsGrogGrotto,
  tikiChick,
  kaonaRoom,
  rumBarrelWest,
  konTiki,
  paradiseLost,
  sunkenHarborClub
];
const blogPosts = ALL_BLOG_POSTS.filter(
  (p) => p.publishDate.getTime() < Date.now()
).sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
const slugMap = Object.fromEntries(
  ALL_BLOG_POSTS.map((p) => [p.slug, p])
);
partition(blogPosts, 10);

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/utils/get-blog-url.ts [vike:pluginModuleBanner] */
function getBlogUrl(blogPost) {
  return `/blog/${formatDateString(blogPost.publishDate)}/${blogPost.slug}`;
}
function formatDateString(date) {
  return date.toISOString().replace(/T.*/, "");
}

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/components/post-context.ts [vike:pluginModuleBanner] */
const PostContext = reactExports.createContext(null);

export { PostContext as P, blogPosts as b, getBlogUrl as g, slugMap as s };
