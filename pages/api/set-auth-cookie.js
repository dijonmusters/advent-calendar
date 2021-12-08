import { supabaseClient } from "../../utils/supabase";

const handler = async (req, res) => {
  supabaseClient.auth.api.setAuthCookie(req, res);
};

export default handler;
