"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import SubletFormPage from "../../[action]/page";

export default function EditSubletPage({ params }) {
  const router = useRouter();

  //const resolvedParams = use(params);

  params.action = 'edit';

  console.log(params);


  return <SubletFormPage params={params} />;
}
