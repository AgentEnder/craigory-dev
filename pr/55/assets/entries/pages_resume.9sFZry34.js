import { n as __exportAll, r as __toESM } from "../chunks/chunk-_a1GHatX.js";
import { a as require_react, n as require_jsx_runtime, r as onRenderClient, t as Loading_default } from "../chunks/chunk-fwNFIR-W.js";
import { t as Link } from "../chunks/chunk-D_ZczPPm.js";
import { n as PRESENTATIONS } from "../chunks/chunk-C12F-nMD.js";
//#region pages/resume/resume.module.scss
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var resume_module_default = {
	page: "_page_19ebn_11",
	toolbar: "_toolbar_19ebn_41",
	back: "_back_19ebn_49",
	print: "_print_19ebn_57",
	sheet: "_sheet_19ebn_70",
	header: "_header_19ebn_80",
	name: "_name_19ebn_90",
	headline: "_headline_19ebn_97",
	contact: "_contact_19ebn_102",
	body: "_body_19ebn_111",
	summary: "_summary_19ebn_115",
	aside: "_aside_19ebn_116",
	main: "_main_19ebn_123",
	asideSection: "_asideSection_19ebn_129",
	asideHeading: "_asideHeading_19ebn_133",
	technologies: "_technologies_19ebn_147",
	talks: "_talks_19ebn_148",
	technology: "_technology_19ebn_153",
	talk: "_talk_19ebn_148",
	technologyName: "_technologyName_19ebn_162",
	talkTitle: "_talkTitle_19ebn_163",
	technologyItems: "_technologyItems_19ebn_167",
	talkEvents: "_talkEvents_19ebn_168",
	talkLinks: "_talkLinks_19ebn_173",
	section: "_section_19ebn_182",
	sectionHeading: "_sectionHeading_19ebn_186",
	more: "_more_19ebn_195",
	entry: "_entry_19ebn_204",
	nx: "_nx_19ebn_1",
	entryHeader: "_entryHeader_19ebn_217",
	entryName: "_entryName_19ebn_225",
	tag: "_tag_19ebn_237",
	dates: "_dates_19ebn_250",
	role: "_role_19ebn_251",
	lead: "_lead_19ebn_256",
	groupHeading: "_groupHeading_19ebn_260",
	bullets: "_bullets_19ebn_269",
	entryLinks: "_entryLinks_19ebn_277"
};
//#endregion
//#region pages/resume/resume-data.ts
var resume = {
	name: "Craigory Coppola",
	headline: "Senior Software Engineer at Nx",
	links: [{
		label: "github.com/AgentEnder",
		href: "https://github.com/AgentEnder"
	}, {
		label: "linkedin.com/in/craigoryvcoppola",
		href: "https://www.linkedin.com/in/craigoryvcoppola"
	}],
	summary: "Senior software engineer at Nx since 2021. I own the plugin API and .NET support. Outside Nx I build developer tools, agent skills, and a SaaS for wrestling promotions.",
	sections: [
		{
			heading: "Experience",
			entries: [
				{
					id: "nx",
					name: "Nx",
					href: "https://nx.dev",
					roles: ["Senior Software Engineer, November 2021 to present", "Software Engineer, June 2021 to November 2021"],
					groups: [{ bullets: [
						"Designed the plugin API behind Project Crystal.",
						"Wrote @nx/dotnet, the first-party .NET plugin.",
						"Led the Rust terminal UI for task runs.",
						"Led SOC 2 compliance since the initial 2024 audit.",
						"Led the public response to the S1ngularity supply-chain attack."
					] }]
				},
				{
					id: "twice-baked",
					name: "Twice Baked Software",
					roles: ["Founder, 2025 to present"],
					groups: [{ bullets: ["Sole engineer on Turnbuckle (turnbucklehq.com), a multi-tenant SaaS for running pro wrestling promotions."] }]
				},
				{
					id: "ups",
					name: "Universal Plant Services",
					roles: ["Software Engineer, March 2020 to May 2021", "Software Development Engineer in Test, August 2019 to March 2020"],
					groups: [{ bullets: [
						"Built a task workflow engine with automatic completion and a kanban board.",
						"Built release notes and outage announcements for every product.",
						"Built a shared web and mobile framework in Angular, NativeScript, and Electron."
					] }]
				}
			]
		},
		{
			heading: "Projects",
			more: {
				label: "craigory.dev/projects",
				href: "https://craigory.dev/projects"
			},
			entries: [
				{
					id: "functional-examples",
					name: "functional-examples",
					href: "https://craigory.dev/functional-examples",
					lead: "Runs code examples as tests and generates docs from them."
				},
				{
					id: "genealogy-skills",
					name: "genealogy-skills",
					private: true,
					dates: "2026",
					groups: [{ bullets: ["10 agent skills for genealogy research and family tree upkeep.", "A CLI with adapters for GEDCOM, MyHeritage, FamilySearch, and Find a Grave."] }]
				},
				{
					id: "cli-forge",
					name: "cli-forge",
					href: "https://craigory.dev/cli-forge",
					lead: "A TypeScript CLI framework that infers types for every option and argument."
				}
			]
		},
		{
			heading: "Education",
			entries: [{
				id: "morehead-state",
				name: "Morehead State University",
				dates: "2016 to 2020",
				lead: "Bachelor's degree in Mathematics and Computer Science, 4.0 GPA.",
				groups: [{
					heading: "ACM chapter president, 2017 to 2019",
					bullets: ["Led game dev seminars, built the chapter's first site, and set it up to outlast me."]
				}, {
					heading: "Undergraduate research, 2018 to 2019",
					bullets: ["First author, \"Novel Machine Learning Algorithms for Centrality and Cliques Detection in YouTube Social Networks,\" IJAIA, 2020."]
				}],
				links: [{
					label: "doi.org/10.5121/ijaia.2020.11106",
					href: "https://doi.org/10.5121/ijaia.2020.11106"
				}]
			}]
		}
	],
	technologies: [
		{
			category: "Languages",
			items: [
				"TypeScript",
				"Rust",
				"C#",
				"Python",
				"SQL"
			]
		},
		{
			category: "Frameworks / Libraries",
			items: [
				"React",
				"Vike",
				"Angular",
				".NET",
				"Hono",
				"Electron",
				"NativeScript",
				"scikit-learn"
			]
		},
		{
			category: "Databases",
			items: [
				"SQLite",
				"Turso",
				"MSSQL"
			]
		},
		{
			category: "Misc",
			items: [
				"Nx",
				"Node.js",
				"Bun",
				"Cloudflare Workers",
				"GitHub Actions",
				"Playwright",
				"PostHog",
				"Stripe"
			]
		}
	],
	talks: [
		{
			title: "Smooth Scaling, Happy Coding: Navigating Monorepo Adoption with Nx",
			events: "KCDC 2025",
			slugs: ["kcdc-2025-monorepo-nx"]
		},
		{
			title: "Nx Project Crystal + .NET",
			events: "Launch Nx Conf 2024",
			slugs: ["launch-nx-conf-2024-crystal-dotnet"]
		},
		{
			title: "From Spaghetti to S'mores",
			events: "THAT Conference Texas and Wisconsin, 2024",
			slugs: ["that-conf-wi-2024-spaghetti", "that-conf-tx-2024-compartmentalization"]
		},
		{
			title: "Redefining Projects with Nx: A Dive into the New Inference API",
			events: "Nx Conf 2023",
			slugs: ["nx-conf-2023-inference"]
		},
		{
			title: "Benchmarking like a Scientist",
			events: "THAT Conference Wisconsin and DevUp, 2023",
			slugs: ["devup-2023-benchmarking", "that-conf-wi-2023-benchmarking"]
		},
		{
			title: "Full Stack Type Safety Across Languages",
			events: "THAT Conference Texas and DevUp, 2023",
			slugs: ["devup-2023-full-stack-type-safety", "that-conf-tx-2023-full-stack-type-safety"]
		},
		{
			title: "Progressively enhance your DX with Nx",
			events: "Nx Conf Lite 2022",
			slugs: ["nx-conf-lite-2022-progressive-enhancement"]
		},
		{
			title: "Nx for your Stack",
			events: "Nx Conf 2021",
			slugs: ["nx-conf-2021-nx-for-your-stack"]
		}
	]
};
/**
* The slides route only prerenders presentations with markdown slides, so a
* slides link is offered only for those. Anything else would 404.
*/
function talkLinks(slugs) {
	const presentations = slugs.map((slug) => {
		const presentation = PRESENTATIONS[slug];
		if (!presentation) throw new Error(`Unknown presentation slug: ${slug}`);
		return presentation;
	});
	const withSlides = presentations.find((p) => p.mdUrl);
	return {
		slides: withSlides && `/presentations/view/${withSlides.slug}`,
		recording: presentations.find((p) => p.recordingUrl)?.recordingUrl
	};
}
//#endregion
//#region pages/resume/+Page.tsx
var _Page_exports = /* @__PURE__ */ __exportAll({ Page: () => Page });
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: resume_module_default.page,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: resume_module_default.toolbar,
			"aria-label": "Resume",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				className: resume_module_default.back,
				href: "/",
				children: "← craigory.dev"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: resume_module_default.print,
				onClick: () => window.print(),
				children: "Print / PDF"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: resume_module_default.sheet,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: resume_module_default.header,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: resume_module_default.name,
					children: resume.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: resume_module_default.headline,
					children: resume.headline
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: resume_module_default.contact,
					children: resume.links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: link.href,
						children: link.label
					}, link.href))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: resume_module_default.body,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: resume_module_default.summary,
						"aria-labelledby": "summary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "summary",
							className: resume_module_default.asideHeading,
							children: "Summary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: resume.summary })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: resume_module_default.main,
						children: resume.sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumeSection, { section }, section.heading))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: resume_module_default.aside,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Technologies, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Speaking, {})]
					})
				]
			})]
		})]
	});
}
function ResumeSection({ section }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: resume_module_default.section,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: resume_module_default.sectionHeading,
				children: section.heading
			}),
			section.entries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumeEntry, { entry }, entry.id)),
			section.more && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: resume_module_default.more,
				children: ["More at ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: section.more.href,
					children: section.more.label
				})]
			})
		]
	});
}
function ResumeEntry({ entry }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		id: entry.id,
		className: resume_module_default.entry,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: resume_module_default.entryHeader,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: resume_module_default.entryName,
					children: [entry.href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: entry.href,
						children: entry.name
					}) : entry.name, entry.private && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: resume_module_default.tag,
						children: "private"
					})]
				}), entry.dates && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: resume_module_default.dates,
					children: entry.dates
				})]
			}),
			entry.roles?.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: resume_module_default.role,
				children: role
			}, role)),
			entry.lead && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: resume_module_default.lead,
				children: inline(entry.lead)
			}),
			entry.groups?.map((group, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [group.heading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: resume_module_default.groupHeading,
				children: group.heading
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: resume_module_default.bullets,
				children: group.bullets.map((bullet) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: inline(bullet) }, bullet))
			})] }, group.heading ?? i)),
			entry.links && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: resume_module_default.entryLinks,
				children: entry.links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: link.href,
					children: link.label
				}, link.href))
			})
		]
	});
}
function Technologies() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: resume_module_default.asideSection,
		"aria-labelledby": "technologies",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			id: "technologies",
			className: resume_module_default.asideHeading,
			children: "Technologies"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
			className: resume_module_default.technologies,
			children: resume.technologies.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: resume_module_default.technology,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: resume_module_default.technologyName,
					children: group.category
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: resume_module_default.technologyItems,
					children: group.items.join(", ")
				})]
			}, group.category))
		})]
	});
}
function Speaking() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: resume_module_default.asideSection,
		"aria-labelledby": "speaking",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			id: "speaking",
			className: resume_module_default.asideHeading,
			children: "Speaking"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: resume_module_default.talks,
			children: resume.talks.map((talk) => {
				const { slides, recording } = talkLinks(talk.slugs);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: resume_module_default.talk,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: resume_module_default.talkTitle,
							children: talk.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: resume_module_default.talkEvents,
							children: talk.events
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: resume_module_default.talkLinks,
							children: [slides && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								href: slides,
								children: "Slides"
							}), recording && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: recording,
								children: "Recording"
							})]
						})
					]
				}, talk.title);
			})
		})]
	});
}
/** Renders `backtick` spans in resume copy as code. */
function inline(text) {
	return text.split("`").map((part, i) => i % 2 === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: part }, i) : part);
}
//#endregion
//#region renderer/MinimumPageShell.tsx
function MinimumPageShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.StrictMode, { children });
}
//#endregion
//#region pages/resume/+Layout.clear.tsx
var _Layout_clear_exports = /* @__PURE__ */ __exportAll({ default: () => Layout });
function Layout({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MinimumPageShell, { children });
}
//#endregion
//#region \0virtual:vike:page-entry:client:/pages/resume
var configValuesSerialized = {
	["hasServerOnlyHook"]: {
		type: "computed",
		definedAtData: null,
		valueSerialized: {
			type: "js-serialized",
			value: false
		}
	},
	["isClientRuntimeLoaded"]: {
		type: "computed",
		definedAtData: null,
		valueSerialized: {
			type: "js-serialized",
			value: true
		}
	},
	["onBeforeRenderEnv"]: {
		type: "computed",
		definedAtData: null,
		valueSerialized: {
			type: "js-serialized",
			value: null
		}
	},
	["dataEnv"]: {
		type: "computed",
		definedAtData: null,
		valueSerialized: {
			type: "js-serialized",
			value: null
		}
	},
	["guardEnv"]: {
		type: "computed",
		definedAtData: null,
		valueSerialized: {
			type: "js-serialized",
			value: null
		}
	},
	["onRenderClient"]: {
		type: "standard",
		definedAtData: {
			"filePathToShowToUser": "vike-react/__internal/integration/onRenderClient",
			"fileExportPathToShowToUser": []
		},
		valueSerialized: {
			type: "pointer-import",
			value: onRenderClient
		}
	},
	["Page"]: {
		type: "standard",
		definedAtData: {
			"filePathToShowToUser": "/pages/resume/+Page.tsx",
			"fileExportPathToShowToUser": []
		},
		valueSerialized: {
			type: "plus-file",
			exportValues: _Page_exports
		}
	},
	["hydrationCanBeAborted"]: {
		type: "standard",
		definedAtData: {
			"filePathToShowToUser": "vike-react/config",
			"fileExportPathToShowToUser": ["default", "hydrationCanBeAborted"]
		},
		valueSerialized: {
			type: "js-serialized",
			value: true
		}
	},
	["Layout"]: {
		type: "cumulative",
		definedAtData: [{
			"filePathToShowToUser": "/pages/resume/+Layout.clear.tsx",
			"fileExportPathToShowToUser": []
		}],
		valueSerialized: [{
			type: "plus-file",
			exportValues: _Layout_clear_exports
		}]
	},
	["title"]: {
		type: "standard",
		definedAtData: {
			"filePathToShowToUser": "/pages/resume/+config.ts",
			"fileExportPathToShowToUser": ["default", "title"]
		},
		valueSerialized: {
			type: "js-serialized",
			value: "Resume"
		}
	},
	["Loading"]: {
		type: "standard",
		definedAtData: {
			"filePathToShowToUser": "vike-react/__internal/integration/Loading",
			"fileExportPathToShowToUser": []
		},
		valueSerialized: {
			type: "pointer-import",
			value: Loading_default
		}
	}
};
//#endregion
export { configValuesSerialized };
