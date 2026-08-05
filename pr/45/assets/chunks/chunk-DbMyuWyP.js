import { r as __toESM } from "./chunk-Sg1e8hzK.js";
import { a as require_react, n as require_jsx_runtime } from "./chunk-bRLaqz_4.js";
import { t as __vitePreload } from "./chunk-BS1ChMwy.js";
//#region \0rolldown_dynamic_import_helper.js
var _rolldown_dynamic_import_helper_default = (glob, path, segments) => {
	const query = path.lastIndexOf("?");
	const v = glob[query === -1 || query < path.lastIndexOf("/") ? path : path.slice(0, query)];
	if (v) return typeof v === "function" ? v() : Promise.resolve(v);
	return new Promise((_, reject) => {
		(typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(reject.bind(null, /* @__PURE__ */ new Error("Unknown variable dynamic import: " + path + (path.split("/").length !== segments ? ". Note that variables only represent file names one level deep." : ""))));
	});
};
//#endregion
//#region ../../libs/presentations/src/presentation-data/that-conf-wi-2023-benchmarking/index.ts
var import_react = /* @__PURE__ */ __toESM(require_react());
//#endregion
//#region ../../libs/presentations/src/lib/presentations.ts
var PRESENTATIONS = [
	{
		title: "Benchmarking like a Scientist: Communicating Code's Performance.",
		description: `This session will explore several aspects of benchmarking. We will start by introducing the concept of code benchmarking, what it is and why it is important in software development. We will then cover the different approaches to benchmarking, including micro, macro, and synthetic benchmarking, and examine the pros and cons of each method.\nNext, we will delve into the best practices of benchmarking and the common pitfalls to avoid. This will include topics such as selecting the right metrics, avoiding bias in your benchmark results, and controlling environmental factors to ensure repeatability and reproducibility. We will also discuss the importance of benchmarking throughout the development process, and how it can be used to inform design decisions and optimize code.        In addition to the technical aspects of benchmarking, we will also be focusing on the crucial aspect of communication. We will cover how to present your benchmark results in a clear and concise manner, so that they can be easily understood by both technical and non-technical stakeholders. This includes best practices for visualizing your results, and tips for effectively communicating the performance of your code.\nThis session is aimed at developers of all levels, from those new to the field to experienced professionals. Whether you are looking to improve your benchmarking skills, or simply want to gain a deeper understanding of the science behind code performance, this session will provide you with the knowledge and tools you need to succeed.`,
		presentedAt: "THAT Conference WI",
		presentedOn: new Date(2023, 6, 27),
		mdUrl: "slides",
		slug: "that-conf-wi-2023-benchmarking",
		extraLinks: [{
			url: "https://that.us/activities/WGucIjHEx8oacKVjMPac",
			title: "THAT link"
		}]
	},
	{
		title: "Full Stack Type Safety Across Languages",
		description: `One of the benefits many companies see in monorepos is that you can share interfaces across your front-end and back-end code. Sharing interfaces enables you to create bulletproof API layers on the web but requires that your back end is also in JS.\n  This chat will introduce Nx to facilitate the conversation and use .NET and Angular as the driving example. Knowledge of the three technologies is optional, though; the tools will only be introduced enough to understand what is needed. All knowledge introduced should be transferrable to other tools.\nWe can take advantage of build pipelines and dependencies to ensure that accurate typings are generated for our front end before the typescript build, and introducing caching prevents any of the slowdowns that folks may be accustomed to with some older monorepo solutions.\nThe second half of the session will guide attendees in setting this up on their local machine, so that they can more thoroughly interact with it.`,
		presentedAt: "THAT Conference TX",
		presentedOn: new Date(2023, 0, 17),
		slug: "that-conf-tx-2023-full-stack-type-safety",
		extraLinks: [{
			url: "https://that.us/activities/O5RNWW66L8aAGvtb9ikN",
			title: "THAT link"
		}]
	},
	{
		title: "Nx for your Stack",
		description: `Take Nx beyond JavaScript incrementally, starting with only a few simple steps. From run-commands and shell scripts, up to a full custom plugin, Nx is capable of handling any language and tooling thrown at it. Experience the full benefits Nx provides in Angular, React, and Node, with the full stack of your choice.`,
		presentedAt: "Nx Conf",
		presentedOn: new Date(2021, 8, 16),
		recordingUrl: "https://www.youtube.com/watch?v=IRIXPTIKTmA",
		slug: "nx-conf-2021-nx-for-your-stack"
	},
	{
		title: "Progressively enhance your DX with Nx",
		description: `Nx gives you tools to level up your productivity and DX. You can start off with a minimal setup and progressively add features by using plugins. Learn how Nx can help projects of any size to thrive.`,
		presentedAt: "Nx Conf Lite",
		presentedOn: new Date(2022, 3, 29),
		recordingUrl: "https://www.youtube.com/watch?v=FKSxIJyB508",
		slug: "nx-conf-lite-2022-progressive-enhancement"
	},
	{
		title: "Benchmarking like a Scientist: Communicating Code's Performance.",
		description: `As software developers, it's not enough to simply write efficient code - we need to be able to communicate its performance effectively too. That's where benchmarking comes in. In this session, we'll dive into benchmarking, examining the different approaches and tools available for measuring the performance of your code. From micro to macro and synthetic benchmarking, we'll cover best practices and common pitfalls to avoid. We'll also delve into the crucial aspect of communication - how to present your benchmark results in a clear and concise manner, so that they can be easily understood by both technical and non-technical stakeholders. Whether you're a seasoned developer or new to the field, this talk will give you the skills and knowledge you need to effectively benchmark your code and communicate its performance.`,
		presentedAt: "dev up",
		presentedOn: new Date(2023, 7, 28),
		slug: "devup-2023-benchmarking",
		mdUrl: "slides",
		scssUrl: "slides"
	},
	{
		title: "Full Stack Type Safety Across Languages",
		description: `Explore how type safety can transcend language barriers, and how you can combine your front-end and back-end code into a killer monorepo with Nx, .NET, and Angular. Using openapi extraction and code generation, we will explore how changing an interface in the backend can trigger build time failures for your front end, and exactly why that is a good thing anyways.\nThe driving example will utilize C# and ASP.NET Core, with Angular for the front end. Alternative commands will be provided for react, but both the front end and back end can be swapped out for nearly any tool that you may want to use`,
		presentedAt: "dev up",
		presentedOn: new Date(2023, 7, 28),
		slug: "devup-2023-full-stack-type-safety",
		mdUrl: "slides",
		scssUrl: "slides"
	},
	{
		title: "Redefining Projects with Nx: A Dive into the New Inference API",
		description: `In a continuous strive for improvement, we have revamped the project inference API, aiming to provide greater flexibility and power in defining and managing projects. This talk will walk through the evolution of the project inference API, highlighting the transition from a 1:1 file-to-project mapping to a more nuanced approach that handles complex project configurations. We'll explore the key advantages of the new API, including the ability to define multiple projects within a single file and set more comprehensive project properties. Join us to learn about these exciting changes and understand how they can enhance your work with Nx.`,
		presentedAt: "Nx Conf 2023",
		presentedOn: new Date(2023, 10, 26),
		slug: "nx-conf-2023-inference",
		mdUrl: "slides",
		scssUrl: "slides",
		recordingUrl: "https://www.youtube.com/live/IQ5YyEYZw68?si=TQRfAG7CtNbd3Xu4&t=8514",
		extraLinks: [{
			title: "Demo Repo",
			url: "https://github.com/AgentEnder/inference-demo"
		}, {
			title: "Nx .NET plugin API v2 PR",
			url: "https://github.com/nx-dotnet/nx-dotnet/pull/763"
		}]
	},
	{
		title: "From Spaghetti to S'mores: Tasty Techniques for Code Compartmentalization",
		description: `Just as a camper carefully layers ingredients for the perfect s'more, a developer can construct code with precise structure and compartmentalization. Spaghetti code often results in a development experience that's as messy as an over-melted marshmallow, but with the right strategies, we can achieve clarity and maintainability in our projects.

  In this session, attendees will dive into the layers of code compartmentalization, from understanding the importance of clear modular boundaries to appreciating the advantages of single-responsibility components. Additionally, a subtle yet impactful touch to this organized approach is the integration of monorepo tooling, ensuring cohesion and simplicity in larger projects.
  
  By the end, participants will be equipped with a toolkit that ensures their code remains organized, adaptable, and streamlined. Whether seeking strategies to simplify legacy systems or contemplating the management of new projects, this talk offers insights and guidance to refine your development process, much like the art of crafting a perfectly layered s'more.
  `,
		presentedAt: "THAT Conference TX",
		presentedOn: new Date(2024, 0, 31),
		mdUrl: "slides",
		slug: "that-conf-tx-2024-compartmentalization",
		extraLinks: [{
			url: "https://thatconference.com/activities/PalQD9RFAmU7lfbig47x",
			title: "THAT link"
		}]
	},
	{
		title: "Nx Project Crystal 💎 + .NET",
		description: "Nx Project Crystal provides plugins a easy path for onboarding to the Nx ecosystem. This quick showcase demonstrates how .NET can be easily integrated into the Nx ecosystem, and also how Nx could be easily used to enhance .NET projects with minimal file changes.",
		presentedAt: "Launch Nx Conf",
		presentedOn: new Date(2024, 1, 8),
		recordingUrl: "https://www.youtube.com/watch?v=fy0K2Smyj5A",
		slug: "launch-nx-conf-2024-crystal-dotnet"
	},
	{
		title: "From Spaghetti to S'mores: Tasty Techniques for Code Compartmentalization",
		description: `Just as a camper carefully layers ingredients for the perfect s'more, a developer can construct code with precise structure and compartmentalization. Spaghetti code often results in a development experience that's as messy as an over-melted marshmallow, but with the right strategies, we can achieve clarity and maintainability in our projects.

  In this session, attendees will dive into the layers of code compartmentalization, from understanding the importance of clear modular boundaries to appreciating the advantages of single-responsibility components. Additionally, a subtle yet impactful touch to this organized approach is the integration of monorepo tooling, ensuring cohesion and simplicity in larger projects.
  
  By the end, participants will be equipped with a toolkit that ensures their code remains organized, adaptable, and streamlined. Whether seeking strategies to simplify legacy systems or contemplating the management of new projects, this talk offers insights and guidance to refine your development process, much like the art of crafting a perfectly layered s'more.
  `,
		presentedAt: "THAT Conference WI",
		presentedOn: new Date(2024, 7, 1),
		mdUrl: "slides",
		slug: "that-conf-wi-2024-spaghetti",
		extraLinks: [{
			url: "https://thatconference.com/activities/PalQD9RFAmU7lfbig47x",
			title: "THAT link"
		}]
	},
	{
		title: "Smooth Scaling, Happy Coding: Navigating Monorepo Adoption with Nx",
		description: `When your team grows, things get complicated fast. More apps mean more dependencies, code duplication, and headaches managing multiple repositories. At first, separate repos feel manageable, but soon you're stuck juggling inconsistent tooling, duplicated effort, and tricky dependency puzzles.

This talk walks through the real-world journey of adopting a monorepo strategy, sharing the tough spots you'll probably encounter along the way. I'll show how using Nx can ease the transition and make managing your monorepo a lot smoother as well as practical ways Nx helps keep your builds fast, your workflows clean, and your developers happy.

Whether you're already feeling the pain of scaling or just curious about monorepos, you'll leave with useful tips, real-life insights, and solid strategies for keeping growth smooth and your codebase healthy.`,
		presentedAt: "KCDC",
		presentedOn: new Date(2025, 7, 15),
		slug: "kcdc-2025-monorepo-nx",
		mdUrl: "slides",
		scssUrl: "slides"
	}
].sort((a, b) => b.presentedOn.getTime() - a.presentedOn.getTime()).reduce((acc, cur) => {
	if (cur.slug in acc) throw new Error("Multiple presentations should not have the same slug:" + cur.slug);
	acc[cur.slug] = cur;
	return acc;
}, {});
//#endregion
//#region ../../libs/presentations/src/lib/post-remark-load.js?raw
var post_remark_load_default = "this.initialized = false;\n\n// eslint-disable-next-line no-undef\nremark\n  // eslint-disable-next-line no-undef\n  .create({ source: `${md}`, ratio: '16:9' })\n  .on('showSlide', function (slide) {\n    if (this.initialized) return;\n    this.initialized = true;\n    const observer = new IntersectionObserver(\n      (entries) => {\n        entries.forEach((entry) => {\n          if (entry.target instanceof HTMLVideoElement) {\n            if (entry.isIntersecting) {\n              entry.target.play();\n              entry.target.currentTime = 0;\n            } else if (!entry.isIntersecting) {\n              entry.target.pause();\n            }\n          } else if (entry.target instanceof HTMLImageElement) {\n            if (entry.isIntersecting && entry.target.src.endsWith('.gif')) {\n              entry.target.src = entry.target.getAttribute('src');\n            }\n          }\n        });\n      },\n      {\n        rootMargin: '0px',\n        threshold: 0.95,\n        root: document.querySelector('.remark-visible'),\n      }\n    );\n    document.querySelectorAll('video,img').forEach((el) => {\n      observer.observe(el);\n    });\n  });\n";
//#endregion
//#region ../../libs/presentations/src/lib/view-presentation.tsx
var import_jsx_runtime = require_jsx_runtime();
function ViewPresentation(props) {
	const [remarkLoaded, setRemarkedLoaded] = (0, import_react.useState)(false);
	const [md, setMd] = (0, import_react.useState)();
	(0, import_react.useEffect)(() => {
		const p = PRESENTATIONS[props.presentationSlug];
		if (p?.mdUrl) (async function() {
			try {
				const res = (await _rolldown_dynamic_import_helper_default(/* @__PURE__ */ Object.assign({
					"../presentation-data/devup-2023-benchmarking/slides.md": () => __vitePreload(() => import("./chunk-BtVXYkdc.js"), []),
					"../presentation-data/devup-2023-full-stack-type-safety/slides.md": () => __vitePreload(() => import("./chunk-BVC4Bf0m.js"), []),
					"../presentation-data/kcdc-2025-monorepo-nx/slides.md": () => __vitePreload(() => import("./chunk-C2FHImUf.js"), []),
					"../presentation-data/nx-conf-2023-inference/slides.md": () => __vitePreload(() => import("./chunk-D-nu_Aga.js"), []),
					"../presentation-data/that-conf-tx-2024-compartmentalization/slides.md": () => __vitePreload(() => import("./chunk-LNG9hAB0.js"), []),
					"../presentation-data/that-conf-wi-2023-benchmarking/slides.md": () => __vitePreload(() => import("./chunk-6fwwIgm8.js"), []),
					"../presentation-data/that-conf-wi-2024-spaghetti/slides.md": () => __vitePreload(() => import("./chunk-BfERJ9yK.js"), [])
				}), `../presentation-data/${p.slug}/${p.mdUrl}.md?raw`, 4)).default;
				console.log("Raw markdown:", res);
				const normalized = res.replace(/`/g, "\\`").replace(/\${/g, "\\${");
				console.log("Normalized markdown:", normalized);
				setMd(normalized);
			} catch (error) {
				console.error("Failed to load markdown:", error);
			}
		})();
		const existingStyle = document.getElementById("presentation-style");
		if (existingStyle) existingStyle.remove();
		if (p?.scssUrl) (/* @__PURE__ */ Object.assign({
			"../presentation-data/devup-2023-benchmarking/slides.scss": () => __vitePreload(() => import("./chunk-CNbX6Oo-.js"), []),
			"../presentation-data/devup-2023-full-stack-type-safety/slides.scss": () => __vitePreload(() => import("./chunk-CB4MGuB0.js"), []),
			"../presentation-data/kcdc-2025-monorepo-nx/slides.scss": () => __vitePreload(() => import("./chunk-9uQmCG9S.js"), []),
			"../presentation-data/nx-conf-2023-inference/slides.scss": () => __vitePreload(() => import("./chunk-lZ4-EeKm.js"), [])
		}))[`../presentation-data/${p.slug}/${p.scssUrl}.scss`]().then((scss) => {
			const style = document.createElement("style");
			style.id = "presentation-style";
			style.innerHTML = scss.default;
			document.head.appendChild(style);
		});
		if (p?.htmlUrl) (async function() {
			const html = await _rolldown_dynamic_import_helper_default(/* @__PURE__ */ Object.assign({}), `../presentation-data/${p.slug}/${p.htmlUrl}.html?raw`, 4);
			document.body.innerHTML = html.default;
		})();
	}, [props.presentationSlug]);
	useScript({ url: "https://remarkjs.com/downloads/remark-latest.min.js" }, () => {
		console.log("remark script loaded");
		setRemarkedLoaded(true);
	});
	useScript({
		body: post_remark_load_default.replace("`${md}`", `\`${md}\``),
		waitFor: [remarkLoaded, md]
	}, () => {
		console.log("afterRemarkLoaded executed");
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, {});
}
function useScript({ url, body, waitFor }, onReady) {
	(0, import_react.useEffect)(() => {
		const cleanupTasks = [];
		console.log("waitFor:", waitFor);
		if (waitFor === void 0 || waitFor.every((w) => !!w)) {
			console.log("Inserting script:", {
				url,
				body,
				waitFor
			});
			const script = document.createElement("script");
			script.className = "dynamic-script";
			if (url) {
				console.log("Setting up external script:", url);
				script.src = url;
				if (onReady) {
					script.onload = () => {
						console.log("External script loaded:", url);
						onReady();
					};
					script.onerror = (error) => {
						console.error("Failed to load external script:", url, error);
					};
				}
				console.log("Script element created with src:", script.src);
			} else if (body) {
				console.log("Setting up inline script, length:", body.length);
				script.innerHTML = body.replace(/<\/script>/gi, "<\\/script>");
			}
			console.log("Appending script to body...");
			document.body.appendChild(script);
			if (body && onReady) setTimeout(onReady, 0);
			cleanupTasks.push(() => {
				script.remove();
			});
		}
		return () => {
			for (const task of cleanupTasks) task();
		};
	}, [
		body,
		url,
		onReady,
		waitFor
	]);
}
//#endregion
export { PRESENTATIONS as n, ViewPresentation as t };
