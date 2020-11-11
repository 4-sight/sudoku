export * from "./puzzles"

export type GraphQLData = { [x: string]: any }
export type PageContext = {
  isCreatedByStatefulCreatePages: boolean
  [x: string]: any
}

export interface TemplateProps {
  path: string
  navigate: (to: string, options: { [x: string]: any }) => void
  location: {
    href: string
    ancestorOrigins: DOMStringList
    origin: string
    protocol: string
    host: string
    hostname: string
    port: string
    pathname: string
    search: string
    hash: string
    assign: Function
    reload: Function
    toString: Function
    replace: Function
    state: null | { [x: string]: any }
    key: string
  }
  pageResources: {
    component: Function
    json: {
      data: GraphQLData
      pageContext: PageContext
    }
    page: {
      componentChunkName: string
      path: string
      webpackCompilationHash: string
      matchPath: unknown
    }
  }
  uri: string
  children: unknown
  data: GraphQLData
  pageContext: PageContext
  pathContext: PageContext
}
