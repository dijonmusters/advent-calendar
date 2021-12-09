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
              className="bg-gray-200 p-4"
              target="_blank"
              rel="noopener noreferrer"
              href={door.content_url}
            >
              <img src={door.image_url} className="mb-4 max-h-32 w-full" />
              <h2 className="font-semibold mb-2 truncate" title={door.title}>
                {door.title}
              </h2>
              <p className="truncate" title={door.description}>
                {door.description}
              </p>
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
