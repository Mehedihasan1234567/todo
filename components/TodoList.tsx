"use client";

import { useState } from "react";
import { PlusCircle, Trash2, Edit2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const addTodo = async () => {
    if (newTodo.trim() !== "") {
      try {
        const response = await fetch("/api/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: newTodo }),
        });
        const todo = await response.json();
        setTodos([todo, ...todos]);
        setNewTodo("");
        toast.success("Todo added successfully!");
      } catch (error) {
        toast.error("Failed to add todo");
      }
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      const response = await fetch("/api/todos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed: !completed }),
      });
      const updatedTodo = await response.json();
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
      toast.success("Todo completed successfully!");
    } catch (error) {
      toast.error("Failed to update todo");
    }
  };

  const removeTodo = async (id: number) => {
    try {
      await fetch("/api/todos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setTodos(todos.filter((todo) => todo.id !== id));
      toast.success("Todo deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete todo");
    }
  };

  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = async (id: number) => {
    try {
      const response = await fetch("/api/todos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, text: editText }),
      });
      const updatedTodo = await response.json();
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
      setEditingId(null);
      setEditText("");
      toast.success("Todo updated successfully!");
    } catch (error) {
      toast.error("Failed to update todo");
      setEditingId(id);
    }
  };

  return (
    <div className="bg-card text-card-foreground shadow-md rounded-lg p-6">
      <div className="flex mb-4">
        <Input
          type="text"
          className="flex-grow mr-2"
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
        />
        <Button onClick={addTodo}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center space-x-2">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
              id={`todo-${todo.id}`}
            />
            {editingId === todo.id ? (
              <>
                <Input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-grow"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => saveEdit(todo.id)}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={cancelEditing}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <label
                  htmlFor={`todo-${todo.id}`}
                  className={`flex-grow ${
                    todo.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {todo.text}
                </label>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => startEditing(todo.id, todo.text)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeTodo(todo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
