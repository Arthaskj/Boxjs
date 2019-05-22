Box.define('App.Todos', {

	extend: 'Box.app.Viewport',

	elements: {

		new_todo_input: '#new-todo',

		todo_list: '#todo-list'

	},

	events: {

		'keypress new_todo_input': '_insertTodo'

	},

	delegates: {

		'button.destroy': '_removeTodo',

		'dblclick {.view}': '_editTodo',

		'blur {input.edit}': '_closeEditTodo'

	},

	templates: {

		todo: 'template_new_todo'

	},

	_insertTodo: function (e) {
		if (e.which !== Box.Keyboard.ENTER) {
			return;
		}
		this.doInsertTodo();
	},

	doInsertTodo: function () {
		var todo = this.el.new_todo_input.val();
		if (Box.isEmpty(todo)) {
			return;
		}
		var el = this.applyTemplate('todo', {todo: todo});
        this.el.todo_list.append(el);
        this.el.new_todo_input.val('');
	},

	_removeTodo: function (e, target) {
		target.closest('li').remove();
	},

	_editTodo: function (e, target) {
		target.closest('li').addClass('editing');
		target.next().focus();
	},

	_closeEditTodo: function (e, target) {
		var new_todo = target.val();
		var todo_el = target.closest('li');
		todo_el.removeClass('editing');
		if (!Box.isEmpty(new_todo)) {
			todo_el.find('label').text(new_todo);
		}
	}

});