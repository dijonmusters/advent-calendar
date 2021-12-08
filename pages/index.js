import { supabaseClient } from "../utils/supabase";

const Home = ({ doors }) => {
  return (
    <>
      <h1 className="text-4xl">Doors</h1>
      <div className="my-6 grid grid-cols-4 gap-2">
        {doors.length > 0 ? (
          doors.map((door) => (
            <a
              key={door.id}
              className="bg-green-200 p-8"
              target="_blank"
              rel="noopener noreferrer"
              href={door.content_url}
            >
              {door.title}
            </a>
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
