declare module '*.mdx' {
  let MDXComponent: (props: {
    components: Record<string, React.ComponentType>;
  }) => JSX.Element;
  export default MDXComponent;
}
