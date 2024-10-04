import { useActionData, useLoaderData } from "@remix-run/react";
import { /* json, */ redirect } from "@remix-run/node";

import NewNote, { links as newNoteLinks } from "../components/NewNote/NewNote";
import NoteList, { links as noteListLinks } from "../components/NoteList/NoteList";

import { getStoredNotes, storeNotes } from "../data/notes";

export default function NotesPage() {
  const { notes } = useLoaderData();
  const { message } = useActionData();

  return (
    <main>
      <NewNote error={message} />
      <NoteList notes={notes} />
    </main>
  );
}

export async function loader() {
  const notes = await getStoredNotes();
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
  // Add validation ...

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
