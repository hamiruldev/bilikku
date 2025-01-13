'use client';

import RoomForm from '../RoomForm';

export default function EditRoomPage({ params }) {
  return <RoomForm roomId={params.id} />;
} 