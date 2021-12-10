import { useState } from "react";
import { supabaseClient } from "../utils/supabase";
import { Input, InputNumber, Select, Button } from "@supabase/ui";
import { useRouter } from "next/router";

const Admin = ({ user, authors }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const opening_date = new Date(
      Date.UTC(2021, 11, Number(formData.get("day")))
    ); // javascript! 🤦‍♀️
    const title = formData.get("title");
    const description = formData.get("description");
    const author_id = formData.get("author");
    const image_url = formData.get("image");
    const content_url = formData.get("content");

    const { data } = await supabaseClient.from("doors").insert([
      {
        title,
        description,
        opening_date,
        author_id,
        image_url,
        content_url,
      },
    ]);

    router.push("/");
  };

  const handleUpload = async (e) => {
    const bucketId = "frontdoors";
    const file = e.target.files[0];
    const filePath = `public/${file.name}`;
    setIsUploading(true);

    const { data } = await supabaseClient.storage
      .from(bucketId)
      .upload(filePath, file, {
        cacheControl: "60",
        upsert: true,
      });

    const { publicURL } = supabaseClient.storage
      .from(bucketId)
      .getPublicUrl(filePath);

    setImageUrl(publicURL);
    setIsUploading(false);
  };

  return (
    <>
      <h1 className="my-6 text-3xl">Admin - {user.email}</h1>
      <form onSubmit={handleSubmit}>
        <InputNumber label="Day" name="day" className="mb-4" required />
        <Input label="Title" name="title" className="mb-4" required />
        <Input.TextArea
          label="Description"
          name="description"
          className="mb-4"
          required
        />
        <Select label="Author" name="author" className="mb-4" required>
          {authors.map((author) => (
            <Select.Option key={author.id} value={author.id}>
              {author.name}
            </Select.Option>
          ))}
        </Select>
        <label
          htmlFor="file"
          className="block w-full bg-gray-200 p-8 text-center text-gray-700 my-8"
        >
          {!isUploading ? "Click to upload image!" : "Uploading..."}
        </label>
        <input
          type="file"
          name="file"
          id="file"
          onChange={handleUpload}
          multiple={false}
          className="hidden"
        />
        {imageUrl !== "" && (
          <img src={imageUrl} className="max-w-xl mx-auto mb-4 object-cover" />
        )}
        <input type="hidden" name="image" value={imageUrl} />
        <Input label="Content URL" name="content" className="mb-4" required />
        <Button disabled={isUploading}>Submit</Button>
      </form>
    </>
  );
};

export const getServerSideProps = async ({ req }) => {
  const { user } = await supabaseClient.auth.api.getUserByCookie(req);

  console.log({ user });

  if (!user) {
    // If no user, redirect to index.
    return { props: {}, redirect: { destination: "/login", permanent: false } };
  }

  if (user?.app_metadata?.role !== "admin") {
    return { props: {}, redirect: { destination: "/", permanent: false } };
  }

  const { data: authors } = await supabaseClient
    .from("authors")
    .select("id, name");

  return { props: { user, authors } };
};

export default Admin;
