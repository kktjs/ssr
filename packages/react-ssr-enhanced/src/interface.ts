import { RouteObject, PathMatch } from 'react-router-dom';
import { RematchStore, Models } from "@rematch/core"
import express from 'express';
import React from "React"
import { HelmetData } from 'react-helmet';

export type ElementNewType = React.ReactNode & {
  load?: (v?: unknown) => Promise<void>;
  getInitialProps?: (v?: GetInitialProps) => Promise<void>;
  name?: string;
}

export interface RouteNewObject extends RouteObject {
  element?: ElementNewType;
  children?: RouteNewObject[]
  name?: string;
  load?: (v: GetInitialProps) => Promise<void>;
}


export interface RenderProps {
  store: RematchStore<Models<any>, any>;
  req: express.Request;
  res: express.Response;
  assets: Record<string, any>
  routes: RouteNewObject[]
  document?: React.FC<any> & {
    getInitialProps: (props: DocinitProps) => Promise<void>
  },
  customRenderer?: (element: React.ReactElement<any, string | React.JSXElementConstructor<any>>) => { html: string }
  [k: string]: any
}

export interface DocinitProps {
  store: RematchStore<Models<any>, any>,
  req: express.Request,
  res: express.Response,
  assets: Record<string, any>,
  data: unknown,
  renderPage: () => Promise<{ helmet: HelmetData, html: string }>,
  helmet: HelmetData,
  match: PathMatch<string> | null,
  [k: string]: unknown
}

export interface GetInitialProps {
  store: RematchStore<Models<any>, any>,
  req: express.Request,
  res: express.Response,
  match: PathMatch<string>,
  [k: string]: any
}