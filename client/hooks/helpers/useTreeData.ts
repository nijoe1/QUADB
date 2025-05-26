import { useEffect } from "react";

export const useTreeData = (
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

import { useMutation } from "@tanstack/react-query";
import { constructObject } from "@/lib/tableland";

export const useFetchTreeData = (
  setCategoryOptions: any,
  setTreeData: any,
  setTempTreeData?: any
) => {
  const { mutate, error, isPending } = useMutation({
    mutationFn: constructObject, // Ensure this is a function that returns a promise
    onSuccess: (data: any) => {
      const categories = data.children.map(
        (childL: any) => childL.name.split(".")[0]
      );
      setCategoryOptions(
        categories.map((category: any) => ({
          value: category,
          label: category,
        }))
      );
      setTreeData(data);
      setTempTreeData(data);
    },
  });

  return { fetchTreeData: mutate, error, isPending };
};
