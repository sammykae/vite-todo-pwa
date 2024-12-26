import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

type CallType = "create" | "update" | "delete" | "patch" | "get";

export type DataType = {
  title?: string;
  category?: string | null;
  desc?: string;
  completed?: boolean;
  _id?: string;
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

const apiCall = async (type: CallType, data?: DataType) => {
  switch (type) {
    case "create":
      return (await axios.post(`${BASE_URL}`, data)).data;

    case "update":
      return (await axios.put(`${BASE_URL}/${data?._id}`, data)).data;

    case "patch":
      return (await axios.patch(`${BASE_URL}/${data?._id}`)).data;

    case "delete":
      return (await axios.delete(`${BASE_URL}/${data?._id}`)).data;

    case "get":
      return (await axios.get(`${BASE_URL}`)).data;
  }
};
const checkOnline = () => {
  if (!navigator.onLine) {
    toast.info(
      "You are offline. The data is saved and we will send it when you get back online"
    );
  }
};
export const useGetTodos = () =>
  useQuery({ queryKey: ["todos"], queryFn: async () => apiCall("get") });

export const useCreateTodo = (successAction: VoidFunction) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: DataType) => await apiCall("create", data),
    onSuccess: (res) => {
      toast.success(res.message);
      successAction();
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (err) => {
      checkOnline();
      console.log(err);
    },
  });
};

export const useUpdateTodo = (successAction: VoidFunction) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: DataType) => await apiCall("update", data),
    onSuccess: (res) => {
      toast.success(res.message);
      successAction();
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (err) => {
      checkOnline();
      console.log(err);
    },
  });
};

export const useCompleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: DataType) => await apiCall("patch", data),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (err) => {
      console.log(err);
    },
    onMutate: () => {
      checkOnline();
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: DataType) => apiCall("delete", data),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (err) => {
      checkOnline();
      console.log(err);
    },
  });
};
