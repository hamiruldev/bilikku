"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import SubletFormPage from "../../[action]/page";

interface EditSubletPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditSubletPage({ params }: EditSubletPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);

  return <SubletFormPage action={resolvedParams.id} />;
}
