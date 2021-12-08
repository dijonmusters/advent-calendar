import { useEffect } from "react";
import "tailwindcss/tailwind.css";
import { supabaseClient } from "../utils/supabase";
import { Auth } from "@supabase/ui";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        console.log({ event, session });
        // Send session to /api/auth route to set the auth cookie.
        // NOTE: this is only needed if you're doing SSR (getServerSideProps)!

        fetch("/api/set-auth-cookie", {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify({ event, session }),
        }).then((res) => res.json());
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
  };

  return (
    <Auth.UserContextProvider supabaseClient={supabaseClient}>
      <div className="bg-gray-100 min-h-screen text-gray-800">
        <div className="max-w-6xl mx-auto py-16">
          {supabaseClient.auth.user() ? (
            <button onClick={handleSignOut}>Logout</button>
          ) : null}
          <Component {...pageProps} />
        </div>
      </div>
    </Auth.UserContextProvider>
  );
}

export default MyApp;
