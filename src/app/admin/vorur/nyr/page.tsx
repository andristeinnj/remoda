import { ProductForm } from "@/components/admin/product-form";
import { saveNewProduct } from "@/app/admin/actions";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Ný vara</h1>
      <p className="text-sm text-muted-foreground">
        Skráðu nýja flík í verslunina.
      </p>
      <div className="mt-6">
        <ProductForm action={saveNewProduct} />
      </div>
    </div>
  );
}
