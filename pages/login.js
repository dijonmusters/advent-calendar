import { Auth } from "@supabase/ui";
import { supabaseClient } from "../utils/supabase";

const Login = () => {
  const { user } = Auth.useUser();
  console.log({ user });
  return (
    <div className="max-w-xl mx-auto">
      <Auth providers={["github"]} supabaseClient={supabaseClient} />
    </div>
  );
};

export default Login;
