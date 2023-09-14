(() => {
  enum notificationPlatform {
    sms = "SMS",
    email = "EMAIL",
    push_notification = "PUSH_NOTIFICATION",
  }

  const uuid = (): string => {
    return Math.random().toString(32).substring(2, 9);
  };

  enum viewMode {
    todo = "TODO",
    reminder = "REMINDER",
  }

  const dateUtils = {
    today(): Date {
      return new Date();
    },
    tomorrow(): Date {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    },
    formatDate(date: Date): string {
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    },
  };

  interface Task {
    id: string;
    dateCreated: Date;
    dateUpdated: Date;
    description: string;
    render(): string;
  }

  class Reminder implements Task {
    id: string = uuid();
    dateCreated: Date = dateUtils.today();
    dateUpdated: Date = dateUtils.today();
    description: string = "";
    date: Date = dateUtils.tomorrow();
    notifications: Array<notificationPlatform> = [notificationPlatform.email];

    constructor(
      description: string,
      date: Date,
      notifications: Array<notificationPlatform>
    ) {
      this.description = description;
      this.date = date;
      this.notifications = notifications;
    }

    render(): string {
      return `
      ---> REMINDER <---
      Description: ${this.description}
      Date: ${dateUtils.formatDate(this.date)}
      Platform: ${this.notifications.join(",")}
      `;
    }
  }

  class Todo implements Task {
    id: string = uuid();
    dateCreated: Date = dateUtils.today();
    dateUpdated: Date = dateUtils.today();
    description: string = "";
    done: boolean = false;

    constructor(description: string) {
      this.description = description;
    }

    render(): string {
      return `
      ---> TODO <---
      Description: ${this.description}
      done: ${this.done}
      `;
    }
  }

  const todo = new Todo("Todo criado com a classe");

  const reminder = new Reminder("Reminder criado com a classe", new Date(), [
    notificationPlatform.email,
  ]);

  const taskView = {
    getTodo(form: HTMLFormElement): Todo {
      const todoDescription = form.todoDescription.value;
      form.reset();
      return new Todo(todoDescription);
    },

    getReminder(form: HTMLFormElement): Reminder {
      const reminderNotifications = [
        form.notifications.value as notificationPlatform,
      ];
      const reminderDate = new Date(form.reminderDate.value);
      const reminderDescription = form.reminderDescription.value;
      form.reset();
      return new Reminder(
        reminderDescription,
        reminderDate,
        reminderNotifications
      );
    },

    render(tasks: Array<Task>, mode: viewMode) {
      const tasksList = document.getElementById("tasksList");
      while (tasksList?.firstChild) {
        tasksList.removeChild(tasksList.firstChild);
      }
      tasks.forEach((task) => {
        const li = document.createElement("li");
        const textNode = document.createTextNode(task.render());
        li.appendChild(textNode);
        tasksList?.appendChild(li);
      });

      const todoSet = document.getElementById("todoSet");
      const reminderSet = document.getElementById("reminderSet");

      if (mode === viewMode.todo) {
        todoSet?.setAttribute("style", "display: block");
        todoSet?.removeAttribute("disabled");
        reminderSet?.setAttribute("style", "display: none");
        reminderSet?.setAttribute("disabled", "true");
      } else {
        reminderSet?.setAttribute("style", "display: block");
        reminderSet?.removeAttribute("disabled");
        todoSet?.setAttribute("style", "display: none");
        todoSet?.setAttribute("disabled", "true");
      }
    },
  };
  const taskController = (view: typeof taskView) => {
    const tasks: Array<Task> = [];
    let mode: viewMode = viewMode.todo;

    const handleEvent = (event: Event) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      switch (mode as viewMode) {
        case viewMode.todo:
          tasks.push(view.getTodo(form));
          break;
        case viewMode.reminder:
          tasks.push(view.getReminder(form));
          break;
      }
      view.render(tasks, mode);
    };

    const handleToggleMode = () => {
      switch (mode as viewMode) {
        case viewMode.todo:
          mode = viewMode.reminder;
          break;
        case viewMode.reminder:
          mode = viewMode.todo;
          break;
      }
      view.render(tasks, mode);
    };

    document
      .getElementById("toggleMode")
      ?.addEventListener("click", handleToggleMode);
    document
      .getElementById("taskForm")
      ?.addEventListener("submit", handleEvent);
  };

  taskController(taskView);
})();
