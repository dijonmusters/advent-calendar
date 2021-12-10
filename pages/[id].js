import { useState, useEffect } from "react";
import { supabaseClient } from "../utils/supabase";

const DoorDetails = ({ door }) => {
  const [likes, setLikes] = useState(door.likes);

  useEffect(() => {
    const subscription = supabaseClient
      .from(`doors:id=eq.${door.id}`)
      .on("UPDATE", (payload) => {
        setLikes(payload.new.likes);
      })
      .subscribe();

    return () => {
      supabaseClient.removeSubscription(subscription);
    };
  }, []);
  const addLike = async () => {
    await supabaseClient.rpc("increment_likes", {
      door_id: door.id,
    });
  };

  return (
    <>
      <h1>{door.title}</h1>
      <p>{door.description}</p>
      <button className="p-4 bg-gray-200" onClick={addLike}>
        💚 {likes} likes
      </button>
    </>
  );
};

export const getStaticPaths = async () => {
  const { data: doorIds } = await supabaseClient.from("doors").select("id");

  const paths = doorIds.map(({ id }) => ({
    params: {
      id: id.toString(),
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params: { id } }) => {
  const { data: door } = await supabaseClient
    .from("doors")
    .select(
      "id, title, description, content_url, image_url, opening_date, likes, authors(name, twitter_handle, website_url)"
    )
    .eq("id", id)
    .single();

  return {
    props: {
      door,
    },
  };
};

export default DoorDetails;
