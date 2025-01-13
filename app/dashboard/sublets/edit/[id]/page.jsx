"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import SubletFormPage from "../../[action]/page";

export default function EditSubletPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);

  return <SubletFormPage action={resolvedParams.id} />;
}
