import { supabaseClient } from "../utils/supabase";
import Link from "next/link";

const Home = ({ doors }) => {
  return (
    <>
      <h1 className="text-4xl">Doors</h1>
      <div className="my-6 grid grid-cols-4 gap-2">
        {doors.length > 0 ? (
          doors.map((door) => (
            <Link key={door.id} href={`/${door.id}`}>
              <a className="bg-gray-200 p-4">
                <img
                  src={door.image_url}
                  className="mb-4 max-h-32 w-full object-cover"
                />
                <h2 className="font-semibold mb-2 truncate" title={door.title}>
                  {door.title}
                </h2>
                <p className="truncate" title={door.description}>
                  {door.description}
                </p>
              </a>
            </Link>
          ))
        ) : (
          <p>No doors available</p>
        )}
      </div>
    </>
  );
};

export const getStaticProps = async () => {
  const { data: doors } = await supabaseClient
    .from("doors")
    .select(
      "id, title, description, content_url, image_url, opening_date, authors(name, twitter_handle, website_url)"
    );

  return {
    props: {
      doors,
    },
    revalidate: 3600, // every hour
  };
};

export default Home;
