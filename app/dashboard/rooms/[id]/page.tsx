'use client';

import RoomForm from '../RoomForm';

interface EditRoomPageProps {
  params: {
    id: string;
  };
}

export default function EditRoomPage({ params }: EditRoomPageProps) {
  return <RoomForm roomId={params.id} />;
} 