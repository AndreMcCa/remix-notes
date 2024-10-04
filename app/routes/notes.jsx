import { Link, useActionData, useCatch, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

import NewNote, { links as newNoteLinks } from "../components/NewNote/NewNote";
import NoteList, { links as noteListLinks } from "../components/NoteList/NoteList";

import { getStoredNotes, storeNotes } from "../data/notes";

export default function NotesPage() {
  const { notes } = useLoaderData();
  const data = useActionData();

  return (
    <main>
      <NewNote error={data?.message} />
      <NoteList notes={notes} />
    </main>
  );
}

export function CatchBoundary() {
  const caughtResponse = useCatch(); // deprecated
  const message = caughtResponse.data?.message || "Data not found!";

  return (
    <main>
      <NewNote />
      <p className="info-message">{message}</p>
    </main>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <main className="error">
      <h1>An error related to your notes ocurred!</h1>
      <p>{error.message}</p>

      <p>
        Back to <Link to="/">safety</Link>!
      </p>
    </main>
  );
}

export async function loader() {
  const notes = await getStoredNotes();

  if (!notes || notes.length === 0) {
    throw json({ message: "Could not find any notes." }, { status: 404, statusText: "No found" });
  }

  return { notes };

  // return new Response(JSON.stringify(notes), {
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });

  // return json(notes);
}

export async function action(data) {
  const { request } = data;
  const formData = await request.formData();

  const noteData = Object.fromEntries(formData);

  if (noteData.title.trim().length < 5) {
    return { message: "Title must be at least 5 characters" };
  }

  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);

  // await new Promise((resolve) => setTimeout(resolve, 2000));

  return redirect("/notes");
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}

export function meta() {
  return {
    title: "Notes",
    description: "A simple note-taking app.",
  };
}
