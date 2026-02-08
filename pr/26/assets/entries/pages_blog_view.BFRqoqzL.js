import { j as jsxRuntimeExports, r as reactExports, u as usePageContext, i as import5, o as onRenderClient } from '../chunks/chunk-BiSMlUrc.js';
import { P as PostContext, g as getBlogUrl, s as slugMap } from '../chunks/chunk-BVSxiK3S.js';
import { C as ContentMarker } from '../chunks/chunk-bNc2JGQN.js';
import { L as Link, i as import3 } from '../chunks/chunk-Cj1Pzm3x.js';
import { f as format } from '../chunks/chunk-DI4sGg5h.js';
/* empty css                       */
import '../chunks/chunk-C_jR_L7K.js';
/* empty css                       */

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/components/code-wrapper.module.scss [vike:pluginModuleBanner] */
const filename = "_filename_1uasc_35";
const styles = {
	"code-wrapper": "_code-wrapper_1uasc_1",
	"has-filename": "_has-filename_1uasc_21",
	"code-tabs": "_code-tabs_1uasc_25",
	filename: filename
};

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/components/code-wrapper.tsx [vike:pluginModuleBanner] */
function CodeWrapper({
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column"
      },
      children: [
        props.filename ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles["code-tabs"], children: props.filename ? /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: styles["filename"], children: props.filename }) : null }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "pre",
          {
            style: {
              marginTop: 0
            },
            className: [
              styles["code-wrapper"],
              props.filename ? styles["has-filename"] : ""
            ].join(" "),
            children
          }
        )
      ]
    }
  );
}

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/components/link-to-post.tsx [vike:pluginModuleBanner] */
function LinkToPost({
  slug,
  ref,
  title
}) {
  const referringBlogPost = reactExports.useContext(PostContext);
  ref ??= (() => {
    if (referringBlogPost) {
      return getBlogUrl(referringBlogPost);
    }
    return void 0;
  })();
  const post = slugMap[slug];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "a",
    {
      href: `${getBlogUrl(post)}${ref ? `?ref=${ref}` : ""}`,
      className: "text-blue-600 hover:underline",
      children: title ?? post.title
    }
  );
}

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/components/tiki-table.module.scss [vike:pluginModuleBanner] */
const tableContainer = "_tableContainer_1eo92_2";
const tikiTable = "_tikiTable_1eo92_9";
const sortable = "_sortable_1eo92_67";
const barName = "_barName_1eo92_76";
const starRating = "_starRating_1eo92_97";
const stars = "_stars_1eo92_104";
const star = "_star_1eo92_97";
const halfStar = "_halfStar_1eo92_115";
const emptyStar = "_emptyStar_1eo92_130";
const ratingValue = "_ratingValue_1eo92_135";
const na = "_na_1eo92_141";
const mapLink = "_mapLink_1eo92_153";
const ratingColumn = "_ratingColumn_1eo92_185";
const classes = {
	tableContainer: tableContainer,
	tikiTable: tikiTable,
	sortable: sortable,
	barName: barName,
	starRating: starRating,
	stars: stars,
	star: star,
	halfStar: halfStar,
	emptyStar: emptyStar,
	ratingValue: ratingValue,
	na: na,
	mapLink: mapLink,
	ratingColumn: ratingColumn
};

