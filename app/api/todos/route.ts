import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all todos
export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching todos" },
      { status: 500 }
    );
  }
}

// POST new todo
export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    const todo = await prisma.todo.create({
      data: {
        text,
        completed: false,
      },
    });
    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: "Error creating todo" }, { status: 500 });
  }
}

// PUT update todo
export async function PUT(request: Request) {
  try {
    const { id, text, completed } = await request.json();

    const updateData: any = {};
    if (text !== undefined) updateData.text = text;
    if (completed !== undefined) updateData.completed = completed;

    const todo = await prisma.todo.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: "Error updating todo" }, { status: 500 });
  }
}

// DELETE todo
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.todo.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting todo" }, { status: 500 });
  }
}
