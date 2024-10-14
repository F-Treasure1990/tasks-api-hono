import { createRoute, z } from "@hono/zod-openapi";
import * as HTTPStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentOneOf, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { insertTasksSchema, patchTaskSchema, selectTasksSchema } from "@/db/schema";
import { notFoundSchema } from "@/lib/constants";

export const list = createRoute({
  path: "/tasks",
  method: "get",
  tags: ["tasks"],
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      z.array(selectTasksSchema),
      "The list of tasks",
    ),
  },
});

export const create = createRoute({
  path: "/tasks",
  method: "post",
  request: {
    body: jsonContentRequired(insertTasksSchema, "The created task"),
  },
  tags: ["tasks"],
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      selectTasksSchema,
      "The created Task",
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertTasksSchema),
      "The Validation error(s)",
    ),
  },
});

export const getOne = createRoute({
  path: "/tasks/{id}",
  method: "get",
  tags: ["tasks"],
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      selectTasksSchema,
      "the requested task",
    ),
    [HTTPStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Task not found",
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),

  },
});

export const patch = createRoute({
  path: "/tasks/{id}",
  method: "patch",
  tags: ["tasks"],
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(patchTaskSchema, "The task updates"),
  },
  responses: {
    [HTTPStatusCodes.OK]: jsonContent(
      patchTaskSchema,
      "The updated Task",
    ),
    [HTTPStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Task not found",
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(patchTaskSchema).or(createErrorSchema(IdParamsSchema)),
      "The Validation error(s)",
    ),
  },
});

export const remove = createRoute({
  path: "/tasks/{id}",
  method: "delete",
  tags: ["tasks"],
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HTTPStatusCodes.NO_CONTENT]: { description: "Task deleted" },
    [HTTPStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Task not found",
    ),
    [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
