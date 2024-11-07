import { useQuery } from "@tanstack/react-query";

const fetchHealth = async () => {
  const response = await fetch("/api/health");
  return await response.json();
};

export const useHealth = () => {
  return useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
  });
};
