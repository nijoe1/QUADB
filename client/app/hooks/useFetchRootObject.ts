import { useQuery } from "@tanstack/react-query";
import { getSpaces } from "@/app/lib/tableland"; // Ensure this is the correct import for your getSpaces function

const buildChildren = async (
  parentID: any,
  parentHierarchy: any,
  sampleSpacesData: any
) => {
  const children = [];
  sampleSpacesData = sampleSpacesData ? sampleSpacesData : [];
  for (const node of sampleSpacesData) {
    if (node.DBSubSpaceOfID.toLowerCase() === parentID.toLowerCase()) {
      const childHierarchy = parentHierarchy
        ? `${node.DBSubSpaceName}.${parentHierarchy}`
        : node.DBSubSpaceName;
      const childChildren = await buildChildren(
        node.DBSpaceID,
        childHierarchy,
        sampleSpacesData
      );
      const nodeType = (childChildren.length ? "branch" : "leaf") as any;
      const childObject = {
        name: childHierarchy + ".quadb.fil",
        id: node.DBSpaceID,
        attributes: { nodeType: nodeType },
        children: childChildren,
      } as any;
      children.push(childObject);
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
        id: "0x3991c990740f74d9d194f79fecfb031206f5f8c77698f634d04f484f2904016e",
        attributes: { nodeType: "root" },
        children: await buildChildren(
          "0x3991c990740f74d9d194f79fecfb031206f5f8c77698f634d04f484f2904016e",
          "",
          sampleSpacesData
        ),
      };
      return rootObject;
    },
  });
};

export default useFetchRootObject;
