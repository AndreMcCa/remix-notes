import NewNote, { links as newNoteLinks } from "../components/NewNote/NewNote";

export default function NotesPage() {
  return (
    <main>
      <NewNote />
    </main>
  );
}

export function links() {
  return [...newNoteLinks()];
}
