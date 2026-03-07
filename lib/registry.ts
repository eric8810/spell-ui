import registryData from "@/registry.json";
import { Registry } from "./types";

export const getRegistry = (): Registry => registryData as Registry;

export const getRegistryItem = (name: string) =>
  getRegistry().items.find((item) => item.name === name);
