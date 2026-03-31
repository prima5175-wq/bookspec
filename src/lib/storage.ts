import { Book } from "./types";

const STORAGE_KEY = "bookspec_books";

export function getBooks(): Book[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveBook(book: Book): void {
  const books = getBooks();
  books.push(book);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

export function deleteBook(id: string): void {
  const books = getBooks().filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

export function updateBook(updated: Book): void {
  const books = getBooks().map((b) => (b.id === updated.id ? updated : b));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