/*! /home/runner/work/craigory-dev/craigory-dev/libs/blog-posts/src/lib/components/tiki-table.tsx [vike:pluginModuleBanner] */
const DATA = [
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
function StarRating({
  rating,
  maxRating = 5
}) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: classes["star"], children: "★" }, `full-${i}`)
    );
  }
  if (hasHalfStar && fullStars < maxRating) {
    stars.push(
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: classes["halfStar"], children: "★" }, "half")
    );
  }
  const emptyStars = maxRating - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: classes["emptyStar"], children: "☆" }, `empty-${i}`)
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: classes["starRating"], children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: classes["stars"], children: stars }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: classes["ratingValue"], children: rating.toFixed(1) })
  ] });
}
function TikiTable({ ratings }) {
  const [sortKey, setSortKey] = reactExports.useState("overall");
  const [sortDirection, setSortDirection] = reactExports.useState("desc");
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };
  const sortedRatings = reactExports.useMemo(() => {
    const sorted = [...ratings ?? DATA].sort((a, b) => {
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
    return sorted;
  }, [ratings, sortKey, sortDirection]);
  const getSortIcon = (key) => {
    if (sortKey !== key) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: classes["tableContainer"], children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: classes["tikiTable"], children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "th",
        {
          onClick: () => handleSort("bar"),
          className: classes["sortable"],
          children: [
            "Bar Name ",
            getSortIcon("bar")
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "th",
        {
          onClick: () => handleSort("location"),
          className: classes["sortable"],
          children: [
            "Location ",
            getSortIcon("location")
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "th",
        {
          onClick: () => handleSort("overall"),
          className: classes["sortable"],
          children: [
            "Overall ",
            getSortIcon("overall")
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "th",
        {
          onClick: () => handleSort("food"),
          className: classes["sortable"],
          children: [
            "Food ",
            getSortIcon("food")
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "th",
        {
          onClick: () => handleSort("drinks"),
          className: classes["sortable"],
          children: [
            "Drinks ",
            getSortIcon("drinks")
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "th",
        {
          onClick: () => handleSort("decor"),
          className: classes["sortable"],
          children: [
            "Decor ",
            getSortIcon("decor")
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sortedRatings.map((rating, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: classes["barName"], children: rating.blogSlug ? /* @__PURE__ */ jsxRuntimeExports.jsx(LinkToPost, { slug: rating.blogSlug, title: rating.bar }) : rating.bar }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: rating.googleMapsLink ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: rating.googleMapsLink,
          target: "_blank",
          rel: "noopener noreferrer",
          className: classes["mapLink"],
          children: rating.location
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: classes["na"], children: rating.location }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RatingCell, { rating: rating.overall }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RatingCell, { rating: rating.food }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RatingCell, { rating: rating.drinks }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RatingCell, { rating: rating.decor })
    ] }, `${rating.bar}-${index}`)) })
  ] }) });
}
function RatingCell({ rating }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: classes["ratingColumn"], children: rating === void 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: classes["na"], children: "N/A" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(StarRating, { rating }) });
}

/*! pages/blog/view/view.page.scss [vike:pluginModuleBanner] */

/*! pages/blog/view/BlogPostEnhanced.tsx [vike:pluginModuleBanner] */
function BlogPostEnhanced({ children }) {
  const [progress, setProgress] = reactExports.useState(0);
  const [showScrollTop, setShowScrollTop] = reactExports.useState(false);
  const [toc, setToc] = reactExports.useState([]);
  const [activeHeading, setActiveHeading] = reactExports.useState("");
  const contentRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const progress2 = scrollPosition / scrollHeight * 100;
      setProgress(Math.min(100, Math.max(0, progress2)));
      setShowScrollTop(scrollPosition > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  reactExports.useEffect(() => {
    if (contentRef.current) {
      const headings = contentRef.current.querySelectorAll("h2, h3, h4");
      const tocItems = [];
      headings.forEach((heading) => {
        const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, "-") || "";
        if (!heading.id) {
          heading.id = id;
        }
        const headingClone = heading.cloneNode(true);
        const hashLink = headingClone.querySelector(".heading-link");
        if (hashLink) {
          hashLink.remove();
        }
        const cleanText = headingClone.textContent?.trim() || "";
        tocItems.push({
          id,
          text: cleanText,
          level: parseInt(heading.tagName[1])
        });
      });
      setToc(tocItems);
    }
  }, [children]);
  reactExports.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );
    const headings = contentRef.current?.querySelectorAll("h2, h3, h4");
    headings?.forEach((heading) => observer.observe(heading));
    return () => {
      headings?.forEach((heading) => observer.unobserve(heading));
    };
  }, [toc]);
  reactExports.useEffect(() => {
    const codeBlocks = contentRef.current?.querySelectorAll("pre code");
    codeBlocks?.forEach((block) => {
      const pre = block.parentElement;
      if (!pre) return;
      if (pre.querySelector(".copy-button")) return;
      const button = document.createElement("button");
      button.className = "copy-button";
      button.textContent = "Copy";
      button.addEventListener("click", () => {
        const text = block.textContent || "";
        navigator.clipboard.writeText(text).then(() => {
          button.textContent = "Copied!";
          button.classList.add("copied");
          setTimeout(() => {
            button.textContent = "Copy";
            button.classList.remove("copied");
          }, 2e3);
        });
      });
      pre.appendChild(button);
    });
  }, [children]);
  const scrollToTop = reactExports.useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "reading-progress",
        style: { transform: `scaleX(${progress / 100})` }
      }
    ),
    toc.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "toc-container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Table of Contents" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: toc.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { style: { marginLeft: `${(item.level - 2) * 1}rem` }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: `#${item.id}`,
          className: activeHeading === item.id ? "active" : "",
          onClick: (e) => {
            e.preventDefault();
            document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
          },
          children: item.text
        }
      ) }, item.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "blog-post-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "blog-content", ref: contentRef, children }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: `scroll-to-top ${showScrollTop ? "visible" : ""}`,
        onClick: scrollToTop,
        "aria-label": "Scroll to top",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18 15l-6-6-6 6" }) })
      }
    )
  ] });
}

