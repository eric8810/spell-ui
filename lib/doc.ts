import { basicDoc } from "@/basic-doc";
import { getRegistry } from "./registry";
import { DocItem, DocSchema, RegistryItem } from "./types";

const transformRegistryItemToDocItem = (item: RegistryItem): DocItem => {
  return {
    id: item.name,
    title: item.title,
    description: item.description,
    meta: item.meta,
  };
};

const filterRegistryItems = (items: RegistryItem[]) => {
  const componentItems = items.filter(
    (item) => item.type === "registry:component",
  );

  return {
    componentItems,
  };
};

export const getDocSchema = () => {
  const { items } = getRegistry();
  const { componentItems } = filterRegistryItems(items);

  const schema: DocSchema = [
    ...basicDoc,
    {
      title: "Components",
      items: componentItems.map(transformRegistryItemToDocItem),
    },
  ];

  return schema;
};

export const allDocItems = () => getDocSchema().flatMap((section) => section.items);

export const getDoc = (id: string) => allDocItems().find((item) => item.id === id);
