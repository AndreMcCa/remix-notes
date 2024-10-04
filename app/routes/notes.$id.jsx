import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import { getStoredNotes } from "../data/notes";

import styles from "../styles/note-details.css";

export default function NoteDetailsPage() {
  const note = useLoaderData();

  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">Back to all notes</Link>
        </nav>
        <h1>{note.title}</h1>
      </header>
      <p id="note-details-content">{note.content}</p>
    </main>
  );
}

export async function loader({ params }) {
  const notes = await getStoredNotes();
  const selectedNote = notes.find((note) => note.id === params.id);

  if (!selectedNote) {
    throw json({ message: `Could not find note for id: ${params.id}.` }, { status: 404 });
  }

  return selectedNote;
}

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export function meta({ data }) {
  return {
    title: data.title,
    description: data.content,
  };
}
