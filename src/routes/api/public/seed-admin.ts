import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/seed-admin")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = request.headers.get("x-seed-secret");
        if (secret !== process.env["SEED_ADMIN_SECRET"]) {
          return new Response("Unauthorized", { status: 401 });
        }
        const { email, password } = (await request.json()) as {
          email: string;
          password: string;
        };
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });
        if (error) {
          return new Response(JSON.stringify({ error: error.message }), { status: 400 });
        }
        return new Response(JSON.stringify({ ok: true }));
      },
    },
  },
});
