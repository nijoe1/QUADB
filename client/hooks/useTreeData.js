import { useEffect } from "react";

const useTreeData = (fetchTreeData, selectedCategory, tempTreeData, setTreeData) => {
  useEffect(() => {
    fetchTreeData();
  }, [fetchTreeData]);

  useEffect(() => {
    if (selectedCategory && tempTreeData) {
      const categoryNode = { ...tempTreeData };
      categoryNode.children = categoryNode.children.filter(
        (child) => child.name.split(".")[0] === selectedCategory
      );
      setTreeData(categoryNode);
    }
  }, [selectedCategory, tempTreeData, setTreeData]);
};

export default useTreeData;