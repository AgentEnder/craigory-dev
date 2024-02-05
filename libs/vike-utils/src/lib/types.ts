import type {
  PageContextServer as PageContextBuiltInServer,
  /*
  // When using Client Routing https://vike.dev/clientRouting
  PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient
  /*/
  // When using Server Routing
  PageContextClientWithServerRouting as PageContextBuiltInClient,
  //*/
} from 'vike/types';

type Page = (pageProps: PageProps) => React.ReactElement;

export type PageProps = Record<string, unknown>;

export type PageContextCustom = {
  Page: Page;
  pageProps?: PageProps;
  urlPathname: string;
  exports: {
    documentProps?: {
      title?: string;
      description?: string;
    };
  };
  urlParsed?: {
    origin: null | string;
    pathname: string;
    pathnameOriginal: string;
    search: Record<string, string>; // (AKA query parameters)
    searchAll: Record<string, string[]>;
    searchOriginal: null | string;
    hash: string;
    hashOriginal: null | string;
  };
};

export type PageContextServer = PageContextBuiltInServer<Page> &
  PageContextCustom;
export type PageContextClient = PageContextBuiltInClient<Page> &
  PageContextCustom;

export type PageContext = PageContextClient | PageContextServer;
