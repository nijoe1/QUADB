import { useMutation } from "@tanstack/react-query";
import { constructObject } from "@/lib/tableland";

const useFetchTreeData = (setCategoryOptions, setTreeData, setTempTreeData) => {
  const { mutate, isLoading, error } = useMutation({
    mutationFn: constructObject, // Ensure this is a function that returns a promise
    onSuccess: (data) => {
      const categories = data.children.map(
        (child) => child.name.split(".")[0]
      );
      setCategoryOptions(
        categories.map((category) => ({ value: category, label: category }))
      );
      setTreeData(data);
      setTempTreeData(data);
    },
  });

  return { fetchTreeData: mutate, isLoading, error };
};

export default useFetchTreeData;