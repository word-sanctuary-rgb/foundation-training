// ============================================================
// FILL THESE IN from your Supabase project:
// Project Settings > API > Project URL / anon public key
// ============================================================
const SUPABASE_URL = "https://rbmezbqszafllaabjmjt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibWV6YnFzemFmbGxhYWJqbWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzMTQzNzYsImV4cCI6MjEwMTg5MDM3Nn0.VFk8rcOPjympIi8QpjZqd6A8iN38-erUBAOvQtStkok";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Redirect to login if not authenticated. Call at top of protected pages.
async function requireAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = "login.html";
    return null;
  }
  return session;
}

// Get current user's profile row (includes role)
async function getProfile(userId) {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) console.error("getProfile error:", error);
  return data;
}

// Redirect non-admins away from admin pages
async function requireAdmin() {
  const session = await requireAuth();
  if (!session) return null;
  const profile = await getProfile(session.user.id);
  if (!profile || profile.role !== "admin") {
    alert("Admin access only.");
    window.location.href = "dashboard.html";
    return null;
  }
  return { session, profile };
}
