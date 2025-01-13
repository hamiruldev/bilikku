'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import RoomForm from '../../RoomForm';

export default function RoomManagePage({ params }) {
  return <RoomForm action={params.action} />;
} 