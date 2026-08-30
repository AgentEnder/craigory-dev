import { r as __toESM } from "./chunk-Sg1e8hzK.js";
import { a as require_react, n as require_jsx_runtime } from "./chunk-B1F-4SL7.js";
//#region ../../libs/blog-posts/src/lib/posts/github-pages-preview-env/contents.mdx
var import_jsx_runtime = require_jsx_runtime();
function _createMdxContent$15(props) {
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
	}, { Anchor } = _components;
	if (!Anchor) _missingMdxReference$15("Anchor", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.h1, {
			id: "setting-up-preview-environments-for-github-pages",
			children: "Setting Up Preview Environments for GitHub Pages"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "GitHub Pages provides free hosting for static websites. It’s a great way to host your personal blog, portfolio, or documentation, and is in fact used to host this website. While it serves this purpose well, it is missing a feature that many newer hosting providers offer: preview environments." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "table-of-contents",
			children: "Table of Contents"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "#what-are-preview-environments",
				children: "What are preview environments?"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "#prerequisite-deploy-with-github-actions",
				children: "Prerequisite: Deploy with GitHub Actions"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "#thinking-about-preview-environments-and-github-pages",
				children: "Thinking About Preview Environments and GitHub Pages"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime.jsx)(_components.a, {
					href: "#setting-up-preview-environments",
					children: "Setting up Preview Environments"
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
					"\n",
					(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
						href: "#building-for-the-preview-environment",
						children: "Building for the Preview Environment"
					}) }),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
						href: "#deploying-to-the-preview-environment",
						children: "Deploying to the Preview Environment"
					}) }),
					"\n"
				] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "#commenting-on-pull-requests",
				children: "Commenting on Pull Requests"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "#cleaning-up-preview-environments",
				children: "Cleaning up Preview Environments"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "#summary-and-next-steps",
				children: "Summary and Next Steps"
			}) }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "what-are-preview-environments",
			children: ["What are preview environments?", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#what-are-preview-environments",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Preview environments are temporary environments that are created for each pull request. They allow you to preview your changes before merging them into the main branch. This is especially useful for static websites, where you can’t preview your changes locally. Vercel and Netlify both offer this feature, and leave a comment on the pull request with a link to the preview environment." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "prerequisite-deploy-with-github-actions",
			children: ["Prerequisite: Deploy with GitHub Actions", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#prerequisite-deploy-with-github-actions",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Before getting into the nitty-gritty of setting up preview environments, its important to have a good understanding of how deploying to GitHub Pages works. There are a variety of ways to deploy to GitHub Pages, and some official actions blocks that can make it easier. For this tutorial, we will ",
			(0, import_jsx_runtime.jsx)(_components.strong, { children: "not" }),
			" be using the official block or even a custom one. Instead, we will be using a different method to deploy that involves pushing the build artifacts to the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "gh-pages" }),
			" branch."
		] }),
		"\n",
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "In practice, the steps will look something like this:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Build the website" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Initialize a new git repository in the build directory" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Commit the build artifacts" }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"Force push the build artifacts to the ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "gh-pages" }),
				" branch"
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This creates a branch in the repository that has an unrelated history to the main branch, containing a single commit that represents the current build. This is the branch that GitHub Pages will use to serve the website. I typically set this up as a GitHub action that either runs on push or on workflow_dispatch. An example script that does this is below:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, {
			filename: ".github/workflows/deploy.yml",
			children: (0, import_jsx_runtime.jsxs)(_components.code, {
				className: "hljs language-yaml",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "name:"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "Nightly"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "Deployment"
					}),
					"\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "on:"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "schedule:"
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-bullet",
						children: "-"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "cron:"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'0 0 * * *'"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "push:"
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "branches:"
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-bullet",
						children: "-"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "main"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "workflow_dispatch:"
					}),
					"\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "jobs:"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "deploy:"
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "runs-on:"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "ubuntu-latest"
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "permissions:"
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "contents:"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "write"
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "id-token:"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "write"
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "pages:"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "write"
					}),
					"\n\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "steps:"
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-bullet",
						children: "-"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "name:"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "Checkout"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "code"
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "uses:"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "actions/checkout@v2"
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "with:"
					}),
					"\n          ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "fetch-depth:"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-number",
						children: "0"
					}),
					"\n\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-bullet",
						children: "-"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "name:"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "Setup"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "Node.js"
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "uses:"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "actions/setup-node@v4"
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "with:"
					}),
					"\n          ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "node-version:"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'22.5.1'"
					}),
					"\n          ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "cache:"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'npm'"
					}),
					"\n\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-bullet",
						children: "-"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "name:"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "Install"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "dependencies"
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "run:"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "npm"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "ci"
					}),
					"\n\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-bullet",
						children: "-"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "name:"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "Setup"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "Git"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "User"
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "run:"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "|\n          git config --global user.name \"${GITHUB_ACTOR}\"\n          git config --global user.email \"${GITHUB_ACTOR}@users.noreply.github.com\"\n"
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-comment",
						children: "# Add your deployment steps here"
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-bullet",
						children: "-"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "name:"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "Deploy"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "to"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "production"
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "run:"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "|\n          node ./node_modules/.bin/nx build craigory-dev\n          node ./tools/scripts/deploy.js\n"
					})
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "deploy.js" }),
			" script is a short script that does the following:"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, {
			filename: "tools/scripts/deploy.js",
			children: (0, import_jsx_runtime.jsxs)(_components.code, {
				className: "hljs language-javascript",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" { execSync } = ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-built_in",
						children: "require"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'child_process'"
					}),
					");\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "BUILD_DIR"
					}),
					" = ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'dist/apps/craigory-dev'"
					}),
					";\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "GH_PAGES_BRANCH"
					}),
					" = ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'gh-pages'"
					}),
					";\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "REMOTE_URL"
					}),
					" = ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'https://github.com/agentender/craigory-dev.git'"
					}),
					";\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-comment",
						children: "// Create a new git repository in build directory, pointing to this repository"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "execSync"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "`git init`"
					}),
					", { ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "cwd"
					}),
					": ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "BUILD_DIR"
					}),
					" });\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "execSync"
					}),
					"(",
					(0, import_jsx_runtime.jsxs)(_components.span, {
						className: "hljs-string",
						children: [
							"`git remote add origin ",
							(0, import_jsx_runtime.jsx)(_components.span, {
								className: "hljs-subst",
								children: "${REMOTE_URL}"
							}),
							"`"
						]
					}),
					", { ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "cwd"
					}),
					": ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "BUILD_DIR"
					}),
					" });\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-comment",
						children: "// Commit the build artifacts"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "execSync"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "`git add .`"
					}),
					", { ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "cwd"
					}),
					": ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "BUILD_DIR"
					}),
					" });\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "execSync"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "`git commit -m \"Deploy\"`"
					}),
					", { ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "cwd"
					}),
					": ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "BUILD_DIR"
					}),
					" });\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-comment",
						children: "// Force push the build artifacts to the `gh-pages` branch, overwriting any existing history"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "execSync"
					}),
					"(",
					(0, import_jsx_runtime.jsxs)(_components.span, {
						className: "hljs-string",
						children: [
							"`git push origin --force HEAD:",
							(0, import_jsx_runtime.jsx)(_components.span, {
								className: "hljs-subst",
								children: "${GH_PAGES_BRANCH}"
							}),
							"`"
						]
					}),
					", { ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "cwd"
					}),
					": ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "BUILD_DIR"
					}),
					" });\n"
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"When a push is made to the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "gh-pages" }),
			" branch, there is a built-in action that will deploy the website. This is how I typically setup “production” deployments to GitHub Pages."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "thinking-about-preview-environments-and-github-pages",
			children: ["Thinking About Preview Environments and GitHub Pages", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#thinking-about-preview-environments-and-github-pages",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "GitHub Pages only allows a single deployment per repository. This means that we can’t strictly follow the same pattern as Vercel or Netlify, where each pull request gets its own deployment. Additionally, if we want to isolate our preview environments from the main branch we can’t use the same ‘gh-pages’ branch for both preview environments and production." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"This has led me to typically deploy production build artifacts to a separate repository on GitHub. The only changes required to the above script are to change the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "REMOTE_URL" }),
			" to point to the new repository. This allows me to have a separate repository for the production build artifacts, and point the current ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "gh-pages" }),
			" branch of this repository to a subdomain of the production website."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"GitHub pages only supports static web apps. This means that the build artifacts on disk are directly served to the user. We can use this to our advantage by pushing the build artifacts of the preview environment to a subdirectory of the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "gh-pages" }),
			" branch. This will surface as a url like: ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "${username}.github.io/${repository}/${whatever-directory-you-choose}" }),
			". By picking subdirectories based on the pull request number, we can form predictable, short urls that are human readable. This is the approach I outline below."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "setting-up-preview-environments",
			children: ["Setting up Preview Environments", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#setting-up-preview-environments",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Knowing how this will be structured, we can break the problem down into a few steps:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Build the website on the PR branch" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Create a new temporary folder called ‘gh-pages-root’ in the repository" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Initialize a new git repository in the ‘gh-pages-root’ folder" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Copy the build artifacts to a subdirectory of ‘gh-pages-root’" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Commit the build artifacts" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Sync the ‘gh-pages-root’ folder with the ‘gh-pages’ branch" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Push the changes to the ‘gh-pages’ branch" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "building-for-the-preview-environment",
			children: ["Building for the Preview Environment", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#building-for-the-preview-environment",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		"\n",
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"This should be ",
			(0, import_jsx_runtime.jsx)(_components.strong, { children: "very" }),
			" similar to your current build script. The main thing that needs to change is that the base url for your page will not be ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "/" }),
			" on the preview environment. Depending on how your web app is built, this will require different changes. This website (craigory.dev) is built using ",
			(0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://vike.dev",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "Vike"
			}),
			", a framework built on top of Vite. Vike supports passing in the base url via the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "base" }),
			" property in the vite config, which can be overridden on the CLI. As such, I am building the preview environment with a command like:"
		] }),
		"\n",
		"\n",
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, { children: (0, import_jsx_runtime.jsxs)(_components.code, {
			className: "hljs language-bash",
			children: [
				"nx run craigory-dev:build --base /pr/",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-variable",
					children: "${PR_NUMBER}"
				}),
				"/\n"
			]
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Documentation about how to set the base url for different frameworks can be found here:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://vitejs.dev/config/shared-options.html#base",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "Vite"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime.jsx)(_components.a, {
					href: "https://angular.dev/guide/routing/common-router-tasks#base-href",
					rel: "noopener noreferrer",
					target: "_blank",
					children: "Angular"
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
					"\n",
					(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
						href: "https://analogjs.org/docs/features/data-fetching/server-side-data-fetching#setting-the-public-base-url",
						rel: "noopener noreferrer",
						target: "_blank",
						children: "Analog JS"
					}) }),
					"\n"
				] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://mademistakes.com/mastering-jekyll/site-url-baseurl/",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "Jekyll"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "Gatsby"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://nextjs.org/docs/api-reference/next.config.js/basepath",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "Next.js"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://gohugo.io/methods/site/baseurl/",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "Hugo"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://docusaurus.io/docs/deployment#configuration",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "Docusaurus"
			}) }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "For other frameworks, you’ll need to find the equivalent way to pass in the base url. This is important because the base url is used to resolve assets or any relative paths, and if it is incorrect your website will not load correctly." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "deploying-to-the-preview-environment",
			children: ["Deploying to the Preview Environment", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#deploying-to-the-preview-environment",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This is a bit more involved than the previous script, but is made up of the same basic steps. The script below will do this:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, {
			filename: "tools/scripts/deploy-preview.js",
			children: (0, import_jsx_runtime.jsxs)(_components.code, {
				className: "hljs language-javascript",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" { execSync } = ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-built_in",
						children: "require"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'child_process'"
					}),
					");\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" fs = ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-built_in",
						children: "require"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'fs'"
					}),
					");\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" path = ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-built_in",
						children: "require"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'path'"
					}),
					");\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "BUILD_DIR"
					}),
					" = ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'dist/apps/craigory-dev'"
					}),
					";\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "GH_PAGES_ROOT"
					}),
					" = ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'gh-pages-root'"
					}),
					";\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "GH_PAGES_BRANCH"
					}),
					" = ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'gh-pages'"
					}),
					";\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "REMOTE_URL"
					}),
					" = ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'...'"
					}),
					"; ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-comment",
						children: "// This should be the url of the repository that will host the preview build artifacts"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "PR_NUMBER"
					}),
					" = process.",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-property",
						children: "env"
					}),
					".",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-property",
						children: "PR_NUMBER"
					}),
					"; ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-comment",
						children: "// This should be passed in as an environment variable"
					}),
					"\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-comment",
						children: "// Create a new git repository in the 'gh-pages-root' folder, pointing to this repository"
					}),
					"\nfs.",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "mkdirSync"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "GH_PAGES_ROOT"
					}),
					", { ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "recursive"
					}),
					": ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-literal",
						children: "true"
					}),
					" });\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "execSync"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "`git init`"
					}),
					", { ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "cwd"
					}),
					": ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "GH_PAGES_ROOT"
					}),
					" });\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "execSync"
					}),
					"(",
					(0, import_jsx_runtime.jsxs)(_components.span, {
						className: "hljs-string",
						children: [
							"`git remote add origin ",
							(0, import_jsx_runtime.jsx)(_components.span, {
								className: "hljs-subst",
								children: "${REMOTE_URL}"
							}),
							"`"
						]
					}),
					", { ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "cwd"
					}),
					": ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "GH_PAGES_ROOT"
					}),
					" });\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-comment",
						children: "// Copy the build artifacts to a subdirectory of 'gh-pages-root'"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" dest = path.",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "join"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "GH_PAGES_ROOT"
					}),
					", ",
					(0, import_jsx_runtime.jsxs)(_components.span, {
						className: "hljs-string",
						children: [
							"`pr/",
							(0, import_jsx_runtime.jsx)(_components.span, {
								className: "hljs-subst",
								children: "${PR_NUMBER}"
							}),
							"`"
						]
					}),
					");\nfs.",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "mkdirSync"
					}),
					"(dest, { ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "recursive"
					}),
					": ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-literal",
						children: "true"
					}),
					" });\nfs.",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "cpSync"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "BUILD_DIR"
					}),
					", dest);\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-comment",
						children: "// Commit the build artifacts"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "execSync"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "`git add .`"
					}),
					", { ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "cwd"
					}),
					": ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "GH_PAGES_ROOT"
					}),
					" });\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "execSync"
					}),
					"(",
					(0, import_jsx_runtime.jsxs)(_components.span, {
						className: "hljs-string",
						children: [
							"`git commit -m \"Deploy preview ",
							(0, import_jsx_runtime.jsx)(_components.span, {
								className: "hljs-subst",
								children: "${PR_NUMBER}"
							}),
							"\"`"
						]
					}),
					", { ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "cwd"
					}),
					": ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "GH_PAGES_ROOT"
					}),
					" });\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-comment",
						children: "// Sync the 'gh-pages-root' folder with the 'gh-pages' branch"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "execSync"
					}),
					"(",
					(0, import_jsx_runtime.jsxs)(_components.span, {
						className: "hljs-string",
						children: [
							"`git fetch origin ",
							(0, import_jsx_runtime.jsx)(_components.span, {
								className: "hljs-subst",
								children: "${GH_PAGES_BRANCH}"
							}),
							"`"
						]
					}),
					", { ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "cwd"
					}),
					": ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "GH_PAGES_ROOT"
					}),
					" });\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-comment",
						children: "// The --allow-unrelated-histories flag is required because the 'gh-pages' branch has no history"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "execSync"
					}),
					"(",
					(0, import_jsx_runtime.jsxs)(_components.span, {
						className: "hljs-string",
						children: [
							"`git merge origin/",
							(0, import_jsx_runtime.jsx)(_components.span, {
								className: "hljs-subst",
								children: "${GH_PAGES_BRANCH}"
							}),
							" --allow-unrelated-histories`"
						]
					}),
					", {\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "cwd"
					}),
					": ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "GH_PAGES_ROOT"
					}),
					",\n});\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-comment",
						children: "// Push the changes to the 'gh-pages' branch"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "execSync"
					}),
					"(",
					(0, import_jsx_runtime.jsxs)(_components.span, {
						className: "hljs-string",
						children: [
							"`git push origin HEAD:",
							(0, import_jsx_runtime.jsx)(_components.span, {
								className: "hljs-subst",
								children: "${GH_PAGES_BRANCH}"
							}),
							"`"
						]
					}),
					", { ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "cwd"
					}),
					": ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "GH_PAGES_ROOT"
					}),
					" });\n"
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Run this script on every pull request. It will create a new subdirectory in the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "gh-pages-root" }),
			" folder, copy the build artifacts to it, and push the changes to the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "gh-pages" }),
			" branch. This is enough to have functioning preview environments for your GitHub Pages, minus a few nice-to-haves that other hosting providers offer."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "commenting-on-pull-requests",
			children: ["Commenting on Pull Requests", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#commenting-on-pull-requests",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Its helpful to leave a comment on the pull request with a link to the preview environment. This can be done with the GitHub API, and is a nice touch that makes it easier for reviewers to see the changes. For a full example of how to do this, I’d recommend checking the script in this repository found ",
			(0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://github.com/agentender/craigory-dev/blob/main/tools/update-preview-comment.ts",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "here"
			}),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "cleaning-up-preview-environments",
			children: ["Cleaning up Preview Environments", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#cleaning-up-preview-environments",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Preview environments are temporary, so clean them up after the pull request is closed. While its not paramount to do this, it can be helpful to keep the repository clean and avoid your GitHub Pages deployment size growing too large." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"This can be done with a short script that deletes the subdirectory in the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "gh-pages-root" }),
			" folder. This script can be run on pull request close, or on a schedule. An example script that does this is below:"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, {
			filename: "tools/scripts/cleanup-preview.js",
			children: (0, import_jsx_runtime.jsxs)(_components.code, {
				className: "hljs language-javascript",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" fs = ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-built_in",
						children: "require"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'fs'"
					}),
					");\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" path = ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-built_in",
						children: "require"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'path'"
					}),
					");\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" { execSync } = ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-built_in",
						children: "require"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'child_process'"
					}),
					");\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "GH_PAGES_ROOT"
					}),
					" = ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'gh-pages-root'"
					}),
					";\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "PR_NUMBER"
					}),
					" = process.",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-property",
						children: "env"
					}),
					".",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-property",
						children: "PR_NUMBER"
					}),
					"; ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-comment",
						children: "// This should be passed in as an environment variable"
					}),
					"\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-comment",
						children: "// Remove PR directory"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" dest = path.",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "join"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "GH_PAGES_ROOT"
					}),
					", ",
					(0, import_jsx_runtime.jsxs)(_components.span, {
						className: "hljs-string",
						children: [
							"`pr/",
							(0, import_jsx_runtime.jsx)(_components.span, {
								className: "hljs-subst",
								children: "${PR_NUMBER}"
							}),
							"`"
						]
					}),
					");\nfs.",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "rmSync"
					}),
					"(dest, { ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "recursive"
					}),
					": ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-literal",
						children: "true"
					}),
					" });\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-comment",
						children: "// Commit the removal"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "execSync"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "`git add .`"
					}),
					", { ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "cwd"
					}),
					": ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "GH_PAGES_ROOT"
					}),
					" });\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "execSync"
					}),
					"(",
					(0, import_jsx_runtime.jsxs)(_components.span, {
						className: "hljs-string",
						children: [
							"`git commit -m \"Remove preview ",
							(0, import_jsx_runtime.jsx)(_components.span, {
								className: "hljs-subst",
								children: "${PR_NUMBER}"
							}),
							"\"`"
						]
					}),
					", { ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "cwd"
					}),
					": ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "GH_PAGES_ROOT"
					}),
					" });\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-comment",
						children: "// Push the changes to the 'gh-pages' branch"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "execSync"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "`git push origin HEAD:gh-pages`"
					}),
					", { ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "cwd"
					}),
					": ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable constant_",
						children: "GH_PAGES_ROOT"
					}),
					" });\n"
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "A few things to note about this script:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "It should be ran in a GitHub action that runs on PR close." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Pass it the PR number as an environment variable." }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"It should checkout the ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "gh-pages" }),
				" branch before running the script."
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Alternatively, if you are running the job on a schedule you could remove any PR directories that are older than a certain age. This would be a bit more involved, but is a good way to keep the repository clean but give preview environments a bit more longevity. This is the path this repository has taken, and the script can be found ",
			(0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://github.com/agentender/craigory-dev/blob/main/tools/cleanup-old-deployments.ts",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "here"
			}),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Regardless of which approach you take, one caveat to keep in mind is that since the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "gh-pages" }),
			" branch is checked out instead of your typical ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "main" }),
			" branch, any script that needs to be ran will need to be present inside the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "gh-pages" }),
			" branch. With our publishing strategy this is not a given, so you’ll need to workaround it. In this repository’s case I’ve added a command into the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "cleanup-pr-deployments.yml" }),
			" workflow that downloads the latest version of the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "gh-pages" }),
			" branch before running the cleanup script. You could also update the deployment script to include the tools folder as part of the build artifacts, but that may not be desired."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "summary-and-next-steps",
			children: ["Summary and Next Steps", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#summary-and-next-steps",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "We’ve covered a bit of how basic GitHub Pages deployments work, as well as how to shift that to support preview environments. This is a great way to get a bit more out of your GitHub Pages deployment without having to change hosting providers, and can be a good way to preview changes before merging them into the main branch." })
	] });
}
function MDXContent$15(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime.jsx)(_createMdxContent$15, { ...props })
	}) : _createMdxContent$15(props);
}
function _missingMdxReference$15(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/github-pages-preview-env/post.ts
var githubPagesPreviewEnv = {
	mdx: MDXContent$15,
	publishDate: new Date(2024, 6, 23),
	slug: "gh-pages-preview-env",
	title: "Setting up a GitHub Pages Preview Environment",
	description: `Many services such as Vercel and Netlify offer preview environments for pull requests, but GitHub Pages does not. This post will walk you through how to set up a GitHub Pages preview environment for your pull requests.`,
	tags: [
		"technical",
		"github",
		"devops",
		"tutorial"
	]
};
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/github-unlisted-repos/contents.mdx
function _createMdxContent$14(props) {
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
	}, { Anchor, LinkToPost } = _components;
	if (!Anchor) _missingMdxReference$14("Anchor", true);
	if (!LinkToPost) _missingMdxReference$14("LinkToPost", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.h1, {
			id: "unlisted-github-repositories",
			children: "Unlisted GitHub Repositories"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Services such as YouTube provide support for unlisted videos. This allows publishing a video that is publicly accessible, but only via a direct link. This is useful for sharing content with a select group of people. It can be used for getting early feedback on a video draft, or for sharing a video with a client before it goes live." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "GitHub repositories have no equivalent feature, but the need still exists. Some reasons I’ve needed this feature include:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Sharing issue reproductions" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Sharing more complex code snippets like multifile gists" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "These could both technically be done as a public repository, but it clutters up the profile and makes it harder to find the repositories that are actually meaningful." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "unrelated-branches",
			children: ["Unrelated Branches", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#unrelated-branches",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "A git repository frequently has many branches of code, typically waiting to be merged into the main branch. Branches, however, do not necessarily have to be related to the main branch. As such, you can push any branch to any repository, even if they don’t share a common ancestor." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This is the key to our approach of creating unlisted repositories." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "steps-to-create-an-unlisted-repository",
			children: ["Steps to Create an Unlisted Repository", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#steps-to-create-an-unlisted-repository",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Create a “host” repository that will contain all your unlisted repositories. This repository will be public, but not contain code on the main branch. It differs from other repositories in that it will contain many branches, each representing a different unlisted repository. I’d recommend adding a README to this repository that explains the purpose of the repository and how to use it." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "For example, I use https://github.com/agentender/github-issues as my host repository." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ol, {
			start: "2",
			children: [
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.li, { children: [
					"\n",
					(0, import_jsx_runtime.jsx)(_components.p, { children: "Create or open the repository that will be published as unlisted. Only the checked out branch will be shared." }),
					"\n"
				] }),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.li, { children: [
					"\n",
					(0, import_jsx_runtime.jsx)(_components.p, { children: "Run the following command to push the branch to the host repository:" }),
					"\n"
				] }),
				"\n"
			]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, { children: (0, import_jsx_runtime.jsxs)(_components.code, {
			className: "hljs language-bash",
			children: [
				"git push ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-variable",
					children: "$HOST_REPO_REMOTE_URL"
				}),
				" HEAD:",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-variable",
					children: "$BRANCH_NAME"
				}),
				"\n"
			]
		}) }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"You should replace ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "$HOST_REPO_REMOTE_URL" }),
			" with the URL of the host repository and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "$BRANCH_NAME" }),
			" with the name you want to use when sharing the branch."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ol, {
			start: "4",
			children: [
				"\n",
				(0, import_jsx_runtime.jsx)(_components.li, { children: "Share the URL of the branch with the people you want to have access to it." }),
				"\n"
			]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The link should look something like this:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, { children: (0, import_jsx_runtime.jsx)(_components.code, {
			className: "hljs language-plaintext",
			children: "https://github.com/{user}/{host-repo}/tree/{branch-name}\n"
		}) }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "supporting-infra",
			children: ["Supporting Infra", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#supporting-infra",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "If you plan to use this semi-frequently, I’d recommend creating a script or git alias to simplify the process. Here’s an example script I use:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, { children: (0, import_jsx_runtime.jsxs)(_components.code, {
			className: "hljs language-js",
			children: [
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-variable constant_",
					children: "REMOTE_URL"
				}),
				" = ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'https://github.com/agentender/github-issues'"
				}),
				";\n\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" tryExec = ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-built_in",
					children: "require"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'./utils/try-exec'"
				}),
				");\n\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "function"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "prompt"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-params",
					children: "message"
				}),
				") {\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "return"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "new"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title class_",
					children: "Promise"
				}),
				"(",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "hljs-function",
					children: [
						"(",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-params",
							children: "resolve"
						}),
						") =>"
					]
				}),
				" {\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" readline = ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-built_in",
					children: "require"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'readline'"
				}),
				").",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "createInterface"
				}),
				"({\n      ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "input"
				}),
				": process.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "stdin"
				}),
				",\n      ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "output"
				}),
				": process.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "stdout"
				}),
				",\n    });\n    readline.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "question"
				}),
				"(message, ",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "hljs-function",
					children: [
						"(",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-params",
							children: "answer"
						}),
						") =>"
					]
				}),
				" {\n      readline.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "close"
				}),
				"();\n      ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "resolve"
				}),
				"(answer);\n    });\n    readline.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "on"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'SIGINT'"
				}),
				", ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-function",
					children: "() =>"
				}),
				" {\n      readline.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "close"
				}),
				"();\n      process.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "stdout"
				}),
				".",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "write"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'\\n'"
				}),
				");\n      ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-variable language_",
					children: "console"
				}),
				".",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "log"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'Aborted.'"
				}),
				");\n      process.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "exit"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-number",
					children: "1"
				}),
				");\n    });\n  });\n}\n\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "function"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "isForced"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, { className: "hljs-params" }),
				") {\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "return"
				}),
				" process.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "argv"
				}),
				".",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "includes"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'--force'"
				}),
				") || process.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "argv"
				}),
				".",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "includes"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'-f'"
				}),
				");\n}\n\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "async"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "function"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "checkIfBranchAlreadyOnRemote"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-params",
					children: "branch"
				}),
				") {\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" { code } = ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "await"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "tryExec"
				}),
				"(\n    ",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "hljs-string",
					children: [
						"`git ls-remote --exit-code ",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-subst",
							children: "${REMOTE_URL}"
						}),
						" ",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-subst",
							children: "${branch}"
						}),
						"`"
					]
				}),
				",\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-literal",
					children: "true"
				}),
				"\n  );\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "return"
				}),
				" code === ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-number",
					children: "0"
				}),
				";\n}\n\n(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "async"
				}),
				" () => {\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" forced = ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "isForced"
				}),
				"();\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" currentBranchName = (\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "await"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "tryExec"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'git rev-parse --abbrev-ref HEAD'"
				}),
				", ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-literal",
					children: "true"
				}),
				")\n  ).",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "stdout"
				}),
				".",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "trim"
				}),
				"();\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "let"
				}),
				" branch = currentBranchName;\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "if"
				}),
				" (currentBranchName === ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'master'"
				}),
				" || currentBranchName === ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'main'"
				}),
				") {\n    branch = ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "await"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "prompt"
				}),
				"(\n      ",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "hljs-string",
					children: [
						"`What branch would you like to publish to?",
						(0, import_jsx_runtime.jsxs)(_components.span, {
							className: "hljs-subst",
							children: [
								"${\n        forced ? ",
								(0, import_jsx_runtime.jsx)(_components.span, {
									className: "hljs-string",
									children: "' (Any existing contents will be overwritten)'"
								}),
								" : ",
								(0, import_jsx_runtime.jsx)(_components.span, {
									className: "hljs-string",
									children: "''"
								}),
								"\n      }"
							]
						}),
						"`"
					]
				}),
				"\n    );\n  }\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "while"
				}),
				" (!forced && (",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "await"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "checkIfBranchAlreadyOnRemote"
				}),
				"(branch))) {\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" next = ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "await"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "prompt"
				}),
				"(\n      ",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "hljs-string",
					children: [
						"`Branch ",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-subst",
							children: "${branch}"
						}),
						" already exists on remote. What branch would you like to publish to?`"
					]
				}),
				"\n    );\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "if"
				}),
				" (next === ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "''"
				}),
				") {\n      ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-variable language_",
					children: "console"
				}),
				".",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "log"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'Aborted.'"
				}),
				");\n      process.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "exit"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-number",
					children: "1"
				}),
				");\n    }\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "if"
				}),
				" (branch) branch = next;\n  }\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "await"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "tryExec"
				}),
				"(",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "hljs-string",
					children: [
						"`git push ",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-subst",
							children: "${REMOTE_URL}"
						}),
						" ",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-subst",
							children: "${currentBranchName}"
						}),
						":",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-subst",
							children: "${branch}"
						}),
						"`"
					]
				}),
				");\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-variable language_",
					children: "console"
				}),
				".",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "log"
				}),
				"(",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "hljs-string",
					children: [
						"`✅ Published branch at ",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-subst",
							children: "${REMOTE_URL}"
						}),
						"/tree/",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-subst",
							children: "${branch}"
						}),
						"`"
					]
				}),
				");\n})();\n"
			]
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Wrapping the process in a script makes it easier to use, and ensures consistency. This also gives a spot to add additional checks or features in the future." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The example script above for example:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Prevents accidentally overwriting an existing branch" }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"Prompts for branch name if the current branch is ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "master" }),
				" or ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "main" }),
				", or would otherwise overwrite an existing branch"
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"Allows forcing the push with ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "--force" }),
				" or ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "-f" })
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: ["If you setup a script like this, you can add it as a git alias to make it easier to use. I’ve covered how to do this in a previous post: ", (0, import_jsx_runtime.jsx)(LinkToPost, {
			ref: props.post,
			slug: "superpowered-git-aliases"
		})] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "wrapping-up",
			children: ["Wrapping Up", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#wrapping-up",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This isn’t as good as native support for unlisted repositories, but it’s a good workaround. Sharing reproductions will no longer clutter up your profile, and you can share more complex code snippets without needing to create a new repository for each one. Of note, this approach has limitations that native support would not." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Repo’s shared with this manner:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Can not really have more than one branch" }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"Can not have issues or pull requests",
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
					"\n",
					(0, import_jsx_runtime.jsx)(_components.li, { children: "This also makes it hard to test things like GitHub Actions or similar" }),
					"\n"
				] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Can be found by anyone with access to the host repository" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "With that said, I still think this is a useful tool to have in your toolbox." })
	] });
}
function MDXContent$14(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime.jsx)(_createMdxContent$14, { ...props })
	}) : _createMdxContent$14(props);
}
function _missingMdxReference$14(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/github-unlisted-repos/post.ts
var githubUnlistedRepos = {
	mdx: MDXContent$14,
	publishDate: new Date(2024, 8, 11),
	slug: "gh-unlisted-repos",
	title: "Unlisted GitHub Repositories",
	description: `There are times where you may want to have a publicly accessible repository on GitHub, but you don't want it to show up on your profile. Many video hosting services like YouTube have support for this, but GitHub does not. This post explores an alternative strategy.`,
	tags: [
		"technical",
		"github",
		"tutorial"
	]
};
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/multifunctional-example-files/contents.mdx
function _createMdxContent$13(props) {
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
	}, { Anchor } = _components;
	if (!Anchor) _missingMdxReference$13("Anchor", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.h1, {
			id: "multifunctional-example-files",
			children: "Multifunctional Example Files"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "I’ve started using a technique I’m calling “multifunctional example files” in recent projects. Using this technique, I’m able to create a single example file, and each example file becomes both:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "A page in the documentation" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "An actual typescript file, which can be played around with if you clone the project" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "An E2E test" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This technique has been awesome, because it ensures that the documentation is always up-to-date with the code. If the documentation is out-of-date, the E2E test will fail." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Projects currently using this technique:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://github.com/agentender/flexi-bench",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "FlexiBench"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://github.com/agentender/cli-forge",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "CLI Forge"
			}) }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "limitations",
			children: ["Limitations", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#limitations",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This technique has a few limitations, but its also easy to extend so these could be worked around. Currently, as implemented, the technique only really works if your examples can easily be written in a single file. If you wish to have a more complex example that spans multiple files, you’d need to tweak the technique a bit." }),
		"\n",
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "how-it-works",
			children: ["How it works", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#how-it-works",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The technique is made up of 3 main parts:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The example files themselves" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "A small docusaurus plugin to generate pages from the example files" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "A small script to run the E2E tests based on the example files" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "example-files",
			children: ["Example Files", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#example-files",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "These are regular typescript files, with the only difference being that they have some yaml frontmatter at the top of the file. This frontmatter is used to generate the documentation page and provide data to the E2E test. As an example, consider something like below:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, { children: (0, import_jsx_runtime.jsxs)(_components.code, {
			className: "hljs language-typescript",
			children: [
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-comment",
					children: "// ---"
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-comment",
					children: "// title: Example Title"
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-comment",
					children: "// description: Example Description"
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-comment",
					children: "// ---"
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "export"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" example = ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'example'"
				}),
				";\n"
			]
		}) }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "docusaurus-plugin",
			children: ["Docusaurus Plugin", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#docusaurus-plugin",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The docusaurus plugin scans the examples directory, loads the contents of each file and parses out the frontmatter. The frontmatter is then stripped from the rest of the file, and the entire contents is then used to build a markdown file. The plugin code should look something like this:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, { children: (0, import_jsx_runtime.jsxs)(_components.code, {
			className: "hljs language-typescript",
			children: [
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "import"
				}),
				" { ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title class_",
					children: "LoadContext"
				}),
				" } ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "from"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'@docusaurus/types'"
				}),
				";\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "import"
				}),
				" { workspaceRoot } ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "from"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'@nx/devkit'"
				}),
				";\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "import"
				}),
				" {\n  blockQuote,\n  codeBlock,\n  h1,\n  h2,\n  lines,\n  link,\n  ul,\n} ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "from"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'markdown-factory'"
				}),
				";\n\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "import"
				}),
				" { mkdirSync, readFileSync, readdirSync, writeFileSync } ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "from"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'node:fs'"
				}),
				";\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "import"
				}),
				" { basename, dirname, join, sep } ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "from"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'node:path'"
				}),
				";\n\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "import"
				}),
				" { parse ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "as"
				}),
				" loadYaml, stringify } ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "from"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'yaml'"
				}),
				";\n\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "export"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "async"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "function"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "ExamplesDocsPlugin"
				}),
				"(",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "hljs-params",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-attr",
							children: "context"
						}),
						": ",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-title class_",
							children: "LoadContext"
						})
					]
				}),
				") {\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" examplesRoot = ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "join"
				}),
				"(workspaceRoot, ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'examples'"
				}),
				") + sep;\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" examples = ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "collectExamples"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "join"
				}),
				"(examplesRoot, ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'../examples'"
				}),
				"));\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "for"
				}),
				" (",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" example ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "of"
				}),
				" examples) {\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" relative = example.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "path"
				}),
				".",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "replace"
				}),
				"(examplesRoot, ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "''"
				}),
				");\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" destination = ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "join"
				}),
				"(\n      __dirname,\n      ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'../../docs/examples'"
				}),
				",\n      relative.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "replace"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'.ts'"
				}),
				", ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'.md'"
				}),
				")\n    );\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "ensureDirSync"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "dirname"
				}),
				"(destination));\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "writeFileSync"
				}),
				"(destination, ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "formatExampleMd"
				}),
				"(example));\n  }\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "ensureDirSync"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "join"
				}),
				"(__dirname, ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'../../docs/examples'"
				}),
				"));\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "writeFileSync"
				}),
				"(\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "join"
				}),
				"(__dirname, ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'../../docs/examples/index.md'"
				}),
				"),\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "formatIndexMd"
				}),
				"(examples)\n  );\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "return"
				}),
				" {\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-comment",
					children: "// a unique name for this plugin"
				}),
				"\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "name"
				}),
				": ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'examples-docs-plugin'"
				}),
				",\n  };\n}\n\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "type"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title class_",
					children: "FrontMatter"
				}),
				" = {\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "id"
				}),
				": ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-built_in",
					children: "string"
				}),
				";\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "title"
				}),
				": ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-built_in",
					children: "string"
				}),
				";\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "description"
				}),
				"?: ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-built_in",
					children: "string"
				}),
				";\n};\n\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "function"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "loadExampleFile"
				}),
				"(",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "hljs-params",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-attr",
							children: "path"
						}),
						": ",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-built_in",
							children: "string"
						})
					]
				}),
				"): {\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "contents"
				}),
				": ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-built_in",
					children: "string"
				}),
				";\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "data"
				}),
				": ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title class_",
					children: "FrontMatter"
				}),
				";\n} {\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" contents = ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "readFileSync"
				}),
				"(path, ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'utf-8'"
				}),
				");\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" lines = contents.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "split"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'\\n'"
				}),
				");\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" frontMatterLines = [];\n\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "let"
				}),
				" line = lines.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "shift"
				}),
				"();\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "if"
				}),
				" (line && line.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "startsWith"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'// ---'"
				}),
				")) {\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "while"
				}),
				" (",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-literal",
					children: "true"
				}),
				") {\n      line = lines.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "shift"
				}),
				"();\n      ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "if"
				}),
				" (!line) {\n        ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "throw"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "new"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title class_",
					children: "Error"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'Unexpected end of file'"
				}),
				");\n      }\n      ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "if"
				}),
				" (line.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "startsWith"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'// ---'"
				}),
				")) {\n        ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "break"
				}),
				";\n      } ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "else"
				}),
				" {\n        frontMatterLines.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "push"
				}),
				"(line.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "replace"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-regexp",
					children: "/^\\/\\/\\s?/"
				}),
				", ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "''"
				}),
				"));\n      }\n    }\n  } ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "else"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "if"
				}),
				" (line) {\n    lines.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "unshift"
				}),
				"(line);\n  }\n\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" yaml = frontMatterLines.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "join"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'\\n'"
				}),
				");\n\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "return"
				}),
				" {\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "contents"
				}),
				": lines.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "join"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'\\n'"
				}),
				"),\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "data"
				}),
				": yaml ? ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "loadYaml"
				}),
				"(yaml) : {},\n  };\n}\n\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "function"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "formatExampleMd"
				}),
				"(",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "hljs-params",
					children: [
						"{\n  contents,\n  data,\n}: ",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-title class_",
							children: "ReturnType"
						}),
						"<",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-keyword",
							children: "typeof"
						}),
						" collectExamples>[",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-built_in",
							children: "number"
						}),
						"]"
					]
				}),
				"): ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-built_in",
					children: "string"
				}),
				" {\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" bodyLines = [",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "h1"
				}),
				"(data.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "title"
				}),
				")];\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "if"
				}),
				" (data.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "description"
				}),
				") {\n    bodyLines.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "push"
				}),
				"(data.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "description"
				}),
				");\n  }\n  bodyLines.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "push"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "h2"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'Code'"
				}),
				"));\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "return"
				}),
				" ",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "hljs-string",
					children: [
						"`---\n",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-subst",
							children: "${stringify(data)}"
						}),
						"hide_title: true\n---\n",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-subst",
							children: "${lines(bodyLines)}"
						}),
						"\n\\`\\`\\`ts title=\"",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-subst",
							children: "${data.title}"
						}),
						"\" showLineNumbers\n",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-subst",
							children: "${contents}"
						}),
						"\n\\`\\`\\`\n  `"
					]
				}),
				";\n}\n\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "function"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "formatIndexMd"
				}),
				"(",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "hljs-params",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-attr",
							children: "examples"
						}),
						": ",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-title class_",
							children: "ReturnType"
						}),
						"<",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-keyword",
							children: "typeof"
						}),
						" collectExamples>"
					]
				}),
				"): ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-built_in",
					children: "string"
				}),
				" {\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "return"
				}),
				" ",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "hljs-string",
					children: [
						"`---\nid: examples\ntitle: Examples\n---\n",
						(0, import_jsx_runtime.jsxs)(_components.span, {
							className: "hljs-subst",
							children: [
								"${h1(\n  ",
								(0, import_jsx_runtime.jsx)(_components.span, {
									className: "hljs-string",
									children: "'Examples'"
								}),
								",\n  ul(\n    examples.map((example) =>\n      link(",
								(0, import_jsx_runtime.jsxs)(_components.span, {
									className: "hljs-string",
									children: [
										"`examples/",
										(0, import_jsx_runtime.jsx)(_components.span, {
											className: "hljs-subst",
											children: "${example.data.id}"
										}),
										"`"
									]
								}),
								", example.data?.title)\n    )\n  )\n)}"
							]
						}),
						"\n`"
					]
				}),
				";\n}\n\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-comment",
					children: "// returns all .ts files from given path"
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "function"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "collectExamples"
				}),
				"(",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "hljs-params",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-attr",
							children: "root"
						}),
						": ",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-built_in",
							children: "string"
						})
					]
				}),
				"): {\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "path"
				}),
				": ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-built_in",
					children: "string"
				}),
				";\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "contents"
				}),
				": ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-built_in",
					children: "string"
				}),
				";\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "data"
				}),
				": ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title class_",
					children: "FrontMatter"
				}),
				";\n}[] {\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" files = ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "readdirSync"
				}),
				"(root, { ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "withFileTypes"
				}),
				": ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-literal",
					children: "true"
				}),
				" });\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "collected"
				}),
				": {\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "path"
				}),
				": ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-built_in",
					children: "string"
				}),
				";\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "contents"
				}),
				": ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-built_in",
					children: "string"
				}),
				";\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "data"
				}),
				": ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title class_",
					children: "FrontMatter"
				}),
				";\n  }[] = [];\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "for"
				}),
				" (",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" file ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "of"
				}),
				" files) {\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "if"
				}),
				" (file.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "isDirectory"
				}),
				"()) {\n      collected.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "push"
				}),
				"(...",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "collectExamples"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "join"
				}),
				"(root, file.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "name"
				}),
				")));\n    } ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "else"
				}),
				" {\n      ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "if"
				}),
				" (file.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "name"
				}),
				".",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "endsWith"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'.ts'"
				}),
				")) {\n        ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" path = ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "join"
				}),
				"(root, file.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "name"
				}),
				");\n        ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" loaded = ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "loadExampleFile"
				}),
				"(path);\n        collected.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "push"
				}),
				"(\n          ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "normalizeFrontMatter"
				}),
				"({\n            path,\n            ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "data"
				}),
				": loaded.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "data"
				}),
				",\n            ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "contents"
				}),
				": loaded.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "contents"
				}),
				",\n          })\n        );\n      }\n    }\n  }\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "return"
				}),
				" collected;\n}\n"
			]
		}) }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "e2e-tests",
			children: ["E2E Tests", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#e2e-tests",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Running the E2E tests is a short script, which works similarly to the docusaurus plugin. It starts by scanning the examples directory for typescript files. If you have written frontmatter that would influence the E2E test, the script would then need to read the file contents and parse out front matter. Then, using that data, it would run the files. A minimal version that doesn’t handle frontmatter could look like this:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, { children: (0, import_jsx_runtime.jsxs)(_components.code, {
			className: "hljs language-typescript",
			children: [
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "import"
				}),
				" { execSync, spawnSync } ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "from"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'child_process'"
				}),
				";\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "import"
				}),
				" { readdirSync } ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "from"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'fs'"
				}),
				";\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "import"
				}),
				" { workspaceRoot } ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "from"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'nx/src/devkit-exports'"
				}),
				";\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "import"
				}),
				" { join, sep } ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "from"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'path'"
				}),
				";\n\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-comment",
					children: "// returns all .ts files from given path"
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "function"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "collectExamples"
				}),
				"(",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "hljs-params",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-attr",
							children: "path"
						}),
						": ",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-built_in",
							children: "string"
						})
					]
				}),
				"): ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-built_in",
					children: "string"
				}),
				"[] {\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" files = ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "readdirSync"
				}),
				"(path, { ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "withFileTypes"
				}),
				": ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-literal",
					children: "true"
				}),
				" });\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "collected"
				}),
				": ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-built_in",
					children: "string"
				}),
				"[] = [];\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "for"
				}),
				" (",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" file ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "of"
				}),
				" files) {\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "if"
				}),
				" (file.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "isDirectory"
				}),
				"()) {\n      collected.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "push"
				}),
				"(...",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "collectExamples"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "join"
				}),
				"(path, file.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "name"
				}),
				")));\n    } ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "else"
				}),
				" {\n      ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "if"
				}),
				" (file.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "name"
				}),
				".",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "endsWith"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'.ts'"
				}),
				")) {\n        collected.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "push"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "join"
				}),
				"(path, file.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "name"
				}),
				"));\n      }\n    }\n  }\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "return"
				}),
				" collected;\n}\n\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" examples = ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "collectExamples"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "join"
				}),
				"(__dirname, ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'../examples'"
				}),
				"));\n\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "let"
				}),
				" error = ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-literal",
					children: "false"
				}),
				";\n\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "for"
				}),
				" (",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" example ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "of"
				}),
				" examples) {\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" label = example.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "replace"
				}),
				"(",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "hljs-string",
					children: [
						"`",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-subst",
							children: "${workspaceRoot}"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-subst",
							children: "${sep}"
						}),
						"`"
					]
				}),
				", ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "''"
				}),
				");\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "try"
				}),
				" {\n    process.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "stdout"
				}),
				".",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "write"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'▶️ '"
				}),
				" + label);\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" a = performance.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "now"
				}),
				"();\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "spawnSync"
				}),
				"(process.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "execPath"
				}),
				", [",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'--import=tsx'"
				}),
				", example], {});\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" b = performance.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "now"
				}),
				"();\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-comment",
					children: "// move cursor to the beginning of the line"
				}),
				"\n    process.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "stdout"
				}),
				".",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "write"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'\\r'"
				}),
				");\n\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-variable language_",
					children: "console"
				}),
				".",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "log"
				}),
				"(\n      ",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "hljs-string",
					children: [
						"`✅ ",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-subst",
							children: "${label}"
						}),
						" (",
						(0, import_jsx_runtime.jsxs)(_components.span, {
							className: "hljs-subst",
							children: [
								"${",
								(0, import_jsx_runtime.jsx)(_components.span, {
									className: "hljs-built_in",
									children: "Math"
								}),
								".round((b - a) * ",
								(0, import_jsx_runtime.jsx)(_components.span, {
									className: "hljs-number",
									children: "10"
								}),
								") / ",
								(0, import_jsx_runtime.jsx)(_components.span, {
									className: "hljs-number",
									children: "10"
								}),
								"}"
							]
						}),
						"ms)`"
					]
				}),
				".",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "padEnd"
				}),
				"(\n        process.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "stdout"
				}),
				".",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "columns"
				}),
				",\n        ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "' '"
				}),
				"\n      )\n    );\n  } ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "catch"
				}),
				" {\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-comment",
					children: "// move cursor to the beginning of the line"
				}),
				"\n    process.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "stdout"
				}),
				".",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "write"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'\\r'"
				}),
				");\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-variable language_",
					children: "console"
				}),
				".",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "log"
				}),
				"(",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "hljs-string",
					children: [
						"`❌ ",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-subst",
							children: "${label}"
						}),
						"`"
					]
				}),
				".",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "padEnd"
				}),
				"(process.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "stdout"
				}),
				".",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-property",
					children: "columns"
				}),
				", ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "' '"
				}),
				"));\n    error = ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-literal",
					children: "true"
				}),
				";\n  }\n}\n\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "if"
				}),
				" (error) {\n  process.",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "exit"
				}),
				"(",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-number",
					children: "1"
				}),
				");\n}\n"
			]
		}) }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "references",
			children: ["References", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#references",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://github.com/AgentEnder/flexi-bench/blob/main/docs-site/src/plugins/examples-plugin.ts",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "FlexiBench Docusaurus Plugin"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://github.com/AgentEnder/flexi-bench/blob/main/e2e/run-e2e.ts",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "FlexiBench E2E Test Script"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://github.com/AgentEnder/flexi-bench/blob/main/examples/",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "FlexiBench Example Files"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://github.com/AgentEnder/cli-forge/blob/main/docs-site/src/plugins/examples-plugin.ts",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "CLI Forge Docusaurus Plugin"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://github.com/AgentEnder/cli-forge/blob/main/e2e/run-e2e.ts",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "CLI Forge E2E Test Script"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://github.com/AgentEnder/cli-forge/blob/main/examples/",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "CLI Forge Example Files"
			}) }),
			"\n"
		] })
	] });
}
function MDXContent$13(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime.jsx)(_createMdxContent$13, { ...props })
	}) : _createMdxContent$13(props);
}
function _missingMdxReference$13(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/multifunctional-example-files/post.ts
var multifunctionExampleFiles = {
	mdx: MDXContent$13,
	publishDate: new Date(2024, 7, 23),
	slug: "multifunctional-example-files",
	title: "Multifunctional Example Files",
	description: `Keeping documentation and examples in sync and up-to-date is often a challenge when developing libraries or frameworks. In this, we explore how to get the most out of a single file that ensures your documentation and examples are always in sync.`,
	tags: [
		"technical",
		"tooling",
		"tutorial"
	]
};
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/nx-configuration-history/contents.mdx
function _createMdxContent$12(props) {
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
	}, { Anchor } = _components;
	if (!Anchor) _missingMdxReference$12("Anchor", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.h1, {
			id: "nx-from-angular-roots-to-crystal-future",
			children: "Nx: From Angular Roots to Crystal Future"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "table-of-contents",
			children: "Table of Contents"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime.jsx)(_components.a, {
					href: "#introduction",
					children: "Introduction"
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
					"\n",
					(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
						href: "#the-quick-scoop-tldr",
						children: "The Quick Scoop (tldr)"
					}) }),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
						href: "#the-final-result",
						children: "The Final Result"
					}) }),
					"\n"
				] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "#nxs-angular-beginnings",
				children: "Nx’s Angular Beginnings"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "#birth-of-the-nx-cli-evolution-beyond-angular",
				children: "Birth of the Nx CLI: Evolution Beyond Angular"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsxs)(_components.a, {
				href: "#projectjson-and-splitting-workspacejson",
				children: [
					(0, import_jsx_runtime.jsx)(_components.code, { children: "project.json" }),
					" and splitting ",
					(0, import_jsx_runtime.jsx)(_components.code, { children: "workspace.json" })
				]
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "#the-beginnings-of-inference",
				children: "The Beginnings of Inference"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "#enter-lerna",
				children: "Enter Lerna"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "#inference-api-v1-and-workspaces-support",
				children: "Inference API v1, and Workspaces Support"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "#elevating-workspaces-with-inference-api-v2",
				children: "Elevating Workspaces with Inference API v2"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "#entering-the-crystal-era-",
				children: "Entering the Crystal Era 💎"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "#conclusion",
				children: "Conclusion"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "#references-and-links",
				children: "References and Links"
			}) }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "introduction",
			children: ["Introduction", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#introduction",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Nx’s configuration has changed dramatically over the years, and it’s been a long journey to get to where we are today. I joined the Nx team in June 2021, right before we split up ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "workspace.json" }),
			" into ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "workspace.json" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "project.json" }),
			". Since joining the team, I’ve had a pretty direct hand in many of these changes, and have worked closely on others."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "A few misconceptions about Nx stem from its configuration and history, and I’d like to clear some of those up." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Nx is only for Angular" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Nx is hard to configure" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Nx has a lot of configuration." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "the-quick-scoop-tldr",
			children: ["The Quick Scoop (tldr)", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-quick-scoop-tldr",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Nx was initially built as an Angular CLI extension. It has been its own CLI for years, and has no direct ties to angular at this point." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Nx’s configuration has gone through many iterations, and now configures itself in most cases." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "You shouldn’t have to worry when the configuration changes, as Nx will migrate your existing config for you." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "the-final-result",
			children: ["The Final Result", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-final-result",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "After Nx 18, the Nx side of configuration for individual projects in a workspace can be as small as this:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, {
			filename: "apps/myapp/project.json",
			children: (0, import_jsx_runtime.jsxs)(_components.code, {
				className: "hljs language-json",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"name\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"myapp\""
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n"
				]
			})
		}),
		"\n",
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The rest of the configuration that one may expect (targets to run as the most common example) can be inferred from configuration files present in the project’s root. This is a dramatic reduction from where we started, and hopefully makes Nx easier to adopt and learn." }),
		"\n",
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "nxs-angular-beginnings",
			children: ["Nx’s Angular Beginnings", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#nxs-angular-beginnings",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Nx was initially built as an Angular CLI extension. It was a set of schematics and builders that extended the Angular CLI’s capabilities. This was a great way to get started, but it had some limitations. For example, it was difficult to add support for other frameworks, and it was difficult to add new commands to the CLI." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Angular CLI also supports monorepos, and in the beginning Nx used angular’s configuration. When you have multiple projects, the configuration would look something like this:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, {
			filename: "angular.json",
			children: (0, import_jsx_runtime.jsxs)(_components.code, {
				className: "hljs language-json",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"version\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-number",
						children: "1"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"projects\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"my-app\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"architect\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"build\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n          ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"builder\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"@angular-devkit/build-angular:browser\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n          ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"options\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n            ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"main\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"apps/my-app/src/main.ts\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n            ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"tsConfig\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"apps/my-app/tsconfig.app.json\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n            ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"assets\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "["
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"apps/my-app/src/favicon.ico\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"apps/my-app/src/assets\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "]"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n            ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"styles\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "["
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"apps/my-app/src/styles.css\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "]"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n            ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"scripts\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "["
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "]"
					}),
					"\n          ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n"
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"To help distinguish a plain Angular CLI project from an Nx workspace, and better support other tools, we added support for a ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "workspace.json" }),
			" file. This file was identical to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "angular.json" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"As Nx grew and added more features, we needed to add more configuration. We added a ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "nx.json" }),
			" file to store this configuration. This file was used to store configuration for things that were specific to Nx, and that angular wouldn’t understand. For example, we added support for ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "tags" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "implicitDependencies" }),
			" to help Nx understand the relationships between projects."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "birth-of-the-nx-cli-evolution-beyond-angular",
			children: ["Birth of the Nx CLI: Evolution Beyond Angular", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#birth-of-the-nx-cli-evolution-beyond-angular",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"After a bit, Nx grew apart from Angular CLI. It became a standalone tool that could be used with any framework. This meant that we needed to create our own configuration file. We created ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "workspace.json" }),
			" to replace ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "angular.json" }),
			". The configuration was extraordinarily similar, but it was a different file and a few properties had a different name. The names changed to more closely match the names that Nx uses. For example, ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "builder" }),
			" became ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "executor" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "architect" }),
			" became ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "targets" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"These changes included some differences in ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "nx.json" }),
			" as well. We renamed the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "schematics" }),
			" property to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "generators" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "At this point, the files looked like this:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, {
			filename: "workspace.json",
			children: (0, import_jsx_runtime.jsxs)(_components.code, {
				className: "hljs language-json",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"version\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-number",
						children: "2"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"projects\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"my-app\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"targets\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"build\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n          ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"executor\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"@nrwl/web:build\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n          ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"options\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n            ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"main\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"apps/my-app/src/main.ts\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n            ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"tsConfig\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"apps/my-app/tsconfig.app.json\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n            ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"assets\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "["
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"apps/my-app/src/favicon.ico\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"apps/my-app/src/assets\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "]"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n            ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"styles\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "["
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"apps/my-app/src/styles.css\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "]"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n            ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"scripts\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "["
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "]"
					}),
					"\n          ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n"
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, {
			filename: "nx.json",
			children: (0, import_jsx_runtime.jsxs)(_components.code, {
				className: "hljs language-json",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"projects\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"my-app\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"tags\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "["
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "]"
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"generators\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"@nrwl/angular:component\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"style\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"scss\""
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n"
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Additionally, nx added the capability to run dependant targets before a target. This was initially done by adding a ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "targetDependencies" }),
			" section within ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "nx.json" }),
			". We scoped the property to all targets with a given name, and it looked like this:"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, {
			filename: "nx.json",
			children: (0, import_jsx_runtime.jsxs)(_components.code, {
				className: "hljs language-json",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"targetDependencies\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"build\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "["
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"target\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"build-base\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"projects\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"self\""
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "]"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"build-base\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "["
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"target\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"build-base\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"projects\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"dependencies\""
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "]"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n"
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The above configuration would run the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "build-base" }),
			" target for all projects before running the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "build" }),
			" target of that same project. This was a powerful feature, but it wasn’t as general as we had hoped and needed a bit more flexibility."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Soon after, we renamed ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "targetDependencies" }),
			" to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "targetDefaults" }),
			" + ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "dependsOn" }),
			" and allowed specifying it on a per-project basis. This allowed us to specify different defaults for different projects. The configuration looked like this:"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, {
			filename: "nx.json",
			children: (0, import_jsx_runtime.jsxs)(_components.code, {
				className: "hljs language-json",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"targetDefaults\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"build\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"dependsOn\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "["
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n          ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"target\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"build-base\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n          ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"projects\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"self\""
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "]"
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n"
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, {
			filename: "workspace.json",
			children: (0, import_jsx_runtime.jsxs)(_components.code, {
				className: "hljs language-json",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"projects\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"my-app\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"targets\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"build\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n          ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"executor\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"@nrwl/web:build\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n          ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"options\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n            ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"main\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"apps/my-app/src/main.ts\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n            ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"tsConfig\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"apps/my-app/tsconfig.app.json\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n            ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"assets\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "["
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"apps/my-app/src/favicon.ico\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"apps/my-app/src/assets\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "]"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n            ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"styles\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "["
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"apps/my-app/src/styles.css\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "]"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n            ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"scripts\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "["
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "]"
					}),
					"\n          ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n          ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"dependsOn\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "["
					}),
					"\n            ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n              ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"target\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"build-base\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n              ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"projects\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"self\""
					}),
					"\n            ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n          ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "]"
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n"
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "projectjson-and-splitting-workspacejson",
			children: [
				(0, import_jsx_runtime.jsx)(_components.code, { children: "project.json" }),
				" and splitting ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "workspace.json" }),
				(0, import_jsx_runtime.jsx)(_components.a, {
					className: "heading-link",
					href: "#projectjson-and-splitting-workspacejson",
					children: (0, import_jsx_runtime.jsx)(Anchor, {
						className: "heading-link-anchor",
						children: "#"
					})
				})
			]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Nx is a monorepo focused tool. It’s designed to work with many projects in a single repository. As such, the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "workspace.json" }),
			" file can get large. Every time a new project is added, an existing project is modified, or an older project is removed, the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "workspace.json" }),
			" file needs to be updated. This can lead to merge conflicts and other issues."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"When working with customers with over 200 projects, this was no longer scalable. We needed to split the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "workspace.json" }),
			" file into multiple files. We also needed to make it easier to add new projects and modify existing projects."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"We decided that ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "workspace.json" }),
			" would contain a map of project name to file path. This would allow us to split the configuration into multiple files. At the same time, it was important to maintain compatibility with Angular CLI schematics and builders. We wanted to do this without having to keep a copy of the Angular CLI configuration in sync with the Nx configuration."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "As such, we created a translation layer that would handle reading and writing the configuration when angular asked for it. Doing this unlocked a ton of flexibility on our side to make changes to the configuration without breaking compatibility with Angular CLI." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Additionally, we took some time to reevaluate where existing configuration options lived. Since we now have a configuration file per project it made less sense to place ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "tags" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "implicitDependencies" }),
			" in ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "nx.json" }),
			". We moved these properties to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "project.json" }),
			" as well."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The end result of this round of changes resulted in:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "workspace.json" }), " containing a map of project name to file path"] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "project.json" }), " containing all the configuration for a single project"] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "nx.json" }), " containing configuration that is global to the workspace"] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This was a much cleaner and more scalable way to manage configuration. It meant less merge conflicts, but also made it easier to tell what projects may have been affected by a change." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, {
			filename: "workspace.json",
			children: (0, import_jsx_runtime.jsxs)(_components.code, {
				className: "hljs language-json",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"version\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-number",
						children: "2"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"projects\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"myapp\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"apps/myapp\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"mylib\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"libs/mylib\""
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n"
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, {
			filename: "apps/myapp/project.json",
			children: (0, import_jsx_runtime.jsxs)(_components.code, {
				className: "hljs language-json",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"targets\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"build\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"executor\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"@nrwl/web:build\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"options\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"main\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"apps/myapp/src/main.ts\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"tsConfig\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"apps/myapp/tsconfig.app.json\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"assets\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "["
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"apps/myapp/src/favicon.ico\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"apps/myapp/src/assets\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "]"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"styles\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "["
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"apps/myapp/src/styles.css\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "]"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"scripts\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "["
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "]"
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n"
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, {
			filename: "nx.json",
			children: (0, import_jsx_runtime.jsxs)(_components.code, {
				className: "hljs language-json",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"targetDefaults\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"build\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"dependsOn\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "["
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n          ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"target\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"build-base\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n          ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"projects\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"self\""
					}),
					"\n        ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "]"
					}),
					"\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n"
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "the-beginnings-of-inference",
			children: ["The Beginnings of Inference", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-beginnings-of-inference",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"After the last round of changes, we noticed that the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "workspace.json" }),
			" file was not particularly useful. It was just a map of project name to file path. We decided that it should be optional, and in time we dropped support for it entirely."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This change required Nx to be able to locate the configuration of projects without a central file. Adding this support was not a major task, but while doing so we also decided to open up the possibility of dynamically building configuration." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"At the same time, there was a push from non-angular users to simplify the configuration. Npm/yarn/pnpm workspaces had gained a bit of popularity and it was much easier to define targets as a ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "package.json" }),
			" script for a segment of users. We wanted to make it easier for these users to use Nx, while also helping Nx make sense when compared to other tools. We decided that if there was a package.json file inside a project, Nx would be able to run its scripts as a target."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "enter-lerna",
			children: ["Enter Lerna", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#enter-lerna",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Lerna has been around a long time, and maintains a good amount of popularity within the JavaScript community. It’s a tool that helps manage multiple packages in a single repository. It’s a bit different from Nx, but it’s similar enough that we were already looking at making it easier to use the two together. Lerna had some functionality that Nx didn’t (publishing packages), and Nx had some functionality that Lerna didn’t (caching and code generation)." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Around this time, a few things surrounding lerna started to become worrisome. There was an ",
			(0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://github.com/lerna/lerna/issues/2703",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "issue"
			}),
			" filed stating that lerna had been unmaintained. A ",
			(0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://github.com/lerna/lerna/pull/3092",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "PR"
			}),
			" had been merged adding a warning that lerna wasn’t being actively maintained, and that the community should consider using other tools."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"These users would need to go somewhere, but any change for them would not be without difficulty. Nrwl, the company behind Nx, decided to step in and offer a solution. After talking with the maintainer, we were able to take over stewardship and step in to maintain the project. This was announced in a blog post here: ",
			(0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://blog.nrwl.io/lerna-is-dead-long-live-lerna-61259f97dbd9",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "Lerna is dead, Long live Lerna"
			}),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "inference-api-v1-and-workspaces-support",
			children: ["Inference API v1, and Workspaces Support", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#inference-api-v1-and-workspaces-support",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "With Lerna under our purview we wanted to be able to unify the two tools. Nx should be able to work in a lerna workspace, and hopefully the portions of Lerna that Nx could already handle would then be able to invoke Nx under the hood. This would prevent us from having to maintain two copies of the same functionality, and we were optimistic we could do this without breaking any existing workflows." }),
		"\n",
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The first step of this process was to ensure that Nx could work in a Lerna repository without changing the existing structure. This meant a few things:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "workspace.json" }), " had to be optional"] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "project.json" }), " had to be optional"] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "nx.json" }), " had to be optional"] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "If any of these 3 files had been required, it would have caught lerna users off guard and look like Nx was replacing lerna." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This built upon our existing inference capabilities, and while opening them up further we decided to publish a version that plugin authors could take advantage of." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The first version of these inference APIs never left experimental, and weren’t actually used internally. Rather, they acted almost as a proof of concept and allowed us to see what the API might look like. Essentially, we needed an API that would be able to turn a project’s configuration file into its actual configuration. The API looked something like this:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, { children: (0, import_jsx_runtime.jsxs)(_components.code, {
			className: "hljs language-typescript",
			children: [
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "import"
				}),
				" { ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title class_",
					children: "NxPlugin"
				}),
				" } ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "from"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'@nx/devkit'"
				}),
				";\n\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "plugin"
				}),
				": ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title class_",
					children: "NxPlugin"
				}),
				" = {\n  projectFilePatterns = [",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'project.json'"
				}),
				"],\n  registerProjectTargets = ",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "hljs-function",
					children: [
						"(",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-params",
							children: "projectFile"
						}),
						") =>"
					]
				}),
				" {\n    ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-comment",
					children: "// ..."
				}),
				"\n  },\n};\n"
			]
		}) }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"In this example, ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "projectFilePatterns" }),
			" is an array of file patterns that the plugin can handle. When Nx is looking for a project’s configuration, it will look for a file that matches one of these patterns. If it finds one, it will pass it to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "registerProjectTargets" }),
			" and expect it to return the targets a given project can run."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"While we didn’t directly use this API, it was a small inclusion in the core code to enable Nx running inside a repository that was only configured by ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "package.json" }),
			" files. The published API was also used to show how Nx could one day be used in C# or Java repositories, without introducing new configuration files."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "elevating-workspaces-with-inference-api-v2",
			children: ["Elevating Workspaces with Inference API v2", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#elevating-workspaces-with-inference-api-v2",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"We were happy with the inference apis and configuration loading overall, but there were a few things that we wanted to clean up within Nx’s codebase and the API itself. In particular we wanted to be able to streamline our handling of ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "angular.json" }),
			" for legacy users, and wanted to migrate the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "project.json" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "package.json" }),
			" configuration loading into the same API."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "To do this, we needed an API that:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Could provide a full project configuration, not just the targets" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Could read multiple projects from a single file (angular.json supports this)" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Additionally, there were other plugin APIs to extend the project graph that were a bit confusing when deciding if a plugin should be an inference plugin or a project graph plugin. Project graph plugins exported a single function, that received the current project graph and returned a new one. As part of this, they could add new nodes and edges to the graph. Most nodes on the graph were projects, but adding a project via these APIs resulted in odd behavior as targets couldn’t be ran because they weren’t present when Nx initially loaded project configurations." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "As such, we decided to merge the two APIs into a single one. This API creates nodes on the project graph, and edges between those nodes. The API looks something like this:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, { children: (0, import_jsx_runtime.jsxs)(_components.code, {
			className: "hljs language-typescript",
			children: [
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "import"
				}),
				" { ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title class_",
					children: "NxPlugin"
				}),
				" } ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "from"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'@nx/devkit'"
				}),
				";\n\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-keyword",
					children: "const"
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "plugin"
				}),
				": ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title class_",
					children: "NxPlugin"
				}),
				" = {\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "createNodes"
				}),
				": [",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-string",
					children: "'**/*.csproj'"
				}),
				", ",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "hljs-function",
					children: [
						"(",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-params",
							children: "projectFile, ctx"
						}),
						") =>"
					]
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "readProjectsFromFile"
				}),
				"(projectFile)]\n  ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-attr",
					children: "createDependencies"
				}),
				": ",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "hljs-function",
					children: [
						"(",
						(0, import_jsx_runtime.jsx)(_components.span, {
							className: "hljs-params",
							children: "ctx"
						}),
						") =>"
					]
				}),
				" ",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "hljs-title function_",
					children: "readEdgesFromContext"
				}),
				"(ctx)\n};\n"
			]
		}) }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.code, { children: "CreateNodes" }),
			" is a tuple, where the first element is a glob pattern that the plugin can handle, and the second element is a function that will read the file and return the projects it contains. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "createDependencies" }),
			" is a function that will be called after all the nodes have been created, and creates the edges between the nodes."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: ["This API met all the requirements we set out on, and ensured there was only one spot for plugin authors to add new nodes to the graph. It released as part of Nx 17, and we talked about it at that year’s ", (0, import_jsx_runtime.jsx)(_components.a, {
			href: "https://www.youtube.com/watch?v=bnjOu7iOrMg",
			rel: "noopener noreferrer",
			target: "_blank",
			children: "Nx Conf"
		})] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "entering-the-crystal-era-",
			children: ["Entering the Crystal Era 💎", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#entering-the-crystal-era-",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "A large goal that the Nx team has consistently worked on is making Nx easier to adopt. Configuration changes are a large part of this, but we also took some time to reflect on how we integrate with other tools." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Traditionally, Nx would provide an executor that wrapped a tool like ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "jest" }),
			". When running test, Nx would invoke the executor which would then invoke ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "jest" }),
			". This was a bit of a pain point for users, as they would have to learn how to use Nx’s executors and any of the idiosyncrasies that came with them. Additionally, it made it harder to get help when things went wrong, as the error messages would be different than what the user would see when running ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "jest" }),
			" directly. Users would frequently ask questions that would be better solved by Jest’s documentation, but they wouldn’t know that because they were using Nx’s executors."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Nx had been able to run arbitrary scripts in ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "package.json" }),
			" files or arbitrary commands specified in ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "project.json" }),
			" for a while, but it was not the default. We didn’t encourage using ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "run-commands" }),
			" for everything, as there were some problems when using it:"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Terminal output was not as nice as it could be" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Tools may need some extra configuration to work properly" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Keeping the configuration in sync with the rest of the workspace was difficult" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Making the terminal output nicer was a bit of a heavy lift, but we were able to make it work. Adding support for running commands inside a pseudo-terminal allowed us to capture output as it would look on the dev’s machine, rather than the older output style that mimicked what you would see in a CI environment. Additionally, this meant that interactive commands could work how a dev would expect." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "For the second point, we decided to shift how we wrote our first party plugins. Instead of writing an executor that wrapped a tool, we can write plugins for many of the tools themselves to implement the same functionality. This would allow us to take advantage of the tool’s configuration, and would allow us to provide a better experience for users, while being a bit more transparent about our changes." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The inference APIs we had just added were a perfect fit for keeping the configuration in sync. If we infer that every project with a jest configuration should have a ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "test" }),
			" target, we can add that target to the project’s configuration. This would allow us to keep the configuration in sync with the rest of the workspace, and would allow us to provide a better experience for users."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"With these 3 pain points addressed, we made the major decision to step away from using executors for most of our first party plugins and infer targets from configuration files where possible. As far as configuration is concerned, nothing ",
			(0, import_jsx_runtime.jsx)(_components.strong, { children: "really" }),
			" changed but things did look a bit different to users. Mainly, the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "targets" }),
			" section of ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "project.json" }),
			" was no longer required to run a target."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Many ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "project.json" }),
			" files can now be as small as this:"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, {
			filename: "apps/myapp/project.json",
			children: (0, import_jsx_runtime.jsxs)(_components.code, {
				className: "hljs language-json",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "{"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"name\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"myapp\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ","
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "\"tags\""
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: ":"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "["
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "]"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-punctuation",
						children: "}"
					}),
					"\n"
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Internally, we referred to this change as project configuration v3. It represents a major shift in how we think about configuration, and how we think about integrating with other tools. As such, we released it as Nx 18: Project Crystal 💎." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Some published resources go into more detail about this change:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://www.youtube.com/watch?v=wADNsVItnsM",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "Nx Project Crystal 💎"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://nx.dev/concepts/inferred-tasks#inferred-tasks-project-crystal",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "Inferred Tasks documentation"
			}) }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "conclusion",
			children: ["Conclusion", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#conclusion",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Nx’s configuration has changed a lot over the years, and it’s been a long journey to get to where we are today. We’ve made a lot of changes to make Nx easier to adopt, and we’ve made a lot of changes to make Nx easier to use." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Project Crystal helped slim down the Nx configuration within a workspace to only ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "nx.json" }),
			" for many repos, and opens the doors for Nx to be used in a wider variety of repositories. We’re excited to see what the future holds for Nx, and as always, stay tuned 📺."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "references-and-links",
			children: ["References and Links", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#references-and-links",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://www.youtube.com/watch?v=wADNsVItnsM",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "Nx Project Crystal 💎"
			}) }),
			"\n"
		] })
	] });
}
function MDXContent$12(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime.jsx)(_createMdxContent$12, { ...props })
	}) : _createMdxContent$12(props);
}
function _missingMdxReference$12(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/nx-configuration-history/post.ts
var nxConfigurationHistory = {
	mdx: MDXContent$12,
	publishDate: new Date(2024, 1, 5),
	slug: "nx-configuration-history",
	title: "Nx Configuration History",
	description: `Nx's configuration has changed dramatically over the years, and it's been a long journey to get to where we are today. I joined the Nx team in June 2021, right before we split up \`workspace.json\` into \`workspace.json\` and \`project.json\`. Since joining the team, I've had a pretty direct hand in many of these changes, and have worked closely on others.`,
	tags: [
		"technical",
		"nx",
		"tooling",
		"javascript",
		"typescript"
	]
};
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/package-manager-release-cooldown/contents.mdx
var npmDocs = (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	"npm CLI documentation,",
	" ",
	(0, import_jsx_runtime.jsx)("a", {
		href: "https://docs.npmjs.com/cli/v11/using-npm/config#min-release-age",
		children: (0, import_jsx_runtime.jsx)("code", { children: "min-release-age" })
	}),
	"."
] });
var pnpmDocs = (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	"pnpm documentation,",
	" ",
	(0, import_jsx_runtime.jsx)("a", {
		href: "https://pnpm.io/settings#minimumreleaseage",
		children: (0, import_jsx_runtime.jsx)("code", { children: "minimumReleaseAge" })
	}),
	". Notes the default of ",
	(0, import_jsx_runtime.jsx)("code", { children: "1440" }),
	" minutes since pnpm 11."
] });
var yarnDocs = (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	"Yarn documentation,",
	" ",
	(0, import_jsx_runtime.jsx)("a", {
		href: "https://yarnpkg.com/configuration/yarnrc#npmMinimalAgeGate",
		children: (0, import_jsx_runtime.jsx)("code", { children: "npmMinimalAgeGate" })
	}),
	"."
] });
var bunDocs = (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	"Bun documentation,",
	" ",
	(0, import_jsx_runtime.jsx)("a", {
		href: "https://bun.sh/docs/runtime/bunfig#install-minimumreleaseage",
		children: (0, import_jsx_runtime.jsx)("code", { children: "install.minimumReleaseAge" })
	}),
	"."
] });
var renovateBestPractices = (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	"Renovate documentation,",
	" ",
	(0, import_jsx_runtime.jsx)("a", {
		href: "https://docs.renovatebot.com/presets-config/#configbest-practices",
		children: (0, import_jsx_runtime.jsx)("code", { children: "config:best-practices" })
	}),
	" ",
	"preset. Includes ",
	(0, import_jsx_runtime.jsx)("code", { children: "security:minimumReleaseAgeNpm" }),
	", which waits three days before raising an npm update."
] });
var dependabotCooldown = (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	"GitHub Docs,",
	" ",
	(0, import_jsx_runtime.jsx)("a", {
		href: "https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#cooldown",
		children: "Dependabot cooldown configuration"
	}),
	", covering ",
	(0, import_jsx_runtime.jsx)("code", { children: "default-days" }),
	" and the semver-specific overrides."
] });
var npmExcludeIssue = (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	"npm CLI issue ",
	(0, import_jsx_runtime.jsx)("a", {
		href: "https://github.com/npm/cli/issues/8994",
		children: "#8994"
	}),
	". Tracks an exclusion list for ",
	(0, import_jsx_runtime.jsx)("code", { children: "min-release-age" }),
	"."
] });
var pnpmLockfileBug = (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	"pnpm issue ",
	(0, import_jsx_runtime.jsx)("a", {
		href: "https://github.com/pnpm/pnpm/issues/10008",
		children: "#10008"
	}),
	".",
	" ",
	(0, import_jsx_runtime.jsx)("code", { children: "minimumReleaseAge" }),
	" silently ignored on pnpm 10.x when any workspace package sets ",
	(0, import_jsx_runtime.jsx)("code", { children: "shared-workspace-lockfile=false" }),
	"."
] });
var yarnSuffixBug = (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	"Yarn issue ",
	(0, import_jsx_runtime.jsx)("a", {
		href: "https://github.com/yarnpkg/berry/issues/6991",
		children: "#6991"
	}),
	". Duration suffixes silently dropped when parsing",
	" ",
	(0, import_jsx_runtime.jsx)("code", { children: "npmMinimalAgeGate" }),
	"."
] });
var bunSystemWidePr = (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	"Bun pull request",
	" ",
	(0, import_jsx_runtime.jsx)("a", {
		href: "https://github.com/oven-sh/bun/pull/28727",
		children: "#28727"
	}),
	". Adds system-wide ",
	(0, import_jsx_runtime.jsx)("code", { children: "bunfig.toml" }),
	" support (",
	(0, import_jsx_runtime.jsx)("code", { children: "/etc/bunfig.toml" }),
	"), merged beneath the user-wide and project files."
] });
var pnpmConfigLocations = (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	"pnpm documentation,",
	" ",
	(0, import_jsx_runtime.jsx)("a", {
		href: "https://pnpm.io/cli/config",
		children: (0, import_jsx_runtime.jsx)("code", { children: "pnpm config" })
	}),
	". Lists the per-OS locations of the global ",
	(0, import_jsx_runtime.jsx)("code", { children: "config.yaml" }),
	" and its sibling",
	" ",
	(0, import_jsx_runtime.jsx)("code", { children: "rc" }),
	" file."
] });
var bunGlobalBunfig = (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	"Bun documentation,",
	" ",
	(0, import_jsx_runtime.jsxs)("a", {
		href: "https://bun.sh/docs/runtime/bunfig#global-vs-local",
		children: ["Global vs. local ", (0, import_jsx_runtime.jsx)("code", { children: "bunfig.toml" })]
	}),
	". Enforcement of ",
	(0, import_jsx_runtime.jsx)("code", { children: "install.minimumReleaseAge" }),
	" from the user-wide file verified against Bun ",
	(0, import_jsx_runtime.jsx)("code", { children: "1.3.7" }),
	"."
] });
var npmApproveScripts = (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	"npm CLI documentation,",
	" ",
	(0, import_jsx_runtime.jsx)("a", {
		href: "https://docs.npmjs.com/cli/v11/commands/npm-approve-scripts",
		children: (0, import_jsx_runtime.jsx)("code", { children: "npm approve-scripts" })
	}),
	". Manages the ",
	(0, import_jsx_runtime.jsx)("code", { children: "allowScripts" }),
	" field, available since npm ",
	(0, import_jsx_runtime.jsx)("code", { children: "11.16.0" }),
	"."
] });
var npmV12Plan = (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	"GitHub community discussion,",
	" ",
	(0, import_jsx_runtime.jsx)("a", {
		href: "https://github.com/orgs/community/discussions/198547",
		children: "\"Preparing for npm v12: install scripts and non-registry sources become opt-in\""
	}),
	"."
] });
var pnpmAllowBuilds = (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	"pnpm documentation,",
	" ",
	(0, import_jsx_runtime.jsx)("a", {
		href: "https://pnpm.io/settings#allowbuilds",
		children: (0, import_jsx_runtime.jsx)("code", { children: "allowBuilds" })
	}),
	". Added in pnpm 10.26; replaces ",
	(0, import_jsx_runtime.jsx)("code", { children: "onlyBuiltDependencies" }),
	" and ",
	(0, import_jsx_runtime.jsx)("code", { children: "neverBuiltDependencies" }),
	" in pnpm 11."
] });
var yarnEnableScripts = (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	"Yarn documentation,",
	" ",
	(0, import_jsx_runtime.jsx)("a", {
		href: "https://yarnpkg.com/configuration/yarnrc#enableScripts",
		children: (0, import_jsx_runtime.jsx)("code", { children: "enableScripts" })
	}),
	" ",
	"and",
	" ",
	(0, import_jsx_runtime.jsx)("a", {
		href: "https://yarnpkg.com/configuration/manifest#dependenciesMeta",
		children: (0, import_jsx_runtime.jsx)("code", { children: "dependenciesMeta" })
	}),
	"."
] });
var yarnEnableScriptsDefaultPr = (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	"Yarn pull request",
	" ",
	(0, import_jsx_runtime.jsx)("a", {
		href: "https://github.com/yarnpkg/berry/pull/7089",
		children: "#7089"
	}),
	". Makes",
	" ",
	(0, import_jsx_runtime.jsx)("code", { children: "enableScripts: false" }),
	" the default; released in Yarn 4.14.0. Existing projects are migrated with an explicit",
	" ",
	(0, import_jsx_runtime.jsx)("code", { children: "enableScripts: true" }),
	"."
] });
var yarnHardenedMode = (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	"Yarn documentation,",
	" ",
	(0, import_jsx_runtime.jsx)("a", {
		href: "https://yarnpkg.com/configuration/yarnrc#enableHardenedMode",
		children: (0, import_jsx_runtime.jsx)("code", { children: "enableHardenedMode" })
	}),
	". Enabled automatically on pull requests from public GitHub repositories."
] });
var bunLifecycle = (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	"Bun documentation,",
	" ",
	(0, import_jsx_runtime.jsx)("a", {
		href: "https://bun.sh/docs/install/lifecycle",
		children: "Lifecycle scripts"
	}),
	". Covers ",
	(0, import_jsx_runtime.jsx)("code", { children: "trustedDependencies" }),
	" and the",
	" ",
	(0, import_jsx_runtime.jsx)("a", {
		href: "https://github.com/oven-sh/bun/blob/main/src/install/default-trusted-dependencies.txt",
		children: "default trusted list"
	}),
	"."
] });
var pnpmTrustPolicy = (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	"pnpm documentation,",
	" ",
	(0, import_jsx_runtime.jsx)("a", {
		href: "https://pnpm.io/settings#trustpolicy",
		children: (0, import_jsx_runtime.jsx)("code", { children: "trustPolicy" })
	}),
	". Added in pnpm 10.21, alongside ",
	(0, import_jsx_runtime.jsx)("code", { children: "trustPolicyExclude" }),
	" (10.22) and",
	" ",
	(0, import_jsx_runtime.jsx)("code", { children: "trustPolicyIgnoreAfter" }),
	" (10.27)."
] });
function _createMdxContent$11(props) {
	const _components = {
		a: "a",
		code: "code",
		em: "em",
		h1: "h1",
		h2: "h2",
		li: "li",
		p: "p",
		pre: "pre",
		span: "span",
		strong: "strong",
		ul: "ul",
		...props.components
	}, { Anchor, Cite, Tab, Tabs } = _components;
	if (!Anchor) _missingMdxReference$11("Anchor", true);
	if (!Cite) _missingMdxReference$11("Cite", true);
	if (!Tab) _missingMdxReference$11("Tab", true);
	if (!Tabs) _missingMdxReference$11("Tabs", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.h1, {
			id: "locking-down-dependency-installs-across-npm-pnpm-yarn-and-bun",
			children: "Locking down dependency installs across npm, pnpm, yarn, and bun"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "A minimum release age (or “cooldown”) instructs a package manager to ignore any dependency version published less than a configured amount of time ago. The reference below covers the cooldown, install-time lifecycle script gating, and pnpm’s trust policy across the four major Node.js package managers; the setting names and units differ in each." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "table-of-contents",
			children: "Table of Contents"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "#overview",
				children: "Overview"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "#per-project",
				children: "Per-project"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "#user-wide",
				children: "User-wide"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "#lifecycle-scripts",
				children: "Lifecycle scripts"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "#pnpms-trust-policy",
				children: "pnpm’s trust policy"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "#caveats",
				children: "Caveats"
			}) }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "#acknowledgements",
				children: "Acknowledgements"
			}) }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "overview",
			children: ["Overview", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#overview",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "A cooldown delays a freshly published version from being installable. Compromised releases are usually flagged and removed from the registry within hours of publication, so even a 24-hour delay filters most of those incidents at the install layer without monitoring or scanning." }),
		"\n",
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Each tool exposes the setting under its own name and unit of time:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime.jsx)(_components.strong, { children: "npm" }),
				": ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "min-release-age" }),
				", in ",
				(0, import_jsx_runtime.jsx)(_components.strong, { children: "days" }),
				". npm CLI ",
				(0, import_jsx_runtime.jsx)(_components.strong, { children: "11.10.0" }),
				" (February 2026).",
				(0, import_jsx_runtime.jsx)(Cite, {
					n: 1,
					href: "https://docs.npmjs.com/cli/v11/using-npm/config#min-release-age",
					children: npmDocs
				})
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime.jsx)(_components.strong, { children: "pnpm" }),
				": ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "minimumReleaseAge" }),
				", in ",
				(0, import_jsx_runtime.jsx)(_components.strong, { children: "minutes" }),
				". pnpm ",
				(0, import_jsx_runtime.jsx)(_components.strong, { children: "10.16" }),
				" (September 2025); default ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "1440" }),
				" since pnpm ",
				(0, import_jsx_runtime.jsx)(_components.strong, { children: "11.0" }),
				".",
				(0, import_jsx_runtime.jsx)(Cite, {
					n: 2,
					href: "https://pnpm.io/settings#minimumreleaseage",
					children: pnpmDocs
				})
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime.jsx)(_components.strong, { children: "Yarn" }),
				": ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "npmMinimalAgeGate" }),
				", in ",
				(0, import_jsx_runtime.jsx)(_components.strong, { children: "minutes" }),
				". Yarn Berry ",
				(0, import_jsx_runtime.jsx)(_components.strong, { children: "4.10.0" }),
				".",
				(0, import_jsx_runtime.jsx)(Cite, {
					n: 3,
					href: "https://yarnpkg.com/configuration/yarnrc#npmMinimalAgeGate",
					children: yarnDocs
				})
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime.jsx)(_components.strong, { children: "Bun" }),
				": ",
				(0, import_jsx_runtime.jsx)(_components.code, { children: "minimumReleaseAge" }),
				", in ",
				(0, import_jsx_runtime.jsx)(_components.strong, { children: "seconds" }),
				". Bun ",
				(0, import_jsx_runtime.jsx)(_components.strong, { children: "1.3.0" }),
				".",
				(0, import_jsx_runtime.jsx)(Cite, {
					n: 4,
					href: "https://bun.sh/docs/runtime/bunfig#install-minimumreleaseage",
					children: bunDocs
				})
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The setting can be written per-project or per-user. A per-project value protects the codebase against newly published policy violations; a user-wide value extends the cooldown to repositories that have not opted in. Both are worth setting; neither replaces the other, and the conditions under which either is silently bypassed are listed in the ",
			(0, import_jsx_runtime.jsx)(_components.a, {
				href: "#caveats",
				children: "caveats"
			}),
			" below."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"A cooldown is also only one of the install-time controls the package managers now ship. ",
			(0, import_jsx_runtime.jsx)(_components.a, {
				href: "#lifecycle-scripts",
				children: "Lifecycle scripts"
			}),
			" covers disabling or allow-listing install-time script execution, and ",
			(0, import_jsx_runtime.jsx)(_components.a, {
				href: "#pnpms-trust-policy",
				children: "pnpm’s trust policy"
			}),
			" covers rejecting releases whose provenance regressed."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "per-project",
			children: ["Per-project", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#per-project",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Per-project configuration lives in the package manager’s project-local config file and is committed to the repository. The selected tab is remembered across the rest of the post." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(Tabs, {
			groupId: "package-manager",
			children: [
				(0, import_jsx_runtime.jsxs)(Tab, {
					label: "npm",
					children: [
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"The setting belongs in the project’s ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: ".npmrc" }),
							":"
						] }),
						(0, import_jsx_runtime.jsx)(_components.pre, {
							filename: ".npmrc",
							children: (0, import_jsx_runtime.jsxs)(_components.code, {
								className: "hljs language-INI",
								children: [
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-attr",
										children: "min-release-age"
									}),
									"=",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-number",
										children: "1"
									}),
									"\n"
								]
							})
						}),
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"The value is in days. The setting cannot be combined with ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "--before" }),
							" in the same invocation; npm raises an error if both are provided. An npm CLI version that does not recognize the key emits the following warning, which is cosmetic and does not prevent the setting from applying on a supporting CLI:"
						] }),
						(0, import_jsx_runtime.jsx)(_components.pre, { children: (0, import_jsx_runtime.jsx)(_components.code, {
							className: "hljs language-text",
							children: "npm warn Unknown project config \"min-release-age\". This will stop working in the next major version of npm.\n"
						}) })
					]
				}),
				(0, import_jsx_runtime.jsxs)(Tab, {
					label: "pnpm",
					children: [
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"Since pnpm 11, the canonical location is ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "pnpm-workspace.yaml" }),
							":"
						] }),
						(0, import_jsx_runtime.jsx)(_components.pre, {
							filename: "pnpm-workspace.yaml",
							children: (0, import_jsx_runtime.jsxs)(_components.code, {
								className: "hljs language-yaml",
								children: [
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-attr",
										children: "minimumReleaseAge:"
									}),
									" ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-number",
										children: "1440"
									}),
									"\n"
								]
							})
						}),
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"Internal packages that should bypass the gate can be listed under ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "minimumReleaseAgeExclude" }),
							":"
						] }),
						(0, import_jsx_runtime.jsx)(_components.pre, {
							filename: "pnpm-workspace.yaml",
							children: (0, import_jsx_runtime.jsxs)(_components.code, {
								className: "hljs language-yaml",
								children: [
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-attr",
										children: "minimumReleaseAge:"
									}),
									" ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-number",
										children: "1440"
									}),
									"\n",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-attr",
										children: "minimumReleaseAgeExclude:"
									}),
									"\n  ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-bullet",
										children: "-"
									}),
									" ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-string",
										children: "'@platformatic/*'"
									}),
									"\n"
								]
							})
						}),
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"On pnpm 10.x, the same setting is written in ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: ".npmrc" }),
							" with a different casing:"
						] }),
						(0, import_jsx_runtime.jsx)(_components.pre, {
							filename: ".npmrc",
							children: (0, import_jsx_runtime.jsxs)(_components.code, {
								className: "hljs language-INI",
								children: [
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-attr",
										children: "minimum-release-age"
									}),
									"=",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-number",
										children: "1440"
									}),
									"\n"
								]
							})
						}),
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"A known bug on pnpm 10.x causes ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "minimumReleaseAge" }),
							" to be silently ignored when any package in the workspace sets ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "shared-workspace-lockfile=false" }),
							" in its ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: ".npmrc" }),
							".",
							(0, import_jsx_runtime.jsx)(Cite, {
								n: 8,
								href: "https://github.com/pnpm/pnpm/issues/10008",
								children: pnpmLockfileBug
							}),
							" On 10.x, this is worth verifying before assuming the setting is honored."
						] })
					]
				}),
				(0, import_jsx_runtime.jsxs)(Tab, {
					label: "Yarn",
					children: [
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"The setting belongs in ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: ".yarnrc.yml" }),
							" (Yarn Berry 4.10 or later):"
						] }),
						(0, import_jsx_runtime.jsx)(_components.pre, {
							filename: ".yarnrc.yml",
							children: (0, import_jsx_runtime.jsxs)(_components.code, {
								className: "hljs language-yaml",
								children: [
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-attr",
										children: "npmMinimalAgeGate:"
									}),
									" ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-number",
										children: "1440"
									}),
									"\n"
								]
							})
						}),
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"Packages that should bypass the gate can be listed under ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "npmPreapprovedPackages" }),
							":"
						] }),
						(0, import_jsx_runtime.jsx)(_components.pre, {
							filename: ".yarnrc.yml",
							children: (0, import_jsx_runtime.jsxs)(_components.code, {
								className: "hljs language-yaml",
								children: [
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-attr",
										children: "npmMinimalAgeGate:"
									}),
									" ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-number",
										children: "1440"
									}),
									"\n",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-attr",
										children: "npmPreapprovedPackages:"
									}),
									"\n  ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-bullet",
										children: "-"
									}),
									" ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-string",
										children: "'@platformatic/*'"
									}),
									"\n"
								]
							})
						}),
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							(0, import_jsx_runtime.jsx)(_components.code, { children: "npmPreapprovedPackages" }),
							" accepts both glob patterns and exact locators (for example, ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "@aws-sdk/types@3.877.0" }),
							"), giving it more granularity than pnpm’s package-name-only exclude list."
						] }),
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"The documentation states that a duration suffix such as ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "\"7d\"" }),
							" is accepted, but a known parsing bug causes the suffix to be dropped.",
							(0, import_jsx_runtime.jsx)(Cite, {
								n: 9,
								href: "https://github.com/yarnpkg/berry/issues/6991",
								children: yarnSuffixBug
							}),
							" Until that is resolved, a plain minute count is the reliable form: one day is ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "npmMinimalAgeGate: 1440" }),
							"."
						] })
					]
				}),
				(0, import_jsx_runtime.jsxs)(Tab, {
					label: "Bun",
					children: [
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"The setting belongs under ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "[install]" }),
							" in ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "bunfig.toml" }),
							":"
						] }),
						(0, import_jsx_runtime.jsx)(_components.pre, {
							filename: "bunfig.toml",
							children: (0, import_jsx_runtime.jsxs)(_components.code, {
								className: "hljs language-toml",
								children: [
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-section",
										children: "[install]"
									}),
									"\n",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-attr",
										children: "minimumReleaseAge"
									}),
									" = ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-number",
										children: "86400"
									}),
									"\n"
								]
							})
						}),
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"The value is in seconds. One day is ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "86400" }),
							"."
						] }),
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"Packages that should bypass the gate can be listed under ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "minimumReleaseAgeExcludes" }),
							":"
						] }),
						(0, import_jsx_runtime.jsx)(_components.pre, {
							filename: "bunfig.toml",
							children: (0, import_jsx_runtime.jsxs)(_components.code, {
								className: "hljs language-toml",
								children: [
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-section",
										children: "[install]"
									}),
									"\n",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-attr",
										children: "minimumReleaseAge"
									}),
									" = ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-number",
										children: "86400"
									}),
									"\n",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-attr",
										children: "minimumReleaseAgeExcludes"
									}),
									" = [",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-string",
										children: "\"@types/node\""
									}),
									", ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-string",
										children: "\"typescript\""
									}),
									"]\n"
								]
							})
						})
					]
				})
			]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "user-wide",
			children: ["User-wide", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#user-wide",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "User-wide configuration applies on a single machine, across every repository that does not override it." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(Tabs, {
			groupId: "package-manager",
			children: [
				(0, import_jsx_runtime.jsxs)(Tab, {
					label: "npm",
					children: [(0, import_jsx_runtime.jsx)(_components.pre, { children: (0, import_jsx_runtime.jsxs)(_components.code, {
						className: "hljs language-bash",
						children: [
							"npm config ",
							(0, import_jsx_runtime.jsx)(_components.span, {
								className: "hljs-built_in",
								children: "set"
							}),
							" min-release-age 1 --location=user\n"
						]
					}) }), (0, import_jsx_runtime.jsxs)(_components.p, { children: [
						"This writes to ",
						(0, import_jsx_runtime.jsx)(_components.code, { children: "~/.npmrc" }),
						". Substituting ",
						(0, import_jsx_runtime.jsx)(_components.code, { children: "global" }),
						" for ",
						(0, import_jsx_runtime.jsx)(_components.code, { children: "user" }),
						" writes to the global npm configuration instead."
					] })]
				}),
				(0, import_jsx_runtime.jsxs)(Tab, {
					label: "pnpm",
					children: [
						(0, import_jsx_runtime.jsx)(_components.pre, { children: (0, import_jsx_runtime.jsxs)(_components.code, {
							className: "hljs language-bash",
							children: [
								"pnpm config ",
								(0, import_jsx_runtime.jsx)(_components.span, {
									className: "hljs-built_in",
									children: "set"
								}),
								" minimumReleaseAge 1440 --location=user\n"
							]
						}) }),
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"On pnpm 11 and later, non-auth settings written this way land in a global ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "config.yaml" }),
							" whose location is platform-specific: ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "~/.config/pnpm/config.yaml" }),
							" on Linux, ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "~/Library/Preferences/pnpm/config.yaml" }),
							" on macOS, and ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "~/AppData/Local/pnpm/config/config.yaml" }),
							" on Windows. Setting ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "$XDG_CONFIG_HOME" }),
							" moves the file to ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "$XDG_CONFIG_HOME/pnpm/config.yaml" }),
							" on every platform, macOS included.",
							(0, import_jsx_runtime.jsx)(Cite, {
								n: 19,
								href: "https://pnpm.io/cli/config",
								children: pnpmConfigLocations
							})
						] }),
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"The platform split makes hand-editing risky: a ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "config.yaml" }),
							" written to the Linux path on a Mac sits in a file pnpm never reads, and nothing warns about it. Auth and registry settings follow the same directory rules but go to a sibling ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "rc" }),
							" file in INI format — and on pnpm 11, that INI file is consulted ",
							(0, import_jsx_runtime.jsx)(_components.em, { children: "only" }),
							" for auth and registry keys, so a ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "minimum-release-age=" }),
							" line carried over from pnpm 10 is silently ignored as well. Writing through ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "pnpm config set --location=user" }),
							" targets the correct file on every OS, and running ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "pnpm config get minimumReleaseAge" }),
							" from outside any project confirms the value is actually being read back."
						] })
					]
				}),
				(0, import_jsx_runtime.jsxs)(Tab, {
					label: "Yarn",
					children: [(0, import_jsx_runtime.jsx)(_components.pre, { children: (0, import_jsx_runtime.jsxs)(_components.code, {
						className: "hljs language-bash",
						children: [
							"yarn config ",
							(0, import_jsx_runtime.jsx)(_components.span, {
								className: "hljs-built_in",
								children: "set"
							}),
							" --home npmMinimalAgeGate 1440\n"
						]
					}) }), (0, import_jsx_runtime.jsxs)(_components.p, { children: [
						(0, import_jsx_runtime.jsx)(_components.code, { children: "--home" }),
						" writes to ",
						(0, import_jsx_runtime.jsx)(_components.code, { children: "~/.yarnrc.yml" }),
						" rather than the project-local file."
					] })]
				}),
				(0, import_jsx_runtime.jsxs)(Tab, {
					label: "Bun",
					children: [
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"The same ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "[install]" }),
							" table written in a user-wide bunfig applies across projects. Bun reads ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "~/.bunfig.toml" }),
							" — or ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "$XDG_CONFIG_HOME/.bunfig.toml" }),
							" when that variable is set — and merges it with the project file, with the project file winning on conflicting keys:",
							(0, import_jsx_runtime.jsx)(Cite, {
								n: 20,
								href: "https://bun.sh/docs/runtime/bunfig#global-vs-local",
								children: bunGlobalBunfig
							})
						] }),
						(0, import_jsx_runtime.jsx)(_components.pre, {
							filename: "~/.bunfig.toml",
							children: (0, import_jsx_runtime.jsxs)(_components.code, {
								className: "hljs language-toml",
								children: [
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-section",
										children: "[install]"
									}),
									"\n",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-attr",
										children: "minimumReleaseAge"
									}),
									" = ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-number",
										children: "86400"
									}),
									"\n"
								]
							})
						}),
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"The merge is per-key, so a project ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "bunfig.toml" }),
							" that sets an unrelated ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "[install]" }),
							" option (for example, ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "install.exact" }),
							") still inherits the user-wide cooldown. A machine-wide layer below both files (",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "/etc/bunfig.toml" }),
							"), aimed at fleet-level enforcement, is proposed in an open pull request.",
							(0, import_jsx_runtime.jsx)(Cite, {
								n: 10,
								href: "https://github.com/oven-sh/bun/pull/28727",
								children: bunSystemWidePr
							})
						] })
					]
				})
			]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "lifecycle-scripts",
			children: ["Lifecycle scripts", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#lifecycle-scripts",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"A cooldown controls ",
			(0, import_jsx_runtime.jsx)(_components.em, { children: "when" }),
			" a version becomes installable; it says nothing about what the package does once it lands. Install-time lifecycle scripts (",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "preinstall" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "install" }),
			", ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "postinstall" }),
			") run arbitrary shell commands during ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "install" }),
			", which makes them the primary payload mechanism in npm supply-chain attacks — the malicious code in a compromised release typically runs from a ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "postinstall" }),
			" hook, not from anything the application imports. All four tools can disable these scripts outright or gate them behind a per-package allowlist. The granular options are recent additions, so the ",
			(0, import_jsx_runtime.jsx)(_components.a, {
				href: "#caveats",
				children: "pinned-version caveat"
			}),
			" applies here just as much as it does to the cooldown."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(Tabs, {
			groupId: "package-manager",
			children: [
				(0, import_jsx_runtime.jsxs)(Tab, {
					label: "npm",
					children: [
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"The blunt instrument is ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "ignore-scripts" }),
							", which works on every npm version:"
						] }),
						(0, import_jsx_runtime.jsx)(_components.pre, {
							filename: ".npmrc",
							children: (0, import_jsx_runtime.jsxs)(_components.code, {
								className: "hljs language-INI",
								children: [
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-attr",
										children: "ignore-scripts"
									}),
									"=",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-literal",
										children: "true"
									}),
									"\n"
								]
							})
						}),
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"This disables lifecycle scripts for all dependencies, but it also affects the project’s own hooks: ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "npm run" }),
							", ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "npm start" }),
							", and ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "npm test" }),
							" still execute the named script, but skip its pre- and post-scripts."
						] }),
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"npm ",
							(0, import_jsx_runtime.jsx)(_components.strong, { children: "11.16.0" }),
							" adds a granular alternative: an ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "allowScripts" }),
							" field in ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "package.json" }),
							", managed with ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "npm approve-scripts" }),
							" and ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "npm deny-scripts" }),
							".",
							(0, import_jsx_runtime.jsx)(Cite, {
								n: 11,
								href: "https://docs.npmjs.com/cli/v11/commands/npm-approve-scripts",
								children: npmApproveScripts
							}),
							" On npm 11 the field is advisory — unreviewed install scripts still run, and the install prints a warning listing them. Enforcement is opt-in:"
						] }),
						(0, import_jsx_runtime.jsx)(_components.pre, {
							filename: ".npmrc",
							children: (0, import_jsx_runtime.jsxs)(_components.code, {
								className: "hljs language-INI",
								children: [
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-attr",
										children: "strict-allow-scripts"
									}),
									"=",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-literal",
										children: "true"
									}),
									"\n"
								]
							})
						}),
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"npm v12 (estimated July 2026) makes enforcement the default: install scripts from dependencies will not run unless explicitly allowed, and git and remote-URL dependencies will not resolve unless ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "--allow-git" }),
							" or ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "--allow-remote" }),
							" is granted.",
							(0, import_jsx_runtime.jsx)(Cite, {
								n: 12,
								href: "https://github.com/orgs/community/discussions/198547",
								children: npmV12Plan
							})
						] })
					]
				}),
				(0, import_jsx_runtime.jsxs)(Tab, {
					label: "pnpm",
					children: [
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"Since pnpm 10, dependency build scripts do not run unless approved. ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "pnpm approve-builds" }),
							" walks through the dependencies that want to run them, and the approvals are recorded in the ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "allowBuilds" }),
							" map (pnpm 10.26 and later; it replaces ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "onlyBuiltDependencies" }),
							" and ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "neverBuiltDependencies" }),
							" in pnpm 11):",
							(0, import_jsx_runtime.jsx)(Cite, {
								n: 13,
								href: "https://pnpm.io/settings#allowbuilds",
								children: pnpmAllowBuilds
							})
						] }),
						(0, import_jsx_runtime.jsx)(_components.pre, {
							filename: "pnpm-workspace.yaml",
							children: (0, import_jsx_runtime.jsxs)(_components.code, {
								className: "hljs language-yaml",
								children: [
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-attr",
										children: "allowBuilds:"
									}),
									"\n  ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-attr",
										children: "esbuild:"
									}),
									" ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-literal",
										children: "true"
									}),
									"\n  ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-attr",
										children: "core-js:"
									}),
									" ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-literal",
										children: "false"
									}),
									"\n"
								]
							})
						}),
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"Packages not listed are not built. ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "strictDepBuilds" }),
							" (default ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "true" }),
							") fails the install with a non-zero exit code when any dependency has an unreviewed build script, which turns a warning into a CI gate. The escape hatch that runs everything without approval is named ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "dangerouslyAllowAllBuilds" }),
							", which is a fair summary of what it does."
						] })
					]
				}),
				(0, import_jsx_runtime.jsxs)(Tab, {
					label: "Yarn",
					children: [
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [(0, import_jsx_runtime.jsx)(_components.code, { children: "enableScripts: false" }), " stops postinstall scripts from third-party packages; workspace packages still run their own:"] }),
						(0, import_jsx_runtime.jsx)(_components.pre, {
							filename: ".yarnrc.yml",
							children: (0, import_jsx_runtime.jsxs)(_components.code, {
								className: "hljs language-yaml",
								children: [
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-attr",
										children: "enableScripts:"
									}),
									" ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-literal",
										children: "false"
									}),
									"\n"
								]
							})
						}),
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							(0, import_jsx_runtime.jsx)(_components.code, { children: "false" }),
							" is the default since Yarn ",
							(0, import_jsx_runtime.jsx)(_components.strong, { children: "4.14.0" }),
							"; every earlier release defaulted to ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "true" }),
							".",
							(0, import_jsx_runtime.jsx)(Cite, {
								n: 18,
								href: "https://github.com/yarnpkg/berry/pull/7089",
								children: yarnEnableScriptsDefaultPr
							}),
							" The 4.14 migration also preserves old behavior by writing an explicit ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "enableScripts: true" }),
							" into existing projects, so a repository upgraded across the flip stays opted in until that line is removed. Both conditions argue for setting ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "false" }),
							" explicitly rather than relying on the default. Individual packages are opted back in through ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "dependenciesMeta" }),
							" in ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "package.json" }),
							", which acts as an allowlist while scripts are globally disabled:",
							(0, import_jsx_runtime.jsx)(Cite, {
								n: 14,
								href: "https://yarnpkg.com/configuration/yarnrc#enableScripts",
								children: yarnEnableScripts
							})
						] }),
						(0, import_jsx_runtime.jsx)(_components.pre, {
							filename: "package.json",
							children: (0, import_jsx_runtime.jsxs)(_components.code, {
								className: "hljs language-json",
								children: [
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-punctuation",
										children: "{"
									}),
									"\n  ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-attr",
										children: "\"dependenciesMeta\""
									}),
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-punctuation",
										children: ":"
									}),
									" ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-punctuation",
										children: "{"
									}),
									"\n    ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-attr",
										children: "\"esbuild\""
									}),
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-punctuation",
										children: ":"
									}),
									" ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-punctuation",
										children: "{"
									}),
									" ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-attr",
										children: "\"built\""
									}),
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-punctuation",
										children: ":"
									}),
									" ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-literal",
										children: (0, import_jsx_runtime.jsx)(_components.span, {
											className: "hljs-keyword",
											children: "true"
										})
									}),
									" ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-punctuation",
										children: "}"
									}),
									"\n  ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-punctuation",
										children: "}"
									}),
									"\n",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-punctuation",
										children: "}"
									}),
									"\n"
								]
							})
						}),
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"Yarn also ships ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "enableHardenedMode" }),
							", which re-validates lockfile resolutions and checksums against the remote registry during install. It is enabled automatically on pull requests from public GitHub repositories and can be forced on for any branch edited from outside the circle of trust.",
							(0, import_jsx_runtime.jsx)(Cite, {
								n: 15,
								href: "https://yarnpkg.com/configuration/yarnrc#enableHardenedMode",
								children: yarnHardenedMode
							})
						] })
					]
				}),
				(0, import_jsx_runtime.jsxs)(Tab, {
					label: "Bun",
					children: [
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"Bun is default-secure here: lifecycle scripts only run for packages on a curated default trusted list, and only when those packages are installed from npm. Additional packages are trusted via ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "trustedDependencies" }),
							" in ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "package.json" }),
							":",
							(0, import_jsx_runtime.jsx)(Cite, {
								n: 16,
								href: "https://bun.sh/docs/install/lifecycle",
								children: bunLifecycle
							})
						] }),
						(0, import_jsx_runtime.jsx)(_components.pre, {
							filename: "package.json",
							children: (0, import_jsx_runtime.jsxs)(_components.code, {
								className: "hljs language-json",
								children: [
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-punctuation",
										children: "{"
									}),
									"\n  ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-attr",
										children: "\"trustedDependencies\""
									}),
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-punctuation",
										children: ":"
									}),
									" ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-punctuation",
										children: "["
									}),
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-string",
										children: "\"node-sass\""
									}),
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-punctuation",
										children: "]"
									}),
									"\n",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-punctuation",
										children: "}"
									}),
									"\n"
								]
							})
						}),
						(0, import_jsx_runtime.jsxs)(_components.p, { children: [
							"Defining the field ",
							(0, import_jsx_runtime.jsx)(_components.em, { children: "replaces" }),
							" the default list rather than extending it, so an explicit list must re-include any default-trusted packages whose scripts are still needed (",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "sharp" }),
							", ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "esbuild" }),
							", and similar). Setting ",
							(0, import_jsx_runtime.jsx)(_components.code, { children: "trustedDependencies: []" }),
							" opts out of the default list entirely. Disabling scripts wholesale is also available:"
						] }),
						(0, import_jsx_runtime.jsx)(_components.pre, {
							filename: "bunfig.toml",
							children: (0, import_jsx_runtime.jsxs)(_components.code, {
								className: "hljs language-toml",
								children: [
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-section",
										children: "[install]"
									}),
									"\n",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-attr",
										children: "ignoreScripts"
									}),
									" = ",
									(0, import_jsx_runtime.jsx)(_components.span, {
										className: "hljs-literal",
										children: "true"
									}),
									"\n"
								]
							})
						})
					]
				})
			]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "pnpms-trust-policy",
			children: ["pnpm’s trust policy", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#pnpms-trust-policy",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"pnpm 10.21 adds a check orthogonal to both the cooldown and script gating. With ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "trustPolicy" }),
			" set to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "no-downgrade" }),
			", the install fails if a package’s trust level has decreased relative to its earlier releases — for example, a package whose previous versions carried provenance attestations suddenly shipping a version without one.",
			(0, import_jsx_runtime.jsx)(Cite, {
				n: 17,
				href: "https://pnpm.io/settings#trustpolicy",
				children: pnpmTrustPolicy
			}),
			" That signature is characteristic of a stolen-token compromise: the attacker publishes from their own machine, and the provenance that the maintainer’s CI pipeline would have attached is missing."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, {
			filename: "pnpm-workspace.yaml",
			children: (0, import_jsx_runtime.jsxs)(_components.code, {
				className: "hljs language-yaml",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "trustPolicy:"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-literal",
						children: "no"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "-downgrade"
					}),
					"\n"
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Two companion settings handle false positives. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "trustPolicyExclude" }),
			" (pnpm 10.22) takes package selectors to skip, for packages that legitimately changed how they publish. ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "trustPolicyIgnoreAfter" }),
			" (pnpm 10.27) skips the check for versions older than a given number of minutes — the cooldown’s reasoning applied in reverse: a release that has been public for weeks without being pulled is unlikely to be the compromise this check exists to catch. Like the cooldown, the setting can be written per-project in ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "pnpm-workspace.yaml" }),
			" or user-wide with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "pnpm config set trustPolicy no-downgrade --location=user" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "caveats",
			children: ["Caveats", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#caveats",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "A handful of conditions can quietly bypass the configured cooldown or change what is actually being honored." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.strong, { children: "The check runs at install time, not when an updater opens a PR." }),
			" Renovate and Dependabot evaluate updates independently of the package manager’s cooldown, so their own cooldown options must be set separately. Both ship reasonable defaults: Renovate’s ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "config:best-practices" }),
			" preset waits three days before raising an npm update,",
			(0, import_jsx_runtime.jsx)(Cite, {
				n: 5,
				href: "https://docs.renovatebot.com/presets-config/#configbest-practices",
				children: renovateBestPractices
			}),
			" and Dependabot exposes ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "cooldown.default-days" }),
			" with semver-specific overrides.",
			(0, import_jsx_runtime.jsx)(Cite, {
				n: 6,
				href: "https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#cooldown",
				children: dependabotCooldown
			})
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.strong, { children: "A repository’s pinned package manager is what actually runs the install." }),
			" A pin via the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "packageManager" }),
			" field, Corepack, Volta, a Docker base image, or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "setup-node" }),
			" with ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "version-file" }),
			" overrides whatever is installed globally. If the pinned version predates cooldown support, every layer of configuration above it is inert. The most reliable check is to run ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "pnpm --version" }),
			" (or the equivalent) from inside the repository, or to inspect the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "setup-node" }),
			" step in the CI log."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [(0, import_jsx_runtime.jsx)(_components.strong, { children: "Project-level configuration takes precedence over user-level configuration in all four tools." }), " A user-wide cooldown of one day does not apply inside a repository whose project config sets a smaller value or none at all. A user-wide value is not a backstop for repositories that have not opted in."] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.strong, { children: "The user-wide file lives at a different path per operating system for pnpm and Bun." }),
			" npm and Yarn read ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "~/.npmrc" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "~/.yarnrc.yml" }),
			" from the home directory everywhere, but pnpm’s global ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "config.yaml" }),
			" moves between ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "~/.config/pnpm/" }),
			" (Linux), ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "~/Library/Preferences/pnpm/" }),
			" (macOS), and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "~/AppData/Local/pnpm/config/" }),
			" (Windows),",
			(0, import_jsx_runtime.jsx)(Cite, {
				n: 19,
				href: "https://pnpm.io/cli/config",
				children: pnpmConfigLocations
			}),
			" and Bun switches from ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "~/.bunfig.toml" }),
			" to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "$XDG_CONFIG_HOME/.bunfig.toml" }),
			" when the variable is set. A config file hand-written to the path from another operating system’s documentation is silently ignored. Writing through the tool’s own CLI and then reading the value back from outside any project confirms the setting landed somewhere it will actually be read."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.strong, { children: "None of the four tools support per-registry scoping." }),
			" Internal packages from a private registry are subject to the cooldown unless explicitly listed in the per-tool exclusion option. npm does not yet expose one; an issue is open against the CLI tracking it.",
			(0, import_jsx_runtime.jsx)(Cite, {
				n: 7,
				href: "https://github.com/npm/cli/issues/8994",
				children: npmExcludeIssue
			})
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			(0, import_jsx_runtime.jsx)(_components.strong, { children: "Defaults are shifting upward." }),
			" pnpm 11 ships with the gate enabled at 1440 minutes by default,",
			(0, import_jsx_runtime.jsx)(Cite, {
				n: 2,
				href: "https://pnpm.io/settings#minimumreleaseage",
				children: pnpmDocs
			}),
			" and npm v12 is set to make install scripts and non-registry dependency sources opt-in.",
			(0, import_jsx_runtime.jsx)(Cite, {
				n: 12,
				href: "https://github.com/orgs/community/discussions/198547",
				children: npmV12Plan
			}),
			" Setting explicit values insulates the configured behavior against changes elsewhere in the ecosystem."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "acknowledgements",
			children: ["Acknowledgements", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#acknowledgements",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This digest closely follows two gists that did the original work of pulling the per-tool settings together:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"Matteo Collina, ",
				(0, import_jsx_runtime.jsx)("a", {
					href: "https://gist.github.com/mcollina/b294a6c39ee700d24073c0e5a4e93104",
					target: "_blank",
					rel: "noopener noreferrer",
					children: "“Configuring minimum release age across npm, pnpm, and yarn”"
				}),
				" (April 2026). The original write-up covering npm, pnpm, and Yarn."
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"Tom Ricci, ",
				(0, import_jsx_runtime.jsx)("a", {
					href: "https://gist.github.com/tom-ricci/bade55606ebb7a550598f11e29f1d6b0",
					target: "_blank",
					rel: "noopener noreferrer",
					children: "“Configuring minimum release age across npm, pnpm, yarn, and bun”"
				}),
				". Extended Collina’s notes with Bun coverage and the per-tool exclusion options."
			] }),
			"\n"
		] })
	] });
}
function MDXContent$11(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime.jsx)(_createMdxContent$11, { ...props })
	}) : _createMdxContent$11(props);
}
function _missingMdxReference$11(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/package-manager-release-cooldown/post.ts
var packageManagerReleaseCooldown = {
	mdx: MDXContent$11,
	publishDate: new Date(2026, 4, 29),
	slug: "package-manager-release-cooldown",
	title: "Locking down dependency installs across npm, pnpm, yarn, and bun",
	description: `A reference for configuring a minimum release age (or "cooldown") in npm, pnpm, Yarn, and Bun. Covers the setting name, unit, and minimum supported version for each tool, the per-project and user-wide forms, and the configurations under which the cooldown is silently bypassed — plus the complementary lockdown settings: disabling or allow-listing install-time lifecycle scripts, and pnpm's provenance trust policy.`,
	tags: [
		"technical",
		"tooling",
		"devops",
		"javascript"
	]
};
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/superpowered-git-aliases/contents.mdx
function _createMdxContent$10(props) {
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
	}, { Anchor } = _components;
	if (!Anchor) _missingMdxReference$10("Anchor", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.h1, {
			id: "superpowered-git-aliases-using-scripting",
			children: "Superpowered Git Aliases using Scripting"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "table-of-contents",
			children: "Table of Contents"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime.jsx)(_components.a, {
					href: "#what-are-git-aliases",
					children: "What are Git Aliases"
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
					"\n",
					(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
						href: "#simple-aliases",
						children: "Simple Aliases"
					}) }),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
						href: "#more-complex-aliases",
						children: "More Complex Aliases"
					}) }),
					"\n"
				] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				(0, import_jsx_runtime.jsx)(_components.a, {
					href: "#setting-up-aliases-with-scripts",
					children: "Setting up Aliases with Scripts"
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
					"\n",
					(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
						href: "#case-study-rebase-main--master",
						children: "Case Study: Rebase Main / master"
					}) }),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
						href: "#case-study-amend",
						children: "Case Study: Amend"
					}) }),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
						href: "#some-caveats",
						children: "Some Caveats"
					}) }),
					"\n"
				] }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: (0, import_jsx_runtime.jsx)(_components.a, {
				href: "#conclusion",
				children: "Conclusion"
			}) }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "what-are-git-aliases",
			children: ["What are Git Aliases", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#what-are-git-aliases",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Git aliases work similarly to regular aliases in the shell, but they are specific to Git commands. They allow you to create shortcuts for longer commands or to create new commands that are not available by default." }),
		"\n",
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Aliases run in the same shell environment as other git commands, and are mostly used to simplify common workflows." }),
		"\n",
		"\n",
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "simple-aliases",
			children: ["Simple Aliases", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#simple-aliases",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		"\n",
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Simple aliases call a single Git command with a set of arguments. For example, you can create an alias to show the status of the repository by running ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "git status" }),
			" with the ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "s" }),
			" alias:"
		] }),
		"\n",
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, {
			filename: "~/.gitconfig",
			children: (0, import_jsx_runtime.jsxs)(_components.code, {
				className: "hljs language-INI",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-section",
						children: "[alias]"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "s"
					}),
					" = status\n"
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"You can then run ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "git s" }),
			" to show the status of the repository. Because we configured the alias in ~/.gitconfig, it is available for all repositories on the system."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "more-complex-aliases",
			children: ["More Complex Aliases", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#more-complex-aliases",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"You can also create git aliases that run an arbitrary shell command. To do so, the alias needs to start with a ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "!" }),
			". This tells git to execute the alias as if it was not a git subcommand. For example, if you wanted to run two git commands in sequence, you could create an alias that runs a shell command:"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, {
			filename: "~/.gitconfig",
			children: (0, import_jsx_runtime.jsxs)(_components.code, {
				className: "hljs language-INI",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-section",
						children: "[alias]"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "my-alias"
					}),
					" = !git fetch && git rebase origin/master\n"
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"This alias runs ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "git fetch" }),
			" and ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "git rebase origin/main" }),
			" in sequence when you run ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "git my-alias" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "One limitation of git aliases is that they cannot be set to a multiline value. This means that for more complex aliases you will need to minify them." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Additionally, in an INI file a ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: ";" }),
			" character is used to comment out the rest of the line. This means that you cannot use ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: ";" }),
			" in your alias commands."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"These two limitations can make it difficult to create more complex aliases using the standard git alias syntax, but it can still be done. For example, an alias using ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "if" }),
			" to branch may look like this:"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, {
			filename: "~/.gitconfig",
			children: (0, import_jsx_runtime.jsxs)(_components.code, {
				className: "hljs language-INI",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-section",
						children: "[alias]"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "branch-if"
					}),
					" = !bash -c ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"'!f() { if [ -z \\\"$1\\\" ]; then echo \\\"Usage: git branch-if <branch-name>\\\"; else git checkout -b $1; fi; }; f'\""
					}),
					"\n"
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "These limits make it way more complex to create and maintain aliases that have any form of control flow within them. This is where scripting comes in." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "setting-up-aliases-with-scripts",
			children: ["Setting up Aliases with Scripts", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#setting-up-aliases-with-scripts",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "You can script a gitalias using any programming language you’d like. If you are familiar with bash scripting and would like to use it, you can create a bash script that runs the desired git commands. The truth is that I am much stronger with JavaScript, so that is what I will use." }),
		"\n",
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"One other major benefit is that by using a scripting language, your aliases can take and operate on arguments ",
			(0, import_jsx_runtime.jsx)(_components.strong, { children: "much" }),
			" more easily. Git will forward any arguments you pass on the CLI to your alias by appending them to the end of your command. As such, your script should be able to read them without issue. For example, in Node.js you can access the arguments passed to the script directly on ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "process.argv" }),
			"."
		] }),
		"\n",
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The basic steps to set this up do not change based on the language chosen. You’ll need to:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Create a script that runs the desired git commands" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Write an alias that runs the script" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "case-study-rebase-main--master",
			children: ["Case Study: Rebase Main / master", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#case-study-rebase-main--master",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"In recent years the default branch name for new repositories has changed from ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "master" }),
			" to ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "main" }),
			". This means that when you clone a new repository, the default branch may be ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "main" }),
			" instead of ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "master" }),
			". There is no longer a super consistent name, as the ecosystem is in transition. This is overall a good thing, but it means that our alias above to rebase will not work in all cases."
		] }),
		"\n",
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"We need to update our alias to check if the branch is ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "main" }),
			" or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "master" }),
			" and then rebase the correct branch. This is a perfect use case for a script."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, {
			filename: "~/gitaliases/git-rebase-main.js",
			children: (0, import_jsx_runtime.jsxs)(_components.code, {
				className: "hljs language-javascript",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-meta",
						children: "#!/usr/bin/env node"
					}),
					"\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" { execSync } = ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-built_in",
						children: "require"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'child_process'"
					}),
					");\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-comment",
						children: "// We want to run some commands and not immediately fail if they fail"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "function"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "tryExec"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-params",
						children: "command"
					}),
					") {\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "try"
					}),
					" {\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "return"
					}),
					" {\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "status"
					}),
					": ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-number",
						children: "0"
					}),
					"\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "stdout"
					}),
					": ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "execSync"
					}),
					"(command);\n    }\n  } ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "catch"
					}),
					" (error) {\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "return"
					}),
					" {\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "status"
					}),
					": error.",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-property",
						children: "status"
					}),
					",\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "stdout"
					}),
					": error.",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-property",
						children: "stdout"
					}),
					",\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "stderr"
					}),
					": error.",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-property",
						children: "stderr"
					}),
					",\n    }\n  }\n}\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "function"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "getOriginRemoteName"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, { className: "hljs-params" }),
					") {\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" { stdout, code } = ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "tryExec"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"git remote\""
					}),
					", ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-literal",
						children: "true"
					}),
					");\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "if"
					}),
					" (code !== ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-number",
						children: "0"
					}),
					") {\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "throw"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "new"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title class_",
						children: "Error"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"Failed to get remote name. \\n\""
					}),
					" + stdout);\n  }\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-comment",
						children: "// If there is an upstream remote, use that, otherwise use origin"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "return"
					}),
					" stdout.",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "includes"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"upstream\""
					}),
					") ? ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"upstream\""
					}),
					" : ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"origin\""
					}),
					";\n}\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-comment",
						children: "// --verify returns code 0 if the branch exists, 1 if it does not"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" hasMain = ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "tryExec"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'git show-ref --verify refs/heads/main'"
					}),
					").",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-property",
						children: "status"
					}),
					" === ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-number",
						children: "0"
					}),
					";\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-comment",
						children: "// If main is present, we want to rebase main, otherwise rebase master"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" branch = hasMain ? ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'main'"
					}),
					" : ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'master'"
					}),
					";\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" remote = ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "getOriginRemoteName"
					}),
					"()\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-comment",
						children: "// Updates the local branch with the latest changes from the remote"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "execSync"
					}),
					"(",
					(0, import_jsx_runtime.jsxs)(_components.span, {
						className: "hljs-string",
						children: [
							"`git fetch ",
							(0, import_jsx_runtime.jsx)(_components.span, {
								className: "hljs-subst",
								children: "${remote}"
							}),
							" ",
							(0, import_jsx_runtime.jsx)(_components.span, {
								className: "hljs-subst",
								children: "${branch}"
							}),
							"`"
						]
					}),
					", {",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "stdio"
					}),
					": ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'inherit'"
					}),
					"});\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-comment",
						children: "// Rebases the current branch on top of the remote branch"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "execSync"
					}),
					"(",
					(0, import_jsx_runtime.jsxs)(_components.span, {
						className: "hljs-string",
						children: [
							"`git rebase ",
							(0, import_jsx_runtime.jsx)(_components.span, {
								className: "hljs-subst",
								children: "${remote}"
							}),
							"/",
							(0, import_jsx_runtime.jsx)(_components.span, {
								className: "hljs-subst",
								children: "${branch}"
							}),
							"`"
						]
					}),
					", {",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "stdio"
					}),
					": ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'inherit'"
					}),
					"});\n"
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Currently, to run the script we’d need to run ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "node ~/gitaliases/git-rebase-main.js" }),
			". This is not ideal, and isn’t something you’d ever get in the habit of doing. We can make this easier by creating a git alias that runs the script."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, {
			filename: "~/.gitconfig",
			children: (0, import_jsx_runtime.jsxs)(_components.code, {
				className: "hljs language-INI",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-section",
						children: "[alias]"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "rebase-main"
					}),
					" = !node ~/gitaliases/git-rebase-main.js\n"
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Now you can run ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "git rebase-main" }),
			" to rebase the correct branch, regardless of if it is ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "main" }),
			" or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "master" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "case-study-amend",
			children: ["Case Study: Amend", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#case-study-amend",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Another alias that I set up on all my machines is to amend the last commit. This is a super common workflow for me, and I like to have it as a single command. This is a great use case for a script, as it is a short command that I want to run often." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, {
			filename: "~/gitaliases/git-amend.js",
			children: (0, import_jsx_runtime.jsxs)(_components.code, {
				className: "hljs language-javascript",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-meta",
						children: "#!/usr/bin/env node"
					}),
					"\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-comment",
						children: "// Usage: git amend [undo]"
					}),
					"\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" tryExec = ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-built_in",
						children: "require"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'./utils/try-exec'"
					}),
					");\n\n",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "async"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "function"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "getBranchesPointingAtHead"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, { className: "hljs-params" }),
					") {\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" { stdout, code } = ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "await"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "tryExec"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'git branch --points-at HEAD'"
					}),
					", ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-literal",
						children: "true"
					}),
					");\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "if"
					}),
					" (code !== ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-number",
						children: "0"
					}),
					") {\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "throw"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "new"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title class_",
						children: "Error"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'Failed to get branches pointing at HEAD. \\n'"
					}),
					" + stdout);\n  }\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "return"
					}),
					" stdout.",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "split"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'\\n'"
					}),
					").",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "filter"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title class_",
						children: "Boolean"
					}),
					");\n}\n\n(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "async"
					}),
					" () => {\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "const"
					}),
					" branches = ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "await"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "getBranchesPointingAtHead"
					}),
					"();\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "if"
					}),
					" (branches.",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-property",
						children: "length"
					}),
					" !== ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-number",
						children: "1"
					}),
					") {\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-variable language_",
						children: "console"
					}),
					".",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "log"
					}),
					"(\n      ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'Current commit is relied on by other branches, avoid amending it.'"
					}),
					"\n    );\n    process.",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "exit"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-number",
						children: "1"
					}),
					");\n  }\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "if"
					}),
					" (process.",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-property",
						children: "argv"
					}),
					"[",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-number",
						children: "2"
					}),
					"] === ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'undo'"
					}),
					") {\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "await"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "tryExec"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'git reset --soft HEAD@{1}'"
					}),
					");\n  } ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "else"
					}),
					" {\n    ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-keyword",
						children: "await"
					}),
					" ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-title function_",
						children: "tryExec"
					}),
					"(",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "'git commit --amend --no-edit'"
					}),
					");\n  }\n})();\n"
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This script is a bit more complex than the last one, as it has some control flow in it. It will check if the current commit is relied on by other branches, and if it is it will exit with an error. This is to prevent you from amending a commit that is relied on by other branches, as doing so would cause issues when trying to merge whichever branch relies on the commit." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "To set up the alias, you can use the same method as before:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, {
			filename: "~/.gitconfig",
			children: (0, import_jsx_runtime.jsxs)(_components.code, {
				className: "hljs language-INI",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-section",
						children: "[alias]"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "amend"
					}),
					" = !node ~/gitaliases/git-amend.js\n"
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Now you can run ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "git amend" }),
			" to amend the last commit, or ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "git amend undo" }),
			" to undo the last amend. This is a script that I initially wrote inline in my gitconfig, but as it grew in complexity I moved it to a script file. This is a great way to manage complexity in your aliases. For comparison, here is the original alias:"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.pre, {
			filename: "~/.gitconfig",
			children: (0, import_jsx_runtime.jsxs)(_components.code, {
				className: "hljs language-INI",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-section",
						children: "[alias]"
					}),
					"\n  ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-attr",
						children: "amend"
					}),
					" = !bash -c ",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\"'f() { if [ $(git branch --points-at HEAD | wc -l) != 1 ]; then echo Current commit is relied on by other branches, avoid amending it.; exit 1; fi; if [ \\\"$0\\\" = \""
					}),
					"undo",
					(0, import_jsx_runtime.jsx)(_components.span, {
						className: "hljs-string",
						children: "\" ]; then git reset --soft \\\"HEAD@{1}\\\"; else git commit --amend --no-edit; fi }; f'\""
					}),
					"\n"
				]
			})
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This script could have been extracted to a .sh file as well, but keeping things in node lowers the maintenance burden for me personally. In the past, anytime I needed to update this alias I would have to paste it into a bash linter, make my changes, minify it, and then paste it back into my gitconfig. This was a pain, and I would often avoid updating the alias because of it. Now that it is in a script file, I can update it like any other script." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "some-caveats",
			children: ["Some Caveats", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#some-caveats",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Setting up aliases as scripts can unlock a whole new level of power in your git aliases. However, there are some things to be aware of when doing this." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"When setting up aliases like this, its important to remember that the cwd of the script will be the current working directory of the shell that runs the script. Any relative file paths in the script will be treated as relative to the cwd of the shell, not the location of the script. This is super useful at times, and super painful at others. For our rebase-main script its not an issue though, and the only indication that this is happening is we used ",
			(0, import_jsx_runtime.jsx)(_components.code, { children: "~" }),
			" in the file path to reference the script location as an absolute path."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Introducing scripting into your git aliases can also make it tempting to add more and more logic to your aliases. This can make them harder to maintain and understand, but also harder to remember. Its not worth maintaining a super complex alias, as you’ll be less likely to use it anyways. Additionally, you should be careful to not introduce anything that may take too long to run into your aliases. If you are running a script that takes a long time to run, you may want to consider if it is the right place for it." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "conclusion",
			children: ["Conclusion", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#conclusion",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"I hope this article has shown you the power of scripting in your git aliases. By using scripts you can create more complex aliases that are easier to maintain and understand. This can make your git workflow more efficient and enjoyable. For more examples of git aliases, you can look at my ",
			(0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://github.com/agentender/dotfiles",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "dotfiles"
			}),
			" project. It contains a lot of the configuration that I keep on all my machines, including my git aliases."
		] })
	] });
}
function MDXContent$10(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime.jsx)(_createMdxContent$10, { ...props })
	}) : _createMdxContent$10(props);
}
function _missingMdxReference$10(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/superpowered-git-aliases/post.ts
var superpoweredGitAliases = {
	mdx: MDXContent$10,
	publishDate: new Date(2024, 6, 30),
	slug: "superpowered-git-aliases",
	title: "Superpowered Git Aliases with Scripting",
	description: `Git aliases are a powerful tool for improving your workflow. In this post, I'll show you how to take them to the next level by using scripting to create aliases that contain control flow and more.`,
	tags: [
		"technical",
		"git",
		"tooling",
		"tutorial"
	]
};
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/tiki/pineapple-parlor/contents.mdx
function _createMdxContent$9(props) {
	const _components = {
		a: "a",
		h1: "h1",
		h2: "h2",
		h3: "h3",
		li: "li",
		p: "p",
		ul: "ul",
		...props.components
	}, { Anchor, TikiTable } = _components;
	if (!Anchor) _missingMdxReference$9("Anchor", true);
	if (!TikiTable) _missingMdxReference$9("TikiTable", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.h1, {
			id: "pineapple-parlor",
			children: "Pineapple Parlor"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "quick-review",
			children: ["Quick Review", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#quick-review",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "I thoroughly enjoyed our visit to the pineapple parlor, and would highly recommend it to anyone in the area. The concept of pairing each drink with a small dish of food was a delight, and not something that I’ve seen before nor since. The drinks were served in a timely manner and were of high quality." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "the-longer-version",
			children: ["The Longer Version", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-longer-version",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "key-info",
			children: ["Key Info:", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#key-info",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Location: Galveston, TX" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Date Visited: May 25, 2025" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Visited with: My Wife" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "our-visit",
			children: ["Our Visit:", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#our-visit",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "I knew that Pineapple Parlor was a speakeasy, but admittedly should have done more research. Our Uber ride dropped us off outside of the nearby bar “Daiquiri Time Out”, which I had seen in the reviews was worth checking out while waiting to get into the Pineapple Parlor. What I had missed though, was that Pineapple Parlor’s entrance is actually hidden inside of Daiquiri Time Out. This left us lost, but with Google Maps at our side." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "After wandering a bit, we were convinced that it must be around the back of Daiquiri Time Out, and another party had shown up looking for the bar as well. Together, we found that the entrance was through a fire exit in the back corner of the building. The entry way was marked by a pineapple hanging on the wall, which covered a keypad… to which we did not have the code." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The other party was able to find the code online, and all 3 of the parties that had gathered were able to get past the keypad. This let us into a small breezeway, with a desk that we could check in at. When we checked in we were told there was an hour wait, and we decided to hang out inside the main Daiquiri Time Out bar while we waited. My wife and I tried a few drinks there, and we received a text that our table was ready in around 25 minutes, well under the expected wait time." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "We proceeded back to the keypad, only to realize we had already managed to forget the code. After a brief moment of panic, we were able to find it again and get back inside." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "the-drinks",
			children: ["The Drinks", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-drinks",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "My wife and I each purchased two drinks, sharing a few sips along the way. All together, we tried their renditions of:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Trader Vic’s Mai Tai ($16)" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Three Dots and a Dash ($19)" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Chi Chi ($19)" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Zombie ($18)" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The drinks were priced approximately within my expectations for a tiki bar, although a bit higher than what most may expect. Something to keep in mind with their pricing though, is that each drink was served with an appetizer that costs $5 if ordered alone, making the overall value more reasonable." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "I order a Mai Tai at almost every tiki bar we visit for my first drink, as a way to benchmark things out personally. This started as something I’d ask for wherever we were at, because of how estranged non-tiki location’s renditions of the drink have become. Tiki Bars are typically pretty consistent, so this has become my go-to drink for comparison. Pineapple Parlor’s version was not necessarily a standout, but there was nothing that tasted off or incorrect and it was thoroughly enjoyed." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "the-food",
			children: ["The food", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-food",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Each drink was paired with a small appetizer, which was a delightful touch. If you didn’t like the sound of one of the pairings, we were able to sub out for others on the menu without much fuss. All in, we sampled:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Crab Rangoon Nachos" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Pork Bao Bun w/ Angostura BBQ" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Pani Popo" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Sweet Wonton" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "We only substituted one of the appetizers, opting for the Pani Popo over a pineapple macaroni salad. We were not disappointed with any of the dishes we received, and each felt like a fair portion for the 5 dollar price point." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "decor--theming-elements",
			children: ["Decor + Theming Elements", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#decor--theming-elements",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Walking in to the pineapple parlor we were immediately transported away from Galveston, exactly what we wanted from a tiki bar. The seats at the bar were bamboo, and tiki mugs from various bars were displayed on some nearby shelves. The lighting was dim, but adequate to read menus." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "As far as show-y elements, a few drinks had special effects. When ordering one of the drinks a clip from scooby-doo was played on the TV, adding a thematic touch. Another drink came with a lit sparkler." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "All in all, the decor was a bit above average and contributed to the overall experience." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "take-home-elements",
			children: ["Take Home Elements", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#take-home-elements",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "We purchased a set of glasses from the bar, one mai tai glass and a high ball / zombie glass. They did not have mugs to purchase, nor coasters, swizzle sticks, or other keepsakes." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "tiki-rating-table",
			children: ["Tiki Rating Table", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#tiki-rating-table",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Placing Tiki bars in the table is a bit of a struggle for me, as I have two competing criteria in mind." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The objective ratings of the drinks received, decor etc" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The subjective experience that we had that day, which often comes down to who was with me, the conversation we had etc." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "For this visit, it was the first time since our youngest child was born that my wife and I had a night out together, just the two of us. This added a layer of significance to the experience that I can’t fully separate from the objective elements and we ultimately had a wonderful time. I don’t know exactly how to show this in the table, but it will always be tied to how I think of Pineapple Parlor." }),
		"\n",
		(0, import_jsx_runtime.jsx)(TikiTable, {})
	] });
}
function MDXContent$9(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime.jsx)(_createMdxContent$9, { ...props })
	}) : _createMdxContent$9(props);
}
function _missingMdxReference$9(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/tiki/pineapple-parlor/post.ts
var pineappleParlor = {
	mdx: MDXContent$9,
	publishDate: new Date(2025, 7, 18),
	slug: "pineapple-parlor",
	title: "Pineapple Parlor",
	description: `A short review of our trip to the Pineapple Parlor, a hidden tiki gem in Galveston.`,
	tags: [
		"non-technical",
		"tiki",
		"review"
	]
};
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/tiki/inferno-room/contents.mdx
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
	}, { Anchor, TikiTable } = _components;
	if (!Anchor) _missingMdxReference$8("Anchor", true);
	if (!TikiTable) _missingMdxReference$8("TikiTable", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.h1, {
			id: "the-inferno-room",
			children: "The Inferno Room."
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "quick-review",
			children: ["Quick Review", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#quick-review",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The Inferno Room is located near downtown Indianapolis, and offered great theming and drinks. Food pricing was a bit expensive, but portions made up for it so be prepared for the larger portions when ordering. While we visited at an awkward time, the experience was still enjoyed and I’d hope to come back in the future." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "the-longer-version",
			children: ["The Longer Version", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-longer-version",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "key-info",
			children: ["Key Info:", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#key-info",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Location: Indianapolis, IN" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Date Visited: Aug 1, 2025" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Visited with: My Wife" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "our-visit",
			children: ["Our Visit:", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#our-visit",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "We visited the Inferno Room early in the day on Thursday, August 1st, 2025. We had a concert to attend that started at 6:30, roughly 40 minutes away so with the inferno room opening at 4:00 our plan was to get there right when it opened… But, not everything ends up going according to plan and we arrived closer to 5:15 after some misnavigation to the hotel prior." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "As such we were a bit rushed, but the bar was still almost empty being early on a Thursday so wait times inside were minimal. Once inside, we were sat at the bar and offered menus to look over." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "the-drinks",
			children: ["The Drinks", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-drinks",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "My wife and I each purchased a few drinks, sharing a few sips along the way. All together, we tried their renditions of:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Heart of the Sun x 2 - My wife loved mine, and ended up with her own." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Mango Diablo" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Titillating Tart" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Tambaran Firedancer" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Drinks were priced at $15 each, which is reasonable and about what I’d expect for a tiki bar or specialty cocktail bar. The drinks were overall very good, although the mango diablo was not enjoyable for my wife. It featured mezcal heavily, and was super smoky, which she was not expecting nor familiar with. We concluded that if someone was to like mezcal, they’d likely be fine with the drink, but for her it was a no-go." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "the-food",
			children: ["The food", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-food",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The Inferno Room has an extensive food menu, and our plan was to eat here prior to our concert. In the end, we purchased two dishes:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Disco Fries ($13)" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Pineapple Fried Rice ($18)" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "We felt that the pricing was a bit high when looking at the website before coming, but in the end the portions were way larger than we expected and I’d consider it reasonable. Both items were really good, but they did take a bit of time to come to the table so I’d recommend ordering them as soon as you get a chance rather than waiting to finish your first round." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "decor--theming-elements",
			children: ["Decor + Theming Elements", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#decor--theming-elements",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Walking into the Inferno Room was a wild experience. Outside the building there was very little to indicate what waited inside, and it honestly felt like it was in the middle of nowhere for being downtown. Stepping inside, the theming was everywhere and immediate. Bamboo, lighting, totem poles, and a whole lot more contributed to creating the full experience." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "As for effects / interactive drinks, the Tambaran Firedancer was presented with a flaming lime half and a shaker of cinnamon and coffee creamer was used tableside to create a small fireball. I did not notice other drinks with effects, but its possible there were more." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "tiki-rating-table",
			children: ["Tiki Rating Table", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#tiki-rating-table",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Placing Tiki bars in the table is a bit of a struggle for me, as I have two competing criteria in mind." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The objective ratings of the drinks received, decor etc" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The subjective experience that we had that day, which often comes down to who was with me, the conversation we had etc." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This trip was overall part of a very fun time, but the visit to the Inferno Room was hampered a bit by our time constraints and the rushed nature of our visit. Nonetheless, we enjoyed the drinks and the atmosphere, and I’d love to come back and experience it more fully in the future." }),
		"\n",
		(0, import_jsx_runtime.jsx)(TikiTable, {})
	] });
}
function MDXContent$8(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime.jsx)(_createMdxContent$8, { ...props })
	}) : _createMdxContent$8(props);
}
function _missingMdxReference$8(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/tiki/inferno-room/post.ts
var infernoRoom = {
	mdx: MDXContent$8,
	publishDate: new Date(2025, 7, 18),
	slug: "inferno-room",
	title: "The Inferno Room",
	description: `A short review of our trip to the Inferno Room, a tiki bar near downtown Indianapolis.`,
	tags: [
		"non-technical",
		"tiki",
		"review"
	]
};
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/tiki/trader-sams-grog-grotto/contents.mdx
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
	}, { Anchor, TikiTable } = _components;
	if (!Anchor) _missingMdxReference$7("Anchor", true);
	if (!TikiTable) _missingMdxReference$7("TikiTable", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.h1, {
			id: "trader-sams-grog-grotto",
			children: "Trader Sam’s Grog Grotto"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "quick-review",
			children: ["Quick Review", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#quick-review",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "A bit less well known than Trader Sam’s Enchanted Tiki Bar in Disneyland, Trader Sam’s Grog Grotto is a tiki bar located in Disney’s Polynesian Village Resort. The drinks were good, the atmosphere was fun, but we missed the food this time. The long wait accompanied by some morning drama led to a less enjoyable experience, but objectively it was still a nice visit that I’d love to repeat in better company." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "the-longer-version",
			children: ["The Longer Version", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-longer-version",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "key-info",
			children: ["Key Info:", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#key-info",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Location: Lake Buena Vista, FL" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Date Visited: Mar 13, 2025" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Visited with: My Wife, Daughter, and Parents" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "our-visit",
			children: ["Our Visit:", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#our-visit",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "We visited Trader Sam’s about halfway through a longer trip to the Disney parks, something that my family does roughly every year and a half. With my growing Tiki obsession, along with it just being something new to do, I was anxiously awaiting this stop. Both Trader Sam’s locations are notorious for long waits, and do not accept reservations so I had hoped to get there a bit before opening to avoid the wait." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "We ended up getting there a bit later than planned, and waited for roughly an hour and a half before being seated. The wait was made a bit more difficult by the fact that we had our 2 year old daughter with us, and coupled with another restless party member and the awkwardness of bringing a smaller child into a bar setting, we didn’t really make the most of the experience. Additionally, we had just learned that my wife was pregnant with our second child, so she was limited to mocktails and non-alcoholic options." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "the-drinks",
			children: ["The Drinks", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-drinks",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Through our party, we tried the following drinks:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Zombie ($18, or w/ mug $35)" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "HippopotoMai-Tai ($18.50)" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Tiki Tiki Tiki Tiki Tiki Rum ($17.50)" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Skipper Sipper ($6.25, NA)" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Schweitzer Falls ($6.25, NA)" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Polynesian Punch ($12.50, NA)" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "I personally tried the Zombie, taking home the mug as a souvenir as well as the HippopotoMai-Tai. I didn’t have an issue with either of the drinks I had, and appreciated the non-alcoholic options for my Wife and daughter." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "decor--theming-elements",
			children: ["Decor + Theming Elements", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#decor--theming-elements",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "As for decor, no one can beat Disney. From ride’s queues, to signature restaurants and now tiki bars the little details Disney adds are always a highlight. Being nestled inside of the Polynesian, there was less of an “escapism” feel to other tiki bars, as you are already inside the theme. Nonetheless, the detail and theming elements were great. The bar itself was dark, with a lot of wood and bamboo, and the drinks were served in tiki mugs that were themed to the bar." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Notably, the bar is quite a bit smaller than one may expect for its location. The bar replaced the arcade that was in the Polynesian resort, which as an older resort was not as spacious as newer ones. This makes for a close-knit feel much more similar to some of the other tiki bars that I’ve visited than I expected." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "For every drink there was a combination of glassware, tableside effects, and other show-y elements that made the experience more fun. When ordering the HippopotoMai-Tai, the server presented it calling out something that ended with “Two Shots of Rum” that sounded throughout the bar. Additionally, some sfx of a cartoony gun was played. For the zombie, the servers wore glasses that made it look like their eyes were falling out." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "While we didn’t order it, when another table ordered the uh-oa the tables all around joined in a chant of “Uh-Oa! Uh-Oa!“. Some drinks made the virtual windows start storming, with the volcano pictured erupting." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "These effects are something pretty uniquely Disney. While other bars may have a bit of it here and there, the level of detail and commitment to the theme at Trader Sam’s is impressive and the level of effects would just be hard to replicate without Disney’s budget." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "tiki-rating-table",
			children: ["Tiki Rating Table", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#tiki-rating-table",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Placing Tiki bars in the table is a bit of a struggle for me, as I have two competing criteria in mind." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The objective ratings of the drinks received, decor etc" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The subjective experience that we had that day, which often comes down to who was with me, the conversation we had etc." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The awkward circumstances surrounding our experience made things not quite as fun as they could have been, and overall probably lower my internal rating a bit more than is fair. That said, it was a fun experience that I’d love to try again with a more enthusiastic group." }),
		"\n",
		(0, import_jsx_runtime.jsx)(TikiTable, {})
	] });
}
function MDXContent$7(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime.jsx)(_createMdxContent$7, { ...props })
	}) : _createMdxContent$7(props);
}
function _missingMdxReference$7(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/tiki/trader-sams-grog-grotto/post.ts
var traderSamsGrogGrotto = {
	mdx: MDXContent$7,
	publishDate: new Date(2025, 7, 18),
	slug: "trader-sams-grog-grotto",
	title: "Trader Sam’s Grog Grotto",
	description: `A short review of our trip to Trader Sam’s Grog Grotto, a tiki bar located in Disney’s Polynesian Village Resort.`,
	tags: [
		"non-technical",
		"tiki",
		"review"
	]
};
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/tiki/tiki-chick/contents.mdx
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
	}, { Anchor, TikiTable } = _components;
	if (!Anchor) _missingMdxReference$6("Anchor", true);
	if (!TikiTable) _missingMdxReference$6("TikiTable", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.h1, {
			id: "tiki-chick",
			children: "Tiki Chick."
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "quick-review",
			children: ["Quick Review", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#quick-review",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Located a quick walk from the subway, Tiki Chick was easy to get to and easy to enjoy. This was the second time I had gotten together with colleagues after joining Nx, and several of them accompanied me to check out this spot. The drinks were exactly as one would expect, and while not stand out they certainly didn’t let down. Combined with $5 chicken sandwiches and creative seating arrangements, it made for a great experience that I’d happily revisit even if there are better themed bars in the area." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "the-longer-version",
			children: ["The Longer Version", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-longer-version",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "key-info",
			children: ["Key Info:", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#key-info",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Location: NYC, NY" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Date Visited: Sep 29, 2023" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Visited with: 5-6 colleagues from work" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "our-visit",
			children: ["Our Visit:", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#our-visit",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Tiki Chick was an outing that I organized towards the end of a week-long onsite for Nx. This was the second onsite since I had joined the company, and was the second time I had seen most people in person. With everyone invited, a group of 6 - 7 of us boarded the subway near times square and made our way to the bar." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "We waited approximately 15-20 minutes to be let in, and were initially guided to a standing area with a bar-height ledge attached to the wall. This was admittedly less than ideal, but after putting in our order for our first round we were led to a new area that featured a coffee table surrounded by a small couch, and a few other chairs. The seating was arranged such that we were all in a circle, and made conversation easy and enjoyable amongst the other noise." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "the-drinks",
			children: ["The Drinks", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-drinks",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "While I cannot speak for the drinks others received, I personally enjoyed tiki chick’s:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Mai Tai ($16)" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Zombie ($16)" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "In NYC a $16 cocktail is certainly not out of the ordinary, and not above other tiki bars prices that I’ve been to since. Both cocktails were fantastic and in line with their namesake, certainly a good sign." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "the-food",
			children: ["The food", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-food",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Tiki Chick features $5 chicken sandwiches, which are not easy to find in NYC. After another colleague ordered one and enjoyed it, I also ordered one which featured hot honey. No complaints on my end, and the fried sandwiches were an excellent pairing to the heavy drinks." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "decor--theming-elements",
			children: ["Decor + Theming Elements", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#decor--theming-elements",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Decor and overall theming were not Tiki Chick’s strong point. If you are here for the escapism, this probably isn’t it. We didn’t sit in the outdoor section, but if you did I’d argue there was no theme whatsoever aside from a few boho chairs. Inside, the theme was a bit more pronounced but still overall very light. There were a few nautical elements, and drinks were served in mugs… but that was about it." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This isn’t the bar for escapism, but is perhaps more approachable for a varied crowd looking for a casual night out." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "tiki-rating-table",
			children: ["Tiki Rating Table", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#tiki-rating-table",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Placing Tiki bars in the table is a bit of a struggle for me, as I have two competing criteria in mind." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The objective ratings of the drinks received, decor etc" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The subjective experience that we had that day, which often comes down to who was with me, the conversation we had etc." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The whole trip to NYC was a whirlwind of activity with colleagues, and the night out to tiki chick was a personal favorite. Despite the light theming, it was hard to be disappointed with good drinks and company." }),
		"\n",
		(0, import_jsx_runtime.jsx)(TikiTable, {})
	] });
}
function MDXContent$6(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime.jsx)(_createMdxContent$6, { ...props })
	}) : _createMdxContent$6(props);
}
function _missingMdxReference$6(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/tiki/tiki-chick/post.ts
var tikiChick = {
	mdx: MDXContent$6,
	publishDate: new Date(2025, 7, 18),
	slug: "tiki-chick",
	title: "Tiki Chick",
	description: `Tiki Chick was the first tiki bar I really went to, and the laid back environment made an excellent environment to catch up with colleagues that I seldom see in person.`,
	tags: [
		"non-technical",
		"tiki",
		"review"
	]
};
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/tiki/kaona-room/contents.mdx
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
	}, { Anchor, TikiTable } = _components;
	if (!Anchor) _missingMdxReference$5("Anchor", true);
	if (!TikiTable) _missingMdxReference$5("TikiTable", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.h1, {
			id: "kaona-room",
			children: "Kaona Room"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "key-info",
			children: ["Key Info:", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#key-info",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Location: Miami, FL" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Date Visited: Jan, 2025" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Visited with: 5-6 colleagues from work" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "our-visit",
			children: ["Our Visit:", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#our-visit",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "To truly understand and appreciate our visit to the Kaona Room, you just had to be there. The Kaona Room was once a speak-easy back room of esotico, which served similar drinks but with less theming and flair, but is now closed. Replacing esotico, was a sports bar called Canvas. Writing this now, in August of 2025, I can’t seem to find that this new Canvas location is still open but it appears Kaona is. Some information seems to point that it may now be a backroom inside the Leinster, an Irish pub that opened up midway through the year." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "I mention this all for the context of the sports bar, which was open all week while the kaona room only opened on specific days. The same owner owned each, and they were part of the same building, but that was where the similarities end. Through a series of mistakes, we made it to the week-of without realizing that the Kaona Room’s limited hours did not include any of the time that would be available during our work trip, and seemed to not be available. Hope was not lost though, as our wonderful operations manager was able to get into contact with the owner, and secured us a reservation!" }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "We were not sure exactly how, or why, but we came to the understanding that the kaona room would be open and we had a reservation. Upon arriving, we had a hard time determining where the entrance even was though as we had missed the bit of research indicating that Kaona was a speakeasy inside of Canvas. After spending a few minutes wondering around inside, we entered to ask the staff there if they knew where the entry was…" }),
		"\n",
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This was where the confusion grew by a 1000. We were informed that the same owner owned both bars, but that the Kaona Room was not open that day. We were told that it was only open on weekends, and that we would have to come back then, but that we did have a reservation… to Canvas. We were let down, but at the end of the day the fellowship with colleagues was more important than the location, so we planned to settle down." }),
		"\n",
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Shortly after receiving menus for Canvas, the owner came to our table and informed us that he had an idea, if we were up for it. He opened the Kaona Room just for our group, almost like it was a party room in a larger establishment. This was amazing, and a once in a lifetime experience to get to hang out in the bar that normally is packed to its 40 person limit with just our group of 8 colleagues, but there are more limitations that lead to me not giving it a rating and ranking within the tiki bars that I have visited." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "While we were seated within the kaona room and able to enjoy the space, the drink menu that was served was Canvas’, as the bartenders for Kaona were not present and the techniques and ingredients unavailable. Additionally, the showmanship and effects typical were not on display, as like I said it was more of a private room than anything else." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "the-drinks",
			children: ["The Drinks", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-drinks",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This section’s a bit different here as the drink menu served was not that of Kaona’s, but due to the location in Miami I was able to order a few daiquiri variants that were all well made. It was nice to order them and not be met with confusion about not expecting them to be frozen, as classic daiquiris are pretty popular in the area." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "decor--theming-elements",
			children: ["Decor + Theming Elements", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#decor--theming-elements",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The decor inside Kaona room was really neat, and the run-up to the hidden speak easy built anticipation from the get go. Going from a noisy sports bar to a secluded space was neat, and put the escapism front up which was really awesome to see. The fact that we were in the space alone also meant that we had plenty of time to look around and really take in all the details which would not have been possible in the typical setting." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "tiki-rating-table",
			children: ["Tiki Rating Table", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#tiki-rating-table",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Placing Tiki bars in the table is a bit of a struggle for me, as I have two competing criteria in mind." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The objective ratings of the drinks received, decor etc" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The subjective experience that we had that day, which often comes down to who was with me, the conversation we had etc." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Given the unique circumstances of our visit, I do not think it would be right to give a rating to Kaona room, but based on various online reviews and viewing the space it is a place I’d love to revisit given the opportunity." }),
		"\n",
		(0, import_jsx_runtime.jsx)(TikiTable, {})
	] });
}
function MDXContent$5(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime.jsx)(_createMdxContent$5, { ...props })
	}) : _createMdxContent$5(props);
}
function _missingMdxReference$5(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/tiki/kaona-room/post.ts
var kaonaRoom = {
	mdx: MDXContent$5,
	publishDate: new Date(2025, 7, 18),
	slug: "kaona-room",
	title: "Kaona Room",
	description: `A truly puzzling visit that leads to a non-review, but a good time nonetheless.`,
	tags: [
		"non-technical",
		"tiki",
		"review"
	]
};
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/tiki/rum-barrel/contents.mdx
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
	}, { Anchor, TikiTable } = _components;
	if (!Anchor) _missingMdxReference$4("Anchor", true);
	if (!TikiTable) _missingMdxReference$4("TikiTable", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.h1, {
			id: "rum-barrel-west",
			children: "Rum Barrel West"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "quick-review",
			children: ["Quick Review", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#quick-review",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "We went to Rum Barrel as one of the last stops on our company’s first EU conference, with several colleagues joining. The experience was really neat, and the drinks were all well crafted. In lieu of a real “tiki bar” in the area, rum barrel was a blast that I’d be happy to visit in the future." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "the-longer-version",
			children: ["The Longer Version", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-longer-version",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "key-info",
			children: ["Key Info:", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#key-info",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Location: Amsterdam, Netherlands" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Date Visited: Apr 5, 2025" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Visited with: 8-10 colleagues" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "our-visit",
			children: ["Our Visit:", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#our-visit",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "I met up with colleagues at rum barrel one night after our conference, they had been walking around the city and I arrived a bit ahead of time walking from the hotel. The bar is situated on the corner of a street, and was not particularly busy when we arrived. The group of us were sat at a long table, which ended up splitting the conversations between different groups along the table." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "While we were wrapping up, the servers brought each of us a complementary portion of their house rum blend, which I’m sure was only done because of the large group size, but was a nice touch. Servers seemed excited when presenting the drinks, especially those with a fiery flare." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Most of the group choose Uber to get back to the hotel, but a colleague and I opted to walk back to grand centraal and take a ferry back to NDSM where our hotel was, and I have to admit its still quite amazing any time real public transit is available." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "the-drinks",
			children: ["The Drinks", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-drinks",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "I personally sampled Rum Barrel’s:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Zombie (€27.50 ≈ $32)" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Mai-Tai (€15 ≈ $17.50)" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "food",
			children: ["Food", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#food",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "We had already eaten dinner beforehand, but we sampled some of the bar snacks. The half of the table I was closer to ordered some croquettes, which were good." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "decor--theming-elements",
			children: ["Decor + Theming Elements", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#decor--theming-elements",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Rum barrel’s decor was extremely minimal, outside of a few motif’s I would not consider there to be tiki theming. That said, the zombie’s were served in a ceramic skull, topped with flaming lime and sprinkled with cinnamon grounds to create a small fireball. Amongst our party there were 3 of them ordered, and every skull got full attention from our table (as well as those around us)." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Despite not being a tiki bar really, the design was clean and everything was well thought out. The design was a lot more modern and up scale, and I think it worked for what it was going for." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "tiki-rating-table",
			children: ["Tiki Rating Table", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#tiki-rating-table",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Placing Tiki bars in the table is a bit of a struggle for me, as I have two competing criteria in mind." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The objective ratings of the drinks received, decor etc" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The subjective experience that we had that day, which often comes down to who was with me, the conversation we had etc." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Rum Barrel was awesome, but not really a tiki bar and that contributes to its lower ranking overall." }),
		"\n",
		(0, import_jsx_runtime.jsx)(TikiTable, {})
	] });
}
function MDXContent$4(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime.jsx)(_createMdxContent$4, { ...props })
	}) : _createMdxContent$4(props);
}
function _missingMdxReference$4(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/tiki/rum-barrel/post.ts
var rumBarrelWest = {
	mdx: MDXContent$4,
	publishDate: new Date(2025, 7, 18),
	slug: "rum-barrel-west",
	title: "Rum Barrel West",
	description: `A short review of our trip to Rum Barrel West, a rum bar located in Amsterdam.`,
	tags: [
		"non-technical",
		"tiki",
		"review"
	]
};
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/tiki/kon-tiki/contents.mdx
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
	}, { Anchor, TikiTable } = _components;
	if (!Anchor) _missingMdxReference$3("Anchor", true);
	if (!TikiTable) _missingMdxReference$3("TikiTable", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.h1, {
			id: "kon-tiki",
			children: "Kon Tiki"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "quick-review",
			children: ["Quick Review", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#quick-review",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "After KCDC wrapped up, 2 colleagues and myself found ourselves walking to Kon Tiki to grab a drink and catch up. The vibrant space and atmosphere were inviting, with nothing too loud to prevent conversation. It was a pleasant stop that I’d happily revisit, but perhaps not themed as well as some other tiki bars." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "the-longer-version",
			children: ["The Longer Version", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-longer-version",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "key-info",
			children: ["Key Info:", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#key-info",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Location: Kansas City, MO" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Date Visited: Aug 15, 2025" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Visited with: 2 colleagues" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "our-visit",
			children: ["Our Visit:", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#our-visit",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "We walked over to Kon Tiki after KCDC wrapped up for the day, two colleagues and myself looking for somewhere to grab a drink and catch up. I suggested it after a quick search on Reddit for tiki bars in the Kansas City area turned it up. The reviews on that post were not the most promising, but it was within walking distance, so together we decided to try it out." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The space was vibrant and inviting, and never got loud enough to make conversation difficult, which was most of what we wanted out of the stop." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "the-drinks",
			children: ["The Drinks", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-drinks",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "I personally sampled Kon Tiki’s" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Mai Tai" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Saturn" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Zombie" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Kon Tiki prices all of their drinks the same, at 14 USD which is a few dollars less than the other tiki bars I’ve visited. Any of the drinks can be made in a souvenir mug for $34, or you can purchase the mug separately for $20. I was happy with the taste and flavor of each of the drinks that I received, but a bit disappointed in the overall presentation of them. The Saturn and mai tai were both served in the same glass, where a Saturn would normally be served up in a coupe or similar, and garnish was a bit lacking. For the Saturn, it had the signature garnish of the lemon peel wrapped around the cherry to look like Saturn’s rings, but it was tightly wrapped around it so some of the look was diminished. This probably sounds like nitpicking, but its a small touch that helps to elevate the drink." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "decor--theming-elements",
			children: ["Decor + Theming Elements", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#decor--theming-elements",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Kon Tiki’s decor was a bit more modern and well lit than some of the other tiki bar’s I’ve visited, but it still had plenty of tropical elements and charm to keep with the theme. Of note, topless women are featured a bit more heavily than some would be comfortable with but its not overly explicit or distracting, just a bit more than one would likely anticipate." }),
		"\n",
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Floating lanterns replace the traditional fisherman’s floats, but give the same feel with some sharper edges. Shelves over the bar contain some nautical elements to aid with the overall theme." }),
		"\n",
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "tiki-rating-table",
			children: ["Tiki Rating Table", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#tiki-rating-table",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Placing Tiki bars in the table is a bit of a struggle for me, as I have two competing criteria in mind." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The objective ratings of the drinks received, decor etc" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The subjective experience that we had that day, which often comes down to who was with me, the conversation we had etc." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Kon Tiki was “fine” as far as tiki bars go, but nothing was particularly outstanding or memorable about it. The drinks were good, the decor was nice, but it didn’t quite reach the level of some of the other tiki bars I’ve visited and overall I’d place it at about average." }),
		"\n",
		(0, import_jsx_runtime.jsx)(TikiTable, {})
	] });
}
function MDXContent$3(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime.jsx)(_createMdxContent$3, { ...props })
	}) : _createMdxContent$3(props);
}
function _missingMdxReference$3(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/tiki/kon-tiki/post.ts
var konTiki = {
	mdx: MDXContent$3,
	publishDate: new Date(2025, 7, 18),
	slug: "kon-tiki",
	title: "Kon Tiki",
	description: `A short review of our trip to Kon Tiki, a tiki bar located in Kansas City.`,
	tags: [
		"non-technical",
		"tiki",
		"review"
	]
};
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/tiki/sunken-harbor-club/contents.mdx
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
	}, { Anchor, TikiTable } = _components;
	if (!Anchor) _missingMdxReference$2("Anchor", true);
	if (!TikiTable) _missingMdxReference$2("TikiTable", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.h1, {
			id: "sunken-harbor-club",
			children: "Sunken Harbor Club."
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "quick-review",
			children: ["Quick Review", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#quick-review",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Sunken Harbor Club, located in Brooklyn NY, was an absolute treat that’s absolutely worth visiting. The food choices we sampled were both amazing, and neither my wife nor I experienced any disappointment with our selections." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "the-longer-version",
			children: ["The Longer Version", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-longer-version",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "key-info",
			children: ["Key Info:", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#key-info",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Location: Brooklyn, New York" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Date Visited: Dec 6, 2025" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Visited with: My Wife" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "our-visit",
			children: ["Our Visit:", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#our-visit",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"My wife and I take one overnight trip without the kids each year as an opportunity to reconnect and experience something new together. This year, we visited NYC and on Saturday night in particular had a pretty late night out. Sunken Harbor Club was intended to be our first stop of the night, but after receiving an estimated 2 hour wait, we visited a non-tiki prior. We walked to ",
			(0, import_jsx_runtime.jsx)(_components.a, {
				href: "https://www.somedaybarnyc.com/",
				rel: "noopener noreferrer",
				target: "_blank",
				children: "Someday Bar"
			}),
			" to kill some time, and left after a drink. We returned to Sunken Harbor Club, stopping by a few stores on the way to get closer to the estimated time."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The wait was pretty close to the estimate, and we were led up the staircase attached to Gage and Tollner to be seated in SHC. We were seated at the bar, where the head bartender Garret Richards was joined by two other bartenders who were all very friendly and knowledgeable about the menu." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "the-drinks",
			children: ["The Drinks", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-drinks",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The drinks at Sunken Harbor Club were exceptional. Each cocktail was carefully crafted with attention to detail, and the flavors were well balanced. Our exact selections are below:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Rum Barrel (me, $22)" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Rhyme of The Ancient Mariner (me, $18)" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Shattered Skull (shared, $45)" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Missionaries Downfall (my wife, $20)" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Incantation (my wife, $22)" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Of the 5, all were excellent. I think the Incantation was our lowest rated drink, but I was pleasantly surprised with the communal bowl and the rum barrel. The prices were fairly in line with 2025 NYC pricing, so despite being rather expensive it was not a shock." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "the-food",
			children: ["The Food", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-food",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "My wife and I shared two menu items:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Spam Banh Mi Sliders ($18)" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Miso Butterscotch Pudding ($12)" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The sliders were served as a plate of 3, and the bartender that took our order offered to bump it to a plate of 4 to be able to split evenly. We opted not to, as we had came from dinner prior to arriving. The staff brought extra plates to facilitate sharing and the food was excellent." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The pudding was a decent portion, and the taste was out of this world. The miso flavoring and the toppings provided textural delight and a creative twist on a nostalgic childhood treat." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "decor--theming-elements",
			children: ["Decor + Theming Elements", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#decor--theming-elements",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Sunken harbor club was well themed, albeit without some of the exciting effects that some tiki spots offer. The setting was definitely more classy, with a theme that made if feel like you were inside a sunken ship. At one point in our serving there was a fog machine that was turned on, with a small laser show + bubbles. I don’t believe this was tied to any of the drinks on the menu, but likely something they do sporadically over the service." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "All in, I do wish there was a bit more interactivity with the theming and decor but the bar presents itself as a cohesive environment with plenty to look at and enjoy." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "tiki-rating-table",
			children: ["Tiki Rating Table", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#tiki-rating-table",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Placing Tiki bars in the table is a bit of a struggle for me, as I have two competing criteria in mind." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The objective ratings of the drinks received, decor etc" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The subjective experience that we had that day, which often comes down to who was with me, the conversation we had etc." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Sunken harbor club excelled in both regards. We found ourselves there mid-way through a day that is easily in the top 10 days of 2025 for me, and the experience at the bar only added to the enjoyment of the day." }),
		"\n",
		(0, import_jsx_runtime.jsx)(TikiTable, {})
	] });
}
function MDXContent$2(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime.jsx)(_createMdxContent$2, { ...props })
	}) : _createMdxContent$2(props);
}
function _missingMdxReference$2(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/tiki/sunken-harbor-club/post.ts
var sunkenHarborClub = {
	mdx: MDXContent$2,
	publishDate: new Date(2025, 11, 30),
	slug: "sunken-harbor-club",
	title: "Sunken Harbor Club",
	description: `A short review of our trip to Sunken Harbor Club, a tiki bar located in Brooklyn, NY.`,
	tags: [
		"non-technical",
		"tiki",
		"review"
	]
};
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/tiki/paradise-lost/contents.mdx
function _createMdxContent$1(props) {
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
	}, { Anchor, TikiTable } = _components;
	if (!Anchor) _missingMdxReference$1("Anchor", true);
	if (!TikiTable) _missingMdxReference$1("TikiTable", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.h1, {
			id: "paradise-lost",
			children: "Paradise Lost"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "quick-review",
			children: ["Quick Review", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#quick-review",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "the-longer-version",
			children: ["The Longer Version", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-longer-version",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "key-info",
			children: ["Key Info:", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#key-info",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Location: East Village, NYC" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Date Visited: Dec 6, 2025" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Visited with: My Wife" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "our-visit",
			children: ["Our Visit", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#our-visit",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Paradise Lost was our last stop on a long night exploring NYC. It wasn’t initially planned to be our last stop, though. We arrived at roughly 9:45, directly after leaving ",
			(0, import_jsx_runtime.jsx)(_components.a, {
				href: "../sunken-harbor-club",
				children: "Sunken Harbor Club"
			}),
			". We waited a good amount of time to put in our name, and were informed it would likely be quite a wait. There were roughly 25 parties ahead of us at the time, but we persisted and checked out a few more things around the area in the meantime. We received our text to return at 12:50 AM, and stayed till close at 2:00 AM."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Some of our feedback is definitely influenced by the late night visit, and I’m sure the staff and presentation would have been a bit better earlier in the night." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "the-drinks",
			children: ["The Drinks", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-drinks",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Between my wife and I, we sampled:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "[REDACTED] ($23)" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Pearl Diver ($20)" }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime.jsx)(_components.hr, {}),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime.jsx)(_components.hr, {}),
				"\n"
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "You’ll notice there’s two blanks there. Unfortunately this visit was at the end of a long night, and while neither of us were overserved or otherwise too far gone, we unfortunately have forgotten what my wife ordered." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Nevertheless, the drinks we sampled were delightful. Nothing was too over the top garnishwise, but the flavors were there and met my admittedly pretty high expectations." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "the-food",
			children: ["The Food", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-food",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Because of our late arrival, the kitchen had already been closed and we were not offered a food menu." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "decor--theming-elements",
			children: ["Decor + Theming Elements", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#decor--theming-elements",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Paradise Lost is meant to be a “speaky-tiki”, with the door being minimal and requiring ringing a doorbell to get in. From there, you walk down a short corridor before entering the main bar area, which is dimly lit and looks a bit like the inside of a ship or even perhaps a barrel." }),
		"\n",
		(0, import_jsx_runtime.jsx)("img", { src: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwiDy9aXTykzy7ndc7vezC7DJfm6DsIaGwpiqZz5DGQjRF491lijN4r6MYZsGOegFfZc6f0MD9rgC7YiUTNO4Xu_DcGCwsLo2F_bRBLN3C4uc4Y6PV3jlk5vgoeD4s2rb_dGzG0isyNVTjy=s1360-w1360-h1020-rw" }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The bathrooms were also decorated, with some cultist-prayers playing dimly over the speakers within." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "All-in, the theming was OK. The drinks were well garnished, but there was not a ton of flair in the service and the overall look was a bit of a departure from what I was personally looking for. I do imagine that the service might have been a bit more ambitious earlier in the night, and would certainly be willing to give it another go." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "tiki-rating-table",
			children: ["Tiki Rating Table", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#tiki-rating-table",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Placing Tiki bars in the table is a bit of a struggle for me, as I have two competing criteria in mind." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The objective ratings of the drinks received, decor etc" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The subjective experience that we had that day, which often comes down to who was with me, the conversation we had etc." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "We visited Paradise Lost at the end of a long day, and this meant there was no food and service was starting to wane. I’d love to give it another go earlier in the night, for a fair shot, but as we experienced it I would place it below Tiki Chick and well underneath Sunken Harbor Club." }),
		"\n",
		(0, import_jsx_runtime.jsx)(TikiTable, {})
	] });
}
function MDXContent$1(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime.jsx)(_createMdxContent$1, { ...props })
	}) : _createMdxContent$1(props);
}
function _missingMdxReference$1(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/tiki/paradise-lost/post.ts
var paradiseLost = {
	mdx: MDXContent$1,
	publishDate: new Date(2025, 11, 30),
	slug: "paradise-lost",
	title: "Paradise Lost",
	description: `A short review of our trip to Paradise Lost, a tiki bar located in the East Village, NYC.`,
	tags: [
		"non-technical",
		"tiki",
		"review"
	]
};
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/tiki/tiki-tiki-bang-bang/contents.mdx
function _createMdxContent(props) {
	const _components = {
		a: "a",
		h1: "h1",
		h2: "h2",
		h3: "h3",
		li: "li",
		p: "p",
		ul: "ul",
		...props.components
	}, { Anchor, TikiTable } = _components;
	if (!Anchor) _missingMdxReference("Anchor", true);
	if (!TikiTable) _missingMdxReference("TikiTable", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.h1, {
			id: "tiki-tiki-bang-bang",
			children: "Tiki Tiki Bang Bang"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "quick-review",
			children: ["Quick Review", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#quick-review",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Tiki Tiki Bang Bang, located in Cincinnati, OH, was a great time with great company. The space is heavily themed and comfortable, the staff was some of the friendliest we’ve encountered on this tiki journey, and I walked away with a new mug for the shelf. Our visit happened to land on their Pride month special menu, which was a fun concept but did mean the regular tiki menu wasn’t available — something to keep in mind if you’re planning a June visit and have your heart set on the classics." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "the-longer-version",
			children: ["The Longer Version", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-longer-version",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "key-info",
			children: ["Key Info:", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#key-info",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Location: Cincinnati, OH" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Date Visited: Jun 13, 2026" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Visited with: Friends" }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "our-visit",
			children: ["Our Visit", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#our-visit",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "We drove up to Cincinnati the night before a trip to Kings Island with some friends, and made Tiki Tiki Bang Bang the stop for the evening. As is a recurring theme in these posts, the company you’re with can make or break a tiki visit, and this one benefited from great conversation the whole way through. We arrived around 10:30 and stayed until roughly 12:45." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The bar is seat-yourself with orders placed at the bar, rather than waited tables. We grabbed a table in an alcove to the right of the entry — one of two tables up front — with a few more table spots in the back and some seating lined up parallel to the bar. The alcove was a great spot for our group, letting us actually face each other and talk rather than being strung out along the bar. The staff was super friendly the whole night, happy to chat about the menu and the space every time we came up to order." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "the-drinks",
			children: ["The Drinks", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#the-drinks",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Our visit landed during June, when Tiki Tiki Bang Bang runs a special Pride month menu. To be clear up front: the Pride menu itself is an awesome tradition and the bar clearly puts real effort into it. The catch for us was that it fully replaced the regular menu rather than running alongside it — nothing from the standard tiki list was orderable during our visit." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "I can see why. Tiki drinks lean on a lot of prep work — house syrups, fresh-pressed juices, orgeat and the like — and it doesn’t make sense to keep all of that stocked for a menu that isn’t being served that month. But the practical effect was that the drinks we had were distinctly less tiki than what the bar is known for, landing closer to standard craft cocktails with festive presentation." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "I tried the Pride menu’s take on a mai tai, along with a classic daiquiri — the latter wasn’t on the special menu, but the simple build meant the bartender was able to make it off-menu without any of the seasonal prep constraints getting in the way." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "This is less a knock and more a scheduling note: if you want the full tiki experience here, aim for a month other than June — and if you go in June, go in expecting the special menu and you’ll have a great time." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h3, {
			id: "decor--theming-elements",
			children: ["Decor + Theming Elements", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#decor--theming-elements",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The decor is where Tiki Tiki Bang Bang really shines. The space is densely themed without feeling cluttered — carved tikis, warm low lighting, and thoughtful details everywhere you look. Combined with the seating arrangement, it’s one of the more comfortable tiki spaces we’ve been in; some bars nail the look but leave you perched on a stool for the night, and this was not that." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The mug program is also worth a mention. I picked up one of their rum barrel mugs before we left, and the bar’s name is included in the cast itself — a mug made for this bar specifically, not a mass-produced run with a sticker on it. The Rum Barrel was one of the drinks they couldn’t make during the event, but the bartender was happy to put one of the popup event drinks in the mug and sell it that way, which was a nice touch. It made the trip home in one piece and has already earned a spot on the shelf." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.h2, {
			id: "tiki-rating-table",
			children: ["Tiki Rating Table", (0, import_jsx_runtime.jsx)(_components.a, {
				className: "heading-link",
				href: "#tiki-rating-table",
				children: (0, import_jsx_runtime.jsx)(Anchor, {
					className: "heading-link-anchor",
					children: "#"
				})
			})]
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Placing Tiki bars in the table is a bit of a struggle for me, as I have two competing criteria in mind." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The objective ratings of the drinks received, decor etc" }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "The subjective experience that we had that day, which often comes down to who was with me, the conversation we had etc." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Tiki Tiki Bang Bang scored high on the subjective side — great friends, great staff, great room. The drinks rating below reflects the Pride menu we were served rather than the regular tiki list, so consider it a provisional score; I’d like to return in another month and give the standard menu a fair shot." }),
		"\n",
		(0, import_jsx_runtime.jsx)(TikiTable, {})
	] });
}
function MDXContent(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime.jsx)(_createMdxContent, { ...props })
	}) : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/tiki/tiki-tiki-bang-bang/post.ts
var tikiTikiBangBang = {
	mdx: MDXContent,
	publishDate: new Date(2026, 6, 13),
	slug: "tiki-tiki-bang-bang",
	title: "Tiki Tiki Bang Bang",
	description: `A short review of our trip to Tiki Tiki Bang Bang, a tiki bar located in Cincinnati, OH.`,
	tags: [
		"non-technical",
		"tiki",
		"review"
	]
};
//#endregion
//#region ../../libs/blog-posts/src/lib/posts/index.ts
function partition(arr, size) {
	const result = [];
	const inProgress = [...arr];
	while (inProgress.length) result.push(inProgress.splice(0, Math.min(size, inProgress.length)));
	return result;
}
var ALL_BLOG_POSTS = [
	nxConfigurationHistory,
	githubPagesPreviewEnv,
	superpoweredGitAliases,
	multifunctionExampleFiles,
	githubUnlistedRepos,
	packageManagerReleaseCooldown,
	pineappleParlor,
	infernoRoom,
	traderSamsGrogGrotto,
	tikiChick,
	kaonaRoom,
	rumBarrelWest,
	konTiki,
	paradiseLost,
	sunkenHarborClub,
	tikiTikiBangBang
];
var blogPosts = ALL_BLOG_POSTS.filter((p) => p.publishDate.getTime() < Date.now()).sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
var slugMap = Object.fromEntries(ALL_BLOG_POSTS.map((p) => [p.slug, p]));
partition(blogPosts, 10);
//#endregion
//#region ../../libs/blog-posts/src/lib/components/cite.module.scss
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var cite_module_default = {
	citation: "_citation_5mrsj_1",
	marker: "_marker_5mrsj_7",
	anchor: "_anchor_5mrsj_13",
	popover: "_popover_5mrsj_31",
	popoverBody: "_popoverBody_5mrsj_81"
};
//#endregion
//#region ../../libs/blog-posts/src/lib/components/cite.tsx
function Cite({ n, href, children }) {
	const anchorVariables = { "--cite-anchor": `--cite-${(0, import_react.useId)().replace(/[^a-zA-Z0-9]/g, "")}` };
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cite_module_default["citation"],
		style: anchorVariables,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sup", {
			className: cite_module_default["marker"],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href,
				target: "_blank",
				rel: "noopener noreferrer",
				className: cite_module_default["anchor"],
				children: [
					"[",
					n,
					"]"
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("cite", {
			className: cite_module_default["popover"],
			role: "tooltip",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cite_module_default["popoverBody"],
				children
			})
		})]
	});
}
var code_wrapper_module_default = {
	"code-block": "_code-block_1f9vu_1",
	"code-header": "_code-header_1f9vu_12",
	"code-header-left": "_code-header-left_1f9vu_26",
	"language-pill": "_language-pill_1f9vu_34",
	filename: "_filename_1f9vu_49",
	"copy-button": "_copy-button_1f9vu_62",
	copied: "_copied_1f9vu_88",
	"code-wrapper": "_code-wrapper_1f9vu_97"
};
//#endregion
//#region ../../libs/blog-posts/src/lib/components/code-wrapper.tsx
var NON_COPYABLE_LANGUAGES = new Set([
	"text",
	"plaintext",
	"plain",
	"output",
	"console"
]);
var LANGUAGE_LABELS = {
	ini: "ini",
	yaml: "yaml",
	toml: "toml",
	bash: "bash",
	shell: "shell",
	sh: "sh",
	json: "json",
	typescript: "ts",
	ts: "ts",
	tsx: "tsx",
	javascript: "js",
	js: "js",
	jsx: "jsx",
	text: "text",
	plaintext: "text"
};
function getCodeLanguage(node) {
	if (!(0, import_react.isValidElement)(node)) return void 0;
	const className = node.props?.className;
	if (!className) return void 0;
	return /(?:^|\s)language-([\w-]+)/i.exec(className)?.[1]?.toLowerCase();
}
function CodeWrapper({ children, filename, noCopy, copy }) {
	const preRef = (0, import_react.useRef)(null);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const language = getCodeLanguage(children);
	const isNonCopyable = !language || NON_COPYABLE_LANGUAGES.has(language);
	const showCopy = copy ?? (!noCopy && !isNonCopyable);
	const showLanguage = !!language && !NON_COPYABLE_LANGUAGES.has(language);
	const renderHeader = !!filename || showCopy || showLanguage;
	const handleCopy = async () => {
		const text = preRef.current?.innerText ?? "";
		try {
			await navigator.clipboard.writeText(text.replace(/\n+$/, ""));
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1800);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: [code_wrapper_module_default["code-block"], renderHeader ? code_wrapper_module_default["has-header"] : ""].join(" "),
		children: [renderHeader && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: code_wrapper_module_default["code-header"],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: code_wrapper_module_default["code-header-left"],
				children: [showLanguage && language && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: code_wrapper_module_default["language-pill"],
					children: LANGUAGE_LABELS[language] ?? language
				}), filename && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: code_wrapper_module_default["filename"],
					children: filename
				})]
			}), showCopy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: [code_wrapper_module_default["copy-button"], copied ? code_wrapper_module_default["copied"] : ""].join(" "),
				onClick: handleCopy,
				"aria-label": copied ? "Copied to clipboard" : "Copy code to clipboard",
				children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckIcon, {}), "Copied"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyIcon, {}), "Copy"] })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			ref: preRef,
			className: code_wrapper_module_default["code-wrapper"],
			children
		})]
	});
}
function CopyIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 16 16",
		width: "14",
		height: "14",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.5",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "5",
			y: "5",
			width: "9",
			height: "9",
			rx: "1.5"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" })]
	});
}
function CheckIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 16 16",
		width: "14",
		height: "14",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 8.5l3.5 3.5L13 5" })
	});
}
//#endregion
//#region ../../libs/blog-posts/src/lib/utils/get-blog-url.ts
function getBlogUrl(blogPost) {
	return `/blog/${formatDateString(blogPost.publishDate)}/${blogPost.slug}`;
}
function formatDateString(date) {
	return date.toISOString().replace(/T.*/, "");
}
//#endregion
//#region ../../libs/blog-posts/src/lib/components/post-context.ts
var PostContext = (0, import_react.createContext)(null);
//#endregion
//#region ../../libs/blog-posts/src/lib/components/link-to-post.tsx
function LinkToPost({ slug, ref, title }) {
	const referringBlogPost = (0, import_react.useContext)(PostContext);
	ref ??= (() => {
		if (referringBlogPost) return getBlogUrl(referringBlogPost);
	})();
	const post = slugMap[slug];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: `${getBlogUrl(post)}${ref ? `?ref=${ref}` : ""}`,
		className: "text-blue-600 hover:underline",
		children: title ?? post.title
	});
}
var tabs_module_default = {
	tabs: "_tabs_1e66j_1",
	tabList: "_tabList_1e66j_9",
	tabButton: "_tabButton_1e66j_17",
	tabButtonActive: "_tabButtonActive_1e66j_42",
	tabPanel: "_tabPanel_1e66j_53"
};
//#endregion
//#region ../../libs/blog-posts/src/lib/components/tabs.tsx
var STORAGE_PREFIX = "craigory-dev:tabs:";
var CHANGE_EVENT = "craigory-dev:tabs-change";
function storageKey(groupId) {
	return STORAGE_PREFIX + groupId;
}
function useSyncedLabel(groupId, availableLabels, fallback) {
	const [label, setLabel] = (0, import_react.useState)(fallback);
	(0, import_react.useEffect)(() => {
		if (!groupId) return;
		const stored = window.localStorage.getItem(storageKey(groupId));
		if (stored && availableLabels.includes(stored)) setLabel(stored);
		const onChange = (event) => {
			const detail = event.detail;
			if (detail?.groupId === groupId && availableLabels.includes(detail.label)) setLabel(detail.label);
		};
		window.addEventListener(CHANGE_EVENT, onChange);
		return () => window.removeEventListener(CHANGE_EVENT, onChange);
	}, [groupId, availableLabels.join("|")]);
	const select = (next) => {
		setLabel(next);
		if (groupId) {
			window.localStorage.setItem(storageKey(groupId), next);
			window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: {
				groupId,
				label: next
			} }));
		}
	};
	return [label, select];
}
function Tab({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function Tabs({ groupId, children }) {
	const instanceId = (0, import_react.useId)();
	const panels = import_react.Children.toArray(children).filter((child) => (0, import_react.isValidElement)(child) && child.type === Tab);
	const labels = panels.map((panel) => panel.props.label);
	const fallback = labels[0] ?? "";
	const [selected, setSelected] = useSyncedLabel(groupId, labels, fallback);
	const active = labels.includes(selected) ? selected : fallback;
	if (panels.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: tabs_module_default["tabs"],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: tabs_module_default["tabList"],
			role: "tablist",
			children: labels.map((label) => {
				const isActive = label === active;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					role: "tab",
					id: `${instanceId}-tab-${label}`,
					"aria-selected": isActive,
					"aria-controls": `${instanceId}-panel-${label}`,
					tabIndex: isActive ? 0 : -1,
					className: `${tabs_module_default["tabButton"]} ${isActive ? tabs_module_default["tabButtonActive"] : ""}`,
					onClick: () => setSelected(label),
					children: label
				}, label);
			})
		}), panels.map((panel) => {
			const isActive = panel.props.label === active;
			const tabId = `${instanceId}-tab-${panel.props.label}`;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: `${instanceId}-panel-${panel.props.label}`,
				role: "tabpanel",
				"aria-labelledby": tabId,
				hidden: !isActive,
				className: tabs_module_default["tabPanel"],
				children: panel.props.children
			}, panel.props.label);
		})]
	});
}
var tiki_table_module_default = {
	tableContainer: "_tableContainer_c7b84_2",
	tikiTable: "_tikiTable_c7b84_10",
	sortable: "_sortable_c7b84_68",
	barName: "_barName_c7b84_77",
	blogLink: "_blogLink_c7b84_82",
	description: "_description_c7b84_92",
	starRating: "_starRating_c7b84_98",
	stars: "_stars_c7b84_105",
	star: "_star_c7b84_98",
	halfStar: "_halfStar_c7b84_116",
	emptyStar: "_emptyStar_c7b84_131",
	ratingValue: "_ratingValue_c7b84_136",
	na: "_na_c7b84_142",
	links: "_links_c7b84_148",
	mapLink: "_mapLink_c7b84_154",
	reviewLink: "_reviewLink_c7b84_155",
	ratingColumn: "_ratingColumn_c7b84_186"
};
//#endregion
//#region ../../libs/blog-posts/src/lib/components/tiki-table.tsx
var DATA = [
	{
		bar: "Pineapple Parlor",
		blogSlug: "pineapple-parlor",
		googleMapsLink: "https://maps.app.goo.gl/kFvBPXxiWxJJchm56",
		location: "Galveston, TX",
		description: "Tiki speakeasy, be sure to find the entry code before coming.",
		overall: 4.5,
		food: 5,
		drinks: 4,
		decor: 4,
		visits: [/* @__PURE__ */ new Date("2025-05-25")]
	},
	{
		bar: "The Inferno Room",
		blogSlug: "inferno-room",
		googleMapsLink: "https://maps.app.goo.gl/SD9mU6XEH7ggPBcF8",
		location: "Indianapolis, IN",
		description: "A fiery tiki bar with a unique cocktail menu.",
		overall: 4,
		food: 4,
		drinks: 4.5,
		decor: 5,
		visits: [/* @__PURE__ */ new Date("2025-08-01")]
	},
	{
		bar: "Trader Sam’s Grog Grotto",
		blogSlug: "trader-sams-grog-grotto",
		googleMapsLink: "https://maps.app.goo.gl/boJGqCEg6evwyqYe8",
		location: "Lake Buena Vista, FL",
		description: "A world class tiki bar, nestled inside Disney’s Polynesian Village Resort.",
		overall: 4.5,
		drinks: 4.5,
		decor: 5,
		visits: [/* @__PURE__ */ new Date("2025-03-13")]
	},
	{
		bar: "Tiki Chick",
		blogSlug: "tiki-chick",
		googleMapsLink: "https://maps.app.goo.gl/DchFxZdhoeCowypz8",
		location: "NYC, NY",
		description: "Less heavily themed tiki bar with excellent drinks, creative seating, and $5 chicken sandwiches",
		overall: 3.5,
		drinks: 4,
		decor: 2,
		food: 4,
		visits: [/* @__PURE__ */ new Date("2023-09-29"), /* @__PURE__ */ new Date("2025-12-05")]
	},
	{
		bar: "The Kaona Room",
		blogSlug: "kaona-room",
		googleMapsLink: "https://maps.app.goo.gl/dtHnXSvbzPCkR9CQ7",
		location: "Miami, FL",
		description: "An unusual visit makes a real rating inappropriate, see blog.",
		decor: 3.5,
		visits: [/* @__PURE__ */ new Date("2023-10-01")]
	},
	{
		bar: "Kon Tiki",
		blogSlug: "kon-tiki",
		googleMapsLink: "https://maps.app.goo.gl/d8YEchnt9VeX5YJr9",
		location: "Kansas City, MO",
		description: "A vibrant tiki bar with a lively atmosphere and creative cocktails.",
		overall: 3.5,
		drinks: 4,
		decor: 3,
		visits: [/* @__PURE__ */ new Date("2025-08-15")]
	},
	{
		bar: "Rum Barrel West",
		blogSlug: "rum-barrel-west",
		googleMapsLink: "https://maps.app.goo.gl/TnSh4sji1B8xiQEe7",
		location: "Amsterdam, NL",
		description: "A cozy rum bar with a great selection of cocktails and rums.",
		overall: 3.5,
		food: 3,
		drinks: 4,
		decor: 1.5,
		visits: [/* @__PURE__ */ new Date("2025-08-20")]
	},
	{
		bar: "Sunken Harbor Club",
		blogSlug: "sunken-harbor-club",
		googleMapsLink: "https://maps.app.goo.gl/nKXh4pAKP57gBtqq5",
		location: "Brooklyn, NY",
		description: "A nautical themed tiki bar located above Gage and Tollner in Brooklyn, NY.",
		overall: 4.5,
		food: 4.5,
		drinks: 4.5,
		decor: 4,
		visits: [/* @__PURE__ */ new Date("2025-12-06")]
	},
	{
		bar: "Tiki Tiki Bang Bang",
		blogSlug: "tiki-tiki-bang-bang",
		googleMapsLink: "https://maps.app.goo.gl/stxe1rLabJDcfEmY8",
		location: "Cincinnati, OH",
		description: "A heavily themed tiki bar with comfortable seating, friendly staff, and a great mug program.",
		overall: 4,
		drinks: 3,
		decor: 4.5,
		visits: [/* @__PURE__ */ new Date("2026-06-13")]
	},
	{
		bar: "Paradise Lost",
		blogSlug: "paradise-lost",
		googleMapsLink: "https://maps.app.goo.gl/d5BQGcLvhUeMrEtW6",
		location: "East Village, NYC, NY",
		description: "A tiki speakeasy located in the East Village, NYC.",
		overall: 3,
		drinks: 4,
		decor: 3,
		visits: [/* @__PURE__ */ new Date("2025-12-06")]
	}
];
function StarRating({ rating, maxRating = 5 }) {
	const stars = [];
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 >= .5;
	for (let i = 0; i < fullStars; i++) stars.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: tiki_table_module_default["star"],
		children: "★"
	}, `full-${i}`));
	if (hasHalfStar && fullStars < maxRating) stars.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: tiki_table_module_default["halfStar"],
		children: "★"
	}, "half"));
	const emptyStars = maxRating - Math.ceil(rating);
	for (let i = 0; i < emptyStars; i++) stars.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: tiki_table_module_default["emptyStar"],
		children: "☆"
	}, `empty-${i}`));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: tiki_table_module_default["starRating"],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: tiki_table_module_default["stars"],
			children: stars
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: tiki_table_module_default["ratingValue"],
			children: rating.toFixed(1)
		})]
	});
}
function TikiTable({ ratings }) {
	const [sortKey, setSortKey] = (0, import_react.useState)("overall");
	const [sortDirection, setSortDirection] = (0, import_react.useState)("desc");
	const handleSort = (key) => {
		if (sortKey === key) setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		else {
			setSortKey(key);
			setSortDirection("desc");
		}
	};
	const sortedRatings = (0, import_react.useMemo)(() => {
		return [...ratings ?? DATA].sort((a, b) => {
			let aValue;
			let bValue;
			switch (sortKey) {
				case "bar":
				case "location":
					aValue = a[sortKey].toLowerCase();
					bValue = b[sortKey].toLowerCase();
					break;
				case "food":
					aValue = a.food ?? 0;
					bValue = b.food ?? 0;
					break;
				default:
					aValue = a[sortKey] ?? 0;
					bValue = b[sortKey] ?? 0;
			}
			if (aValue === void 0 || bValue === void 0) return 0;
			if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
			if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
			return 0;
		});
	}, [
		ratings,
		sortKey,
		sortDirection
	]);
	const getSortIcon = (key) => {
		if (sortKey !== key) return "↕";
		return sortDirection === "asc" ? "↑" : "↓";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: tiki_table_module_default["tableContainer"],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: tiki_table_module_default["tikiTable"],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
					onClick: () => handleSort("bar"),
					className: tiki_table_module_default["sortable"],
					children: ["Bar Name ", getSortIcon("bar")]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
					onClick: () => handleSort("location"),
					className: tiki_table_module_default["sortable"],
					children: ["Location ", getSortIcon("location")]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
					onClick: () => handleSort("overall"),
					className: tiki_table_module_default["sortable"],
					children: ["Overall ", getSortIcon("overall")]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
					onClick: () => handleSort("food"),
					className: tiki_table_module_default["sortable"],
					children: ["Food ", getSortIcon("food")]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
					onClick: () => handleSort("drinks"),
					className: tiki_table_module_default["sortable"],
					children: ["Drinks ", getSortIcon("drinks")]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
					onClick: () => handleSort("decor"),
					className: tiki_table_module_default["sortable"],
					children: ["Decor ", getSortIcon("decor")]
				})
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: sortedRatings.map((rating, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: tiki_table_module_default["barName"],
					children: rating.blogSlug ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkToPost, {
						slug: rating.blogSlug,
						title: rating.bar
					}) : rating.bar
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: rating.googleMapsLink ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: rating.googleMapsLink,
					target: "_blank",
					rel: "noopener noreferrer",
					className: tiki_table_module_default["mapLink"],
					children: rating.location
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: tiki_table_module_default["na"],
					children: rating.location
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RatingCell, { rating: rating.overall }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RatingCell, { rating: rating.food }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RatingCell, { rating: rating.drinks }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RatingCell, { rating: rating.decor })
			] }, `${rating.bar}-${index}`)) })]
		})
	});
}
function RatingCell({ rating }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		className: tiki_table_module_default["ratingColumn"],
		children: rating === void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: tiki_table_module_default["na"],
			children: "N/A"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarRating, { rating })
	});
}
//#endregion
export { PostContext as a, Cite as c, LinkToPost as i, blogPosts as l, Tab as n, getBlogUrl as o, Tabs as r, CodeWrapper as s, TikiTable as t, slugMap as u };
