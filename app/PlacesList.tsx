"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";

type Place = {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  imageUrl?: string;
};

export default function PlacesList() {
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const ref = collection(db, "places");
    const unsub = onSnapshot(ref, (snapshot) => {
      const data: Place[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Place, "id">),
      }));
      setPlaces(data);
    });

    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "places", id));
  };

  if (places.length === 0) {
    return <p>Ingen steder enda ✨</p>;
  }

  return (
    <ul style={{ marginTop: "1rem", listStyle: "none", padding: 0 }}>
      {places.map((p) => (
        <li
          key={p.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.35rem",
            cursor: "pointer",
          }}
          onClick={() => {
            // si til kartet hvilket sted vi vil fokusere på
            window.dispatchEvent(
              new CustomEvent("focus-place", {
                detail: { lat: p.lat, lng: p.lng },
              })
            );
          }}
        >
          <span>
            <strong>{p.name}</strong>
            {p.description && <> – {p.description}</>}
            {p.imageUrl && <> 🖼️</>}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation(); // ikke zoom når vi bare skal slette
              handleDelete(p.id);
            }}
            style={{
              border: "none",
              background: "#ff4d4f",
              color: "white",
              borderRadius: "999px",
              width: "28px",
              height: "28px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            title="Slett sted"
          >
            X
          </button>
        </li>
      ))}
    </ul>
  );
}
