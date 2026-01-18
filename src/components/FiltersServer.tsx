import MultiSelect, { MultiSelectOption } from "./Multiselect/MultiSelect";

interface FiltersServerProps {
    products: MultiSelectOption[];
    categories: MultiSelectOption[];
    users: MultiSelectOption[];
    locations: MultiSelectOption[];
}

export default function FiltersServer({ products, categories, users, locations }: FiltersServerProps) {
    return (
        <div className="space-y-4 flex flex-col gap-4 sm:flex-row sm:gap-4 sm:flex-wrap">
            <MultiSelect label="Products" options={products} value={[]} onChange={() => { }} />
            <MultiSelect label="Categories" options={categories} value={[]} onChange={() => { }} />
            <MultiSelect label="Users" options={users} value={[]} onChange={() => { }} />
            <MultiSelect label="Locations" options={locations} value={[]} onChange={() => { }} />
        </div>
    );
}


{/*
    import FiltersServer from "@/components/FiltersServer";
import { prisma } from "@/lib/prisma";

export default async function ServerFiltersPage() {
  const products = await prisma.productList.findMany({ select: { id: true, name: true } });
  const categories = await prisma.productList.findMany({ select: { category: true }, distinct: ["category"] });
  const users = await prisma.user.findMany({ select: { id: true, fullName: true } });
  const locations = await prisma.location.findMany({ select: { id: true, name: true } });

  return (
    <FiltersServer
      products={products.map(p => ({ id: p.id, name: p.name }))}
      categories={categories.map(c => ({ id: c.category ?? "", name: c.category ?? "" }))}
      users={users.map(u => ({ id: u.id, name: u.fullName ?? "" }))}
      locations={locations.map(l => ({ id: l.id, name: l.name }))}
    />
  );
}
 */}