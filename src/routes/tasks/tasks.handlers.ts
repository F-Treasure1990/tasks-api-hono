import { eq } from "drizzle-orm";
import * as HTTPStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import db from "@/db";
import { tasks } from "@/db/schema";

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from "./tasks.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const tasks = await db.query.tasks.findMany();
  return c.json(tasks);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const task = c.req.valid("json");
  const [inserted] = await db.insert(tasks).values(task).returning();
  return c.json(inserted, HTTPStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const task = await db.query.tasks.findFirst({
    where(field, operators) {
      return operators.eq(field.id, id);
    },
  });

  if (!task) {
    return c.json({
      message: HttpStatusPhrases.NOT_FOUND,
    }, HTTPStatusCodes.NOT_FOUND);
  }

  return c.json(task, HTTPStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");
  const [task] = await db.update(tasks).set(updates).where(eq(tasks.id, id)).returning();

  if (!task) {
    return c.json({
      message: HttpStatusPhrases.NOT_FOUND,
    }, HTTPStatusCodes.NOT_FOUND);
  }

  return c.json(task, HTTPStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const result = await db.delete(tasks).where(eq(tasks.id, id));

  if (result.rowsAffected === 0) {
    return c.json({
      message: HttpStatusPhrases.NOT_FOUND,
    }, HTTPStatusCodes.NOT_FOUND);
  }

  return c.body(null, HTTPStatusCodes.NO_CONTENT);
};
