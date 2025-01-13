'use client';

import { useRouter } from 'next/navigation';
import RoomForm from '../../RoomForm';

export default function EditRoomPage({ params }) {
  const router = useRouter();

  return <RoomForm action={params.id} />;
} 
