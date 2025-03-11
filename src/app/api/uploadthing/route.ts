import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

export const config = {
  runtime: "nodejs",
};

//  Export  routes for next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
