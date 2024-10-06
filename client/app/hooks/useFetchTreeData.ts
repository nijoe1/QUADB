import { useMutation } from "@tanstack/react-query";
import { constructObject } from "@/app/lib/tableland";

const useFetchTreeData = (
  setCategoryOptions: any,
  setTreeData: any,
  setTempTreeData: any
) => {
  const { mutate, error } = useMutation({
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

  return { fetchTreeData: mutate, error };
};

export default useFetchTreeData;
