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
        name: childHierarchy + ".quadb.eth",
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
        name: "quadb.eth",
        id: "0x1347af471e551e181d2bd1085b73bc585a504cc56c485cf21ab9fcae63880fbf",
        attributes: { nodeType: "root" },
        children: await buildChildren(
          "0x1347af471e551e181d2bd1085b73bc585a504cc56c485cf21ab9fcae63880fbf",
          "",
          sampleSpacesData
        ),
      };
      return rootObject;
    },
  });
};

export default useFetchRootObject;
