import { useQuery } from "@tanstack/react-query";
import { getSpaces } from "@/lib/tableland"; // Ensure this is the correct import for your getSpaces function

const buildChildren = async (
  parentID: any,
  parentHierarchy: any,
  sampleSpacesData: any
) => {
  const children = [];
  const addedChildrenIDs = new Set(); // Track added children IDs

  for (const node of sampleSpacesData) {
    if (
      node.DBSubSpaceOfID.toLowerCase() === parentID.toLowerCase() &&
      !addedChildrenIDs.has(node.DBSpaceID) // Check if child is already added
    ) {
      const childHierarchy = parentHierarchy
        ? `${node.DBSubSpaceName}.${parentHierarchy}`
        : (node.DBSubSpaceName ?? "");
      const childChildren = await buildChildren(
        node.DBSpaceID,
        childHierarchy,
        sampleSpacesData ?? []
      );
      const nodeType = (childChildren.length ? "branch" : "leaf") as any;
      const childObject = {
        name: childHierarchy + ".quadb.fil",
        id: node.DBSpaceID,
        attributes: { nodeType: nodeType },
        children: childChildren,
      } as any;
      children.push(childObject);
      addedChildrenIDs.add(node.DBSpaceID); // Add child ID to the set
    }
  }
  return children;
};

export const useFetchRootObject = () => {
  return useQuery({
    queryKey: ["rootObject"], // Updated to use an array for the query key
    queryFn: async () => {
      const sampleSpacesData = await getSpaces();

      const rootObject = {
        name: "quadb.fil",
        id: "0x458944be4bb2e02ee48674d6dc056b51a852cdf857c2e5c624fb8d135879e28e",
        attributes: { nodeType: "root" },
        children: await buildChildren(
          "0x458944be4bb2e02ee48674d6dc056b51a852cdf857c2e5c624fb8d135879e28e",
          "",
          sampleSpacesData
        ),
      };
      return rootObject;
    },
  });
};

export default useFetchRootObject;
