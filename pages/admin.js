import { supabaseClient } from "../utils/supabase";
import { Input, InputNumber, Select, Button } from "@supabase/ui";

const Admin = ({ user, authors }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const opening_date = new Date(2021, 11, formData.get("day"));
    const title = formData.get("title");
    const description = formData.get("description");
    const author_id = formData.get("author");
    const image_url = formData.get("image");
    const content_url = formData.get("content");

    const { data, error } = await supabaseClient.from("doors").insert([
      {
        title,
        description,
        opening_date,
        author_id,
        image_url,
        content_url,
      },
    ]);

    console.log({ data, error });
  };

  return (
    <>
      <h1 className="my-6 text-3xl">Admin - {user.email}</h1>
      <form onSubmit={handleSubmit}>
        <InputNumber label="Day" name="day" />
        <Input label="Title" name="title" />
        <Input.TextArea label="Description" name="description" />
        <Select label="Author" name="author">
          {authors.map((author) => (
            <Select.Option key={author.id} value={author.id}>
              {author.name}
            </Select.Option>
          ))}
        </Select>
        <Input label="Image URL" name="image" />
        <Input label="Content URL" name="content" />
        <Button>Submit</Button>
      </form>
    </>
  );
};

export const getServerSideProps = async ({ req }) => {
  const { user } = await supabaseClient.auth.api.getUserByCookie(req);

  if (!user) {
    // If no user, redirect to index.
    return { props: {}, redirect: { destination: "/login", permanent: false } };
  }

  const { data: authors } = await supabaseClient
    .from("authors")
    .select("id, name");

  return { props: { user, authors } };
};

export default Admin;
