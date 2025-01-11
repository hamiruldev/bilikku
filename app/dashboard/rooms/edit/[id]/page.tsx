'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import RoomFormPage from '../../[action]/page';

interface EditRoomPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditRoomPage({ params }: EditRoomPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);

  return <RoomFormPage action={resolvedParams.id} />;
} 