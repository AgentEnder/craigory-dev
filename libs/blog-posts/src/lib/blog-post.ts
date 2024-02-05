import { JSX } from "react";

export interface BlogPost {
    publishDate: Date;
    mdx: (props: unknown) => JSX.Element;
    slug: string;
    title: string;
    description: string;
}