import { Kbd } from "@/registry/spell-ui/kbd";

export function Demo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Kbd keys={["command"]} listenToKeyboard />
      <Kbd keys={["control"]} listenToKeyboard />
      <Kbd keys={["alt"]} listenToKeyboard />
      <Kbd keys={["up"]} listenToKeyboard />
      <Kbd keys={["down"]} listenToKeyboard />
      <Kbd keys={["left"]} listenToKeyboard />
      <Kbd keys={["right"]} listenToKeyboard />
    </div>
  );
}
