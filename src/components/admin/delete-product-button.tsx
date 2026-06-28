"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/app/admin/actions";

export function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  async function onDelete() {
    if (!confirm("Eyða þessari vöru? Þetta er ekki hægt að afturkalla.")) return;
    setPending(true);
    await deleteProduct(id);
    router.push("/admin");
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" onClick={onDelete} disabled={pending}>
      <Trash2 className="size-4" /> Eyða
    </Button>
  );
}
