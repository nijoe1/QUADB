import { useEffect } from "react";

const useTreeData = (
  fetchTreeData: any,
  selectedCategory: any,
  tempTreeData: any,
  setTreeData: any
) => {
  useEffect(() => {
    fetchTreeData();
  }, [fetchTreeData]);

  useEffect(() => {
    if (selectedCategory && tempTreeData) {
      const categoryNode = { ...tempTreeData };
      categoryNode.children = categoryNode.children.filter(
        (child: any) => child.name.split(".")[0] === selectedCategory
      );
      setTreeData(categoryNode);
    }
  }, [selectedCategory, tempTreeData, setTreeData]);
};

export default useTreeData;
