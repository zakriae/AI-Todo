import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Todo } from "@/types";
import { getTodos, updateTodo, deleteTodo } from "@/actions/todos";
import { createTask } from "@/actions/tasks";

const TODOS_QUERY_KEY = ["todos"];

export function useTodos() {
  const queryClient = useQueryClient();

  const { data: todos = [], isLoading, error } = useQuery<Todo[]>({
    queryKey: TODOS_QUERY_KEY,
    queryFn: () => getTodos(),
    staleTime: 1000 * 60 * 5,
  });

  const addTodoMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY }),
  });

  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY }),
  });

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY }),
  });

  return {
    todos,
    isLoading,
    error,
    addTodo: (newTodo: Partial<Todo>) => addTodoMutation.mutate(newTodo),
    updateTodo: ({todoId, isCompleted}: {todoId: string, isCompleted: boolean}) => 
      updateTodoMutation.mutate({ todoId, isCompleted }),
    deleteTodo: (id: string) => deleteTodoMutation.mutate(id),
  };
}
