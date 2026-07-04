import { getSupabase } from "@/lib/supabase";

export type AccountRole = "client" | "admin";

export type AccountSession = {
  role: AccountRole;
  mobile: string;
  fullName: string;
};

const ADMIN_PHONE = "0115683498";

type ClientAccountRow = {
  id: string;
  mobile: string;
  full_name: string;
  created_at: string;
  updated_at: string;
};

export async function loginAccount(mobile: string, role: AccountRole) {
  if (role === "admin") {
    if (mobile !== ADMIN_PHONE) {
      return {
        error: "Only the registered admin phone number can access admin.",
        status: 403,
      };
    }

    return {
      session: {
        role,
        mobile,
        fullName: "Admin",
      },
      status: 200,
    };
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("client_accounts")
    .select("*")
    .eq("mobile", mobile)
    .maybeSingle<ClientAccountRow>();

  if (error) {
    throw error;
  }

  if (!data) {
    return {
      error: "No account found for that phone number. Register to continue.",
      status: 404,
    };
  }

  return {
    session: {
      role,
      mobile: data.mobile,
      fullName: data.full_name,
    },
    status: 200,
  };
}

export async function registerAccount(
  mobile: string,
  fullName: string,
): Promise<{ session: AccountSession; status: number }> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("client_accounts")
    .upsert(
      {
        mobile,
        full_name: fullName,
      },
      { onConflict: "mobile" },
    )
    .select("*")
    .single<ClientAccountRow>();

  if (error) {
    throw error;
  }

  return {
    session: {
      role: "client",
      mobile: data.mobile,
      fullName: data.full_name,
    },
    status: 201,
  };
}
