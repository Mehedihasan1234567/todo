import TodoList from "../components/TodoList"
import prisma from "@/lib/prisma"

export default async function Home() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-24">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-4xl font-bold text-center text-foreground">Todo App</h1>
        <TodoList initialTodos={todos} />
      </div>
    </main>
  )
}

