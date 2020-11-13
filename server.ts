import { oak, oakHelpers as oakH } from "./deps.ts";
import * as mod from "./mod.ts";

/* Identify the parameters to be passed into the httpServiceRouter */
export function httpServiceRouter(
  options?: mod.offerProfile.lf.OfferingProfileLhcForm,
): oak.Router {
  const router = new oak.Router();
  /* Currently we have a post method to the 
   * url http://localhost:8159/offering-profile/inspect/lform 
   * where we give the lhc form json as input 
   */
  router
    .get("/", (ctx) => {
      ctx.response.body = "Medigy Governance Controller";
    })
    .post("/offering-profile/inspect/lform", async (ctx) => {
      const input = ctx.request.body({ type: "reader" });
      try {
        const content = JSON.parse(
          new TextDecoder().decode(await Deno.readAll(input.value)),
        );
        const lform = content as mod.offerProfile.lf.OfferingProfileLhcForm;
        const inspector = new mod.offerProfile.lf.OfferingProfileValidator();
        const diags = await inspector.inspect(lform);
        ctx.response.body = inspector.inspectionDiagnosticsJSON
          ? inspector.inspectionDiagnosticsJSON(diags)
          : JSON.stringify(diags, undefined, 2);
      } catch (err) {
        console.error(err);
      }
    });
  return router;
}

export function httpServer(
  options: {
    router: oak.Router;
    port: number;
    mwOptions?: oakH.TypicalMiddlewareOptions;
  },
): oak.Application {
  const app = new oak.Application();
  app.addEventListener("listen", (event) => {
    console.log(
      `Medigy Governance service listening on http://${event.hostname ||
        "localhost"}:${event.port}`,
    );
  });
  oakH.registerTypicalMiddleware(
    app,
    options.mwOptions || { accessReporter: oakH.defaultAccessReporter },
  );
  app.use(options.router.routes());
  app.use(options.router.allowedMethods());
  return app;
}
