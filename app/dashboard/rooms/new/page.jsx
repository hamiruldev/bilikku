'use client';

import RoomForm from '../RoomForm';

export default function NewRoomPage({ params }) {
  params.action = 'new'
  return <RoomForm params={params} />;
} 