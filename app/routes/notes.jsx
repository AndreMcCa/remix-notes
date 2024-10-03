import { useLoaderData } from "@remix-run/react";
import { /* json, */ redirect } from "@remix-run/node";

import NewNote, { links as newNoteLinks } from "../components/NewNote/NewNote";
import NoteList, { links as noteListLinks } from "../components/NoteList/NoteList";

import { getStoredNotes, storeNotes } from "../data/notes";

export default function NotesPage() {
  const { notes } = useLoaderData();

  return (
    <main>
      <NewNote />
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
  noteData.id = new Date().toISOString();
  // Add validation ...

  const existingNotes = await getStoredNotes();
  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);
  return redirect("/notes");
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}