/*! pages/blog/view/BlogH1.tsx [vike:pluginModuleBanner] */
function BlogH1({ children }) {
  const post = reactExports.useContext(PostContext);
  const headerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (headerRef.current) {
      headerRef.current.classList.add("blog-header");
    }
  }, []);
  if (!post) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { ref: headerRef, className: "blog-header", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "meta-info", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "publish-date", children: format(post.publishDate, "MMMM dd, yyyy") }),
      post.readingTimeMinutes && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "reading-time", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { role: "img", "aria-label": "reading time", children: "📖" }),
        " ",
        post.readingTimeMinutes,
        " min read"
      ] })
    ] })
  ] });
}

/*! src/utils/post-theming.ts [vike:pluginModuleBanner] */
function getPostThemeClass(post) {
  if (post.tags.includes("tiki")) return "theme-tiki";
  if (post.tags.includes("technical")) return "theme-technical";
  if (post.tags.includes("review")) return "theme-review";
  return "theme-default";
}

/*! pages/blog/view/+Page.tsx [vike:pluginModuleBanner] */
function Page() {
  const pageContext = usePageContext();
  const hookData = pageContext.data;
  const { readingTimeMinutes } = hookData || {};
  const blogPost = pageContext.routeParams?.slug;
  const [returnLink, setReturnLink] = reactExports.useState();
  reactExports.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setReturnLink(ref);
    }
  }, []);
  if (!blogPost) {
    throw new Error();
  }
  const basePost = slugMap[blogPost];
  const postData = readingTimeMinutes ? { ...basePost, readingTimeMinutes } : basePost;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    returnLink ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "return-link-top", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { href: returnLink, children: "← Return to previous page" }) }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx(PostContext.Provider, { value: postData, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `blog-post-theme ${getPostThemeClass(postData)}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BlogPostEnhanced, { children: postData.mdx({
      components: {
        h1: BlogH1,
        pre: CodeWrapper,
        Anchor: ContentMarker,
        LinkToPost,
        TikiTable
      }
    }) }) }) }),
    returnLink ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "return-link-bottom", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { href: returnLink, children: "← Return to previous page" }) }) : null
  ] });
}

const import2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Page
}, Symbol.toStringTag, { value: 'Module' }));

/*! pages/blog/view/+title.ts [vike:pluginModuleBanner] */
const _title = (pageContext) => {
  const blogPost = slugMap[pageContext.routeParams?.slug];
  return blogPost.title;
};

const import4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _title
}, Symbol.toStringTag, { value: 'Module' }));

/*! virtual:vike:page-entry:client:/pages/blog/view [vike:pluginModuleBanner] */
const configValuesSerialized = {
  ["serverOnlyHooks"]: {
    type: "computed",
    definedAtData: null,
    valueSerialized: {
      type: "js-serialized",
      value: true,
    },
  },
  ["isClientRuntimeLoaded"]: {
    type: "computed",
    definedAtData: null,
    valueSerialized: {
      type: "js-serialized",
      value: true,
    },
  },
  ["onBeforeRenderEnv"]: {
    type: "computed",
    definedAtData: null,
    valueSerialized: {
      type: "js-serialized",
      value: null,
    },
  },
  ["dataEnv"]: {
    type: "computed",
    definedAtData: null,
    valueSerialized: {
      type: "js-serialized",
      value: {"server":true},
    },
  },
  ["onRenderClient"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"vike-react/__internal/integration/onRenderClient","fileExportPathToShowToUser":[]},
    valueSerialized: {
      type: "pointer-import",
      value: onRenderClient,
    },
  },
  ["Page"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"/pages/blog/view/+Page.tsx","fileExportPathToShowToUser":[]},
    valueSerialized: {
      type: "plus-file",
      exportValues: import2,
    },
  },
  ["hydrationCanBeAborted"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"vike-react/config","fileExportPathToShowToUser":["default","hydrationCanBeAborted"]},
    valueSerialized: {
      type: "js-serialized",
      value: true,
    },
  },
  ["Layout"]: {
    type: "cumulative",
    definedAtData: [{"filePathToShowToUser":"/renderer/+Layout.tsx","fileExportPathToShowToUser":[]}],
    valueSerialized: [ {
      type: "plus-file",
      exportValues: import3,
    }, ],
  },
  ["title"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"/pages/blog/view/+title.ts","fileExportPathToShowToUser":[]},
    valueSerialized: {
      type: "plus-file",
      exportValues: import4,
    },
  },
  ["Loading"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"vike-react/__internal/integration/Loading","fileExportPathToShowToUser":[]},
    valueSerialized: {
      type: "pointer-import",
      value: import5,
    },
  },
};

export { configValuesSerialized };
