"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import SubletFormPage from "../../[action]/page";

export default function EditSubletPage({ params }) {
  params.action = 'edit';

  return <SubletFormPage params={params} />;
}
