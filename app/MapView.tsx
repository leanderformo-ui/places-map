// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  CircleMarker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

const defaultCenter: [number, number] = [59.9139, 10.7522]; // Oslo

type Place = {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  imageUrl?: string;
};

function ClickHandler(props: { onAdd: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      props.onAdd(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FocusListener() {
  const map = useMap();

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ lat: number; lng: number }>).detail;
      if (!detail) return;
      map.flyTo([detail.lat, detail.lng], 7, { duration: 0.7 });
    };

    window.addEventListener("focus-place", handler);
    return () => window.removeEventListener("focus-place", handler);
  }, [map]);

  return null;
}

export default function MapView() {
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

  const handleAddPlace = async (lat: number, lng: number) => {
    const name = prompt("Navn på sted?");
    if (!name) return;

    const description = prompt("Kort beskrivelse?") || "";
    const imageUrl = prompt("Lenke til bilde (valgfritt)") || "";

    await addDoc(collection(db, "places"), {
      name,
      description,
      lat,
      lng,
      imageUrl: imageUrl.trim() || null,
    });
  };

  return (
    <div style={{ width: "100%", height: "60vh" }}>
      <MapContainer
        center={defaultCenter}
        zoom={5}
        style={{ width: "100%", height: "100%", borderRadius: "16px" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ClickHandler onAdd={handleAddPlace} />
        <FocusListener />

        {places.map((p) => (
          <CircleMarker key={p.id} center={[p.lat, p.lng]} radius={8}>
            <Popup>
              <strong>{p.name}</strong>
              <br />
              {p.description}
              {p.imageUrl && (
                <div style={{ marginTop: "8px" }}>
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    style={{
                      maxWidth: "200px",
                      maxHeight: "150px",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
