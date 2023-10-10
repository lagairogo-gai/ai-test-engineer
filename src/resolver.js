import Resolver from "@forge/resolver";
import { storage } from "@forge/api";

import { storageGetHelper } from "./helpers/storageHelper";

const resolver = new Resolver();
const getUniqueId = () => "_" + Math.random().toString(36).substr(2, 9);

const getListKeyFromContext = (context) => {
  const { localId: id } = context;
  return id.split("/")[id.split("/").length - 1];
};

// const getAll = async (listId) => {
//   return (
//     (await storage.get(listId)) || [
//       { label: "Check if button present", id: "22", isChecked: true },
//       { label: "Check if click happns", id: "d22", isChecked: false },
//     ]
//   );
// };

const getAll = async (listId, context) => {
  return (
    storageGetHelper(context.extension.issue.key) || [
      { label: "Check if button present", id: "22", isChecked: true },
      { label: "Check if click happns", id: "d22", isChecked: false },
    ]
  );
};

resolver.define("get-all", ({ context }) => {
  return getAll(getListKeyFromContext(context), context);
});

resolver.define("create", async ({ payload, context }) => {
  const listId = getListKeyFromContext(context);
  const records = await getAll(listId, context);
  const id = getUniqueId();
  const newRecord = {
    id,
    ...payload,
  };
  await storage.set(getListKeyFromContext(context), [...records, newRecord]);
  return newRecord;
});

resolver.define("update", async ({ payload, context }) => {
  const listId = getListKeyFromContext(context);
  let records = await getAll(listId, context);
  records = records.map((item) => {
    if (item.id === payload.id) {
      return payload;
    }
    return item;
  });
  await storage.set(getListKeyFromContext(context), records);
  return payload;
});

resolver.define("delete", async ({ payload, context }) => {
  const listId = getListKeyFromContext(context);
  let records = await getAll(listId, context);
  records = records.filter((item) => item.id !== payload.id);
  await storage.set(getListKeyFromContext(context), records);
  return payload;
});

resolver.define("delete-all", ({ context }) => {
  return storage.set(getListKeyFromContext(context), []);
});

export const handler = resolver.getDefinitions();
