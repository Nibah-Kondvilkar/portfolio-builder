import { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function AddProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [github, setGithub] = useState("");
  const [live, setLive] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      alert("User not logged in");
      return;
    }

    try {
      await addDoc(
        collection(db, "users", user.uid, "projects"),
        {
          title,
          description,
          imageURL,
          github,
          live,
          createdAt: serverTimestamp(),
        }
      );

      alert("Project Added");

      setTitle("");
      setDescription("");
      setImageURL("");
      setGithub("");
      setLive("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      <input
        type="text"
        placeholder="Project Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border"
        required
      />

      <textarea
        placeholder="Project Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border"
        required
      />

      <input
        type="text"
        placeholder="Image URL"
        value={imageURL}
        onChange={(e) => setImageURL(e.target.value)}
        className="w-full p-2 border"
      />

      <input
        type="text"
        placeholder="GitHub Link"
        value={github}
        onChange={(e) => setGithub(e.target.value)}
        className="w-full p-2 border"
      />

      <input
        type="text"
        placeholder="Live Project Link"
        value={live}
        onChange={(e) => setLive(e.target.value)}
        className="w-full p-2 border"
      />

      <button className="bg-black text-white px-4 py-2">
        Add Project
      </button>
    </form>
  );
}

export default AddProject;