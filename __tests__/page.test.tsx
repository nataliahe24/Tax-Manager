/**
 * CRUD and UI tests for the task manager page.
 * - Create: add tasks, empty validation, tasks appear immediately
 * - Read: all tasks display, empty state when no tasks
 * - Update: toggle completion, strikethrough for completed
 * - Delete: confirm dialog, cancel keeps task
 * - Overall: header, form and list render with expected structure
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";

const confirmMock = jest.fn();

beforeAll(() => {
  window.confirm = confirmMock;
});

beforeEach(() => {
  confirmMock.mockReset();
  if (typeof window !== "undefined") window.localStorage.clear();
});

describe("Task Manager CRUD and UI", () => {
  describe("Create", () => {
    it("adds a short title task and it appears immediately in the list", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const titleInput = screen.getByLabelText(/título \*/i);
      const submitBtn = screen.getByRole("button", { name: /agregar tarea/i });

      await user.type(titleInput, "Buy milk");
      await user.click(submitBtn);

      expect(screen.getByText("Buy milk")).toBeInTheDocument();
      expect(titleInput).toHaveValue("");
    });

    it("adds a task with long text and it displays", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const longTitle =
        "This is a very long task title that might wrap on small screens";
      const titleInput = screen.getByLabelText(/título \*/i);
      const submitBtn = screen.getByRole("button", { name: /agregar tarea/i });

      await user.type(titleInput, longTitle);
      await user.click(submitBtn);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it("shows validation error when submitting empty title", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const submitBtn = screen.getByRole("button", { name: /agregar tarea/i });
      await user.click(submitBtn);

      expect(
        screen.getByText(/el título es obligatorio\./i),
      ).toBeInTheDocument();
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it("clears title input after successful submit", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const titleInput = screen.getByLabelText(/título \*/i);
      await user.type(titleInput, "Done");
      await user.click(screen.getByRole("button", { name: /agregar tarea/i }));

      expect(titleInput).toHaveValue("");
    });
  });

  describe("Read", () => {
    it("shows empty state message when there are no tasks", () => {
      render(<Home />);

      expect(
        screen.getByText(
          /aún no tienes tareas\. crea la primera desde el formulario/i,
        ),
      ).toBeInTheDocument();
    });

    it("displays all tasks with list structure after adding", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const titleInput = screen.getByLabelText(/título \*/i);
      const submitBtn = screen.getByRole("button", { name: /agregar tarea/i });

      await user.type(titleInput, "First");
      await user.click(submitBtn);
      await user.type(titleInput, "Second");
      await user.click(submitBtn);

      const list = screen.getByRole("list");
      expect(within(list).getByText("First")).toBeInTheDocument();
      expect(within(list).getByText("Second")).toBeInTheDocument();
    });

    it("renders section heading Lista de tareas", () => {
      render(<Home />);
      expect(
        screen.getByRole("heading", { name: /lista de tareas/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Update", () => {
    it("toggles completion via checkbox and shows strikethrough for completed", async () => {
      const user = userEvent.setup();
      render(<Home />);

      const titleInput = screen.getByLabelText(/título \*/i);
      await user.type(titleInput, "Complete me");
      await user.click(screen.getByRole("button", { name: /agregar tarea/i }));

      const taskTitle = screen.getByText("Complete me");
      expect(taskTitle).not.toHaveClass("line-through");

      const checkbox = screen.getByRole("checkbox", {
        name: /marcar como completada/i,
      });
      await user.click(checkbox);

      expect(taskTitle).toHaveClass("line-through");
    });
  });

  describe("Delete", () => {
    it("opens confirm dialog when delete is clicked", async () => {
      const user = userEvent.setup();
      confirmMock.mockReturnValue(false);
      render(<Home />);

      const titleInput = screen.getByLabelText(/título \*/i);
      await user.type(titleInput, "To delete");
      await user.click(screen.getByRole("button", { name: /agregar tarea/i }));

      const deleteBtn = screen.getByRole("button", {
        name: /eliminar tarea/i,
      });
      await user.click(deleteBtn);

      expect(confirmMock).toHaveBeenCalledWith(
        "¿Estás seguro de que deseas eliminar esta tarea?",
      );
    });

    it("removes task from list when user confirms", async () => {
      const user = userEvent.setup();
      confirmMock.mockReturnValue(true);
      render(<Home />);

      const titleInput = screen.getByLabelText(/título \*/i);
      await user.type(titleInput, "Will be deleted");
      await user.click(screen.getByRole("button", { name: /agregar tarea/i }));

      expect(screen.getByText("Will be deleted")).toBeInTheDocument();

      const deleteBtn = screen.getByRole("button", {
        name: /eliminar tarea/i,
      });
      await user.click(deleteBtn);

      expect(screen.queryByText("Will be deleted")).not.toBeInTheDocument();
    });

    it("keeps task in list when user cancels confirmation", async () => {
      const user = userEvent.setup();
      confirmMock.mockReturnValue(false);
      render(<Home />);

      const titleInput = screen.getByLabelText(/título \*/i);
      await user.type(titleInput, "Stay");
      await user.click(screen.getByRole("button", { name: /agregar tarea/i }));

      await user.click(screen.getByRole("button", { name: /eliminar tarea/i }));

      expect(screen.getByText("Stay")).toBeInTheDocument();
    });
  });

  describe("Overall UI", () => {
    it("renders main header with title Mis tareas", () => {
      render(<Home />);
      expect(
        screen.getByRole("heading", { name: /mis tareas/i, level: 1 }),
      ).toBeInTheDocument();
    });

    it("renders form section with Nueva tarea heading", () => {
      render(<Home />);
      expect(
        screen.getByRole("heading", { name: /nueva tarea/i }),
      ).toBeInTheDocument();
    });

    it("form has title input and submit button", () => {
      render(<Home />);
      expect(screen.getByLabelText(/título \*/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /agregar tarea/i }),
      ).toBeInTheDocument();
    });
  });
});
