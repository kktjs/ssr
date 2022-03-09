import { RouteObject } from 'react-router-dom';
import { RematchStore, Models } from "@rematch/core"
import express from 'express';
import React from "React"

export type ElementNewType = React.ReactNode & {
  load?: (v?: unknown) => Promise<void>;
  getInitialProps?: (v?: unknown) => Promise<void>;
  $$typeof?: any;
  name?: string
}

export interface RouteNewObject extends RouteObject {
  element?: ElementNewType;
  children?: RouteNewObject[]
  name?: string;
  load?: (v?: unknown) => Promise<void>;
}

export interface RenderProps {
  store: RematchStore<Models<any>, any>;
  req: express.Request;
  res: express.Response;
  assets: Record<string, any>
  routes: RouteNewObject[]
  [k: string]: any
}