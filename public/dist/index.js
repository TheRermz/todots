"use strict";
(function () {
    var notificationPlatform;
    (function (notificationPlatform) {
        notificationPlatform["sms"] = "SMS";
        notificationPlatform["email"] = "EMAIL";
        notificationPlatform["push_notification"] = "PUSH_NOTIFICATION";
    })(notificationPlatform || (notificationPlatform = {}));
    var uuid = function () {
        return Math.random().toString(32).substring(2, 9);
    };
    var viewMode;
    (function (viewMode) {
        viewMode["todo"] = "TODO";
        viewMode["reminder"] = "REMINDER";
    })(viewMode || (viewMode = {}));
    var dateUtils = {
        today: function () {
            return new Date();
        },
        tomorrow: function () {
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow;
        },
        formatDate: function (date) {
            return "".concat(date.getDate(), "/").concat(date.getMonth() + 1, "/").concat(date.getFullYear());
        },
    };
    var Reminder = /** @class */ (function () {
        function Reminder(description, date, notifications) {
            this.id = uuid();
            this.dateCreated = dateUtils.today();
            this.dateUpdated = dateUtils.today();
            this.description = "";
            this.date = dateUtils.tomorrow();
            this.notifications = [notificationPlatform.email];
            this.description = description;
            this.date = date;
            this.notifications = notifications;
        }
        Reminder.prototype.render = function () {
            return "\n      ---> REMINDER <---\n      Description: ".concat(this.description, "\n      Date: ").concat(dateUtils.formatDate(this.date), "\n      Platform: ").concat(this.notifications.join(","), "\n      ");
        };
        return Reminder;
    }());
    var Todo = /** @class */ (function () {
        function Todo(description) {
            this.id = uuid();
            this.dateCreated = dateUtils.today();
            this.dateUpdated = dateUtils.today();
            this.description = "";
            this.done = false;
            this.description = description;
        }
        Todo.prototype.render = function () {
            return "\n      ---> TODO <---\n      Description: ".concat(this.description, "\n      done: ").concat(this.done, "\n      ");
        };
        return Todo;
    }());
    var todo = new Todo("Todo criado com a classe");
    var reminder = new Reminder("Reminder criado com a classe", new Date(), [
        notificationPlatform.email,
    ]);
    var taskView = {
        getTodo: function (form) {
            var todoDescription = form.todoDescription.value;
            form.reset();
            return new Todo(todoDescription);
        },
        getReminder: function (form) {
            var reminderNotifications = [
                form.notifications.value,
            ];
            var reminderDate = new Date(form.reminderDate.value);
            var reminderDescription = form.reminderDescription.value;
            form.reset();
            return new Reminder(reminderDescription, reminderDate, reminderNotifications);
        },
        render: function (tasks, mode) {
            var tasksList = document.getElementById("tasksList");
            while (tasksList === null || tasksList === void 0 ? void 0 : tasksList.firstChild) {
                tasksList.removeChild(tasksList.firstChild);
            }
            tasks.forEach(function (task) {
                var li = document.createElement("li");
                var textNode = document.createTextNode(task.render());
                li.appendChild(textNode);
                tasksList === null || tasksList === void 0 ? void 0 : tasksList.appendChild(li);
            });
            var todoSet = document.getElementById("todoSet");
            var reminderSet = document.getElementById("reminderSet");
            if (mode === viewMode.todo) {
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.setAttribute("style", "display: block");
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.removeAttribute("disabled");
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.setAttribute("style", "display: none");
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.setAttribute("disabled", "true");
            }
            else {
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.setAttribute("style", "display: block");
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.removeAttribute("disabled");
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.setAttribute("style", "display: none");
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.setAttribute("disabled", "true");
            }
        },
    };
    var taskController = function (view) {
        var _a, _b;
        var tasks = [];
        var mode = viewMode.todo;
        var handleEvent = function (event) {
            event.preventDefault();
            var form = event.target;
            switch (mode) {
                case viewMode.todo:
                    tasks.push(view.getTodo(form));
                    break;
                case viewMode.reminder:
                    tasks.push(view.getReminder(form));
                    break;
            }
            view.render(tasks, mode);
        };
        var handleToggleMode = function () {
            switch (mode) {
                case viewMode.todo:
                    mode = viewMode.reminder;
                    break;
                case viewMode.reminder:
                    mode = viewMode.todo;
                    break;
            }
            view.render(tasks, mode);
        };
        (_a = document
            .getElementById("toggleMode")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", handleToggleMode);
        (_b = document
            .getElementById("taskForm")) === null || _b === void 0 ? void 0 : _b.addEventListener("submit", handleEvent);
    };
    taskController(taskView);
})();
