import { redirect } from "@remix-run/node";

import NewNote, { links as newNoteLinks } from "../components/NewNote/NewNote";

import { getStoredNotes, storeNotes } from "../data/notes";

export default function NotesPage() {
  return (
    <main>
      <NewNote />
    </main>
  );
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
  return [...newNoteLinks()];
}
