import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/seed-admin")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (request.headers.get("x-seed-secret") !== "tmp-4f9a2c7e") {
          return new Response("Unauthorized", { status: 401 });
        }
        const { email, password, action } = (await request.json()) as {
          email: string;
          password?: string;
          action?: "create" | "delete";
        };
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        if (action === "delete") {
          const { data } = await supabaseAdmin.auth.admin.listUsers();
          const found = data?.users.find((u) => u.email === email);
          if (found) await supabaseAdmin.auth.admin.deleteUser(found.id);
          return new Response(JSON.stringify({ deleted: Boolean(found) }));
        }

        const { error } = await supabaseAdmin.auth.admin.createUser({
          email,
          password: password!,
          email_confirm: true,
        });
        if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
        return new Response(JSON.stringify({ ok: true }));
      },
    },
  },
});
