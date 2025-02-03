import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(todos)
}

export async function POST(request: Request) {
  const { text } = await request.json()
  const todo = await prisma.todo.create({
    data: { text },
  })
  return NextResponse.json(todo)
}

export async function PUT(request: Request) {
  const { id, text, completed } = await request.json()
  const todo = await prisma.todo.update({
    where: { id },
    data: { text, completed },
  })
  return NextResponse.json(todo)
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  await prisma.todo.delete({
    where: { id },
  })
  return NextResponse.json({ message: "Todo deleted" })
}

