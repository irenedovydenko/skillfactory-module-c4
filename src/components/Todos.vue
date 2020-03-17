<template>
  <div class="container">
    <div class="col-sm-10">
      <h1>Задачи</h1>
      <confirmation
        :message="confirmationMessage"
        v-if="showConfirmation"
        ></confirmation>
      <button
        type="button"
        id="task-add"
        class="btn btn-success btn-sm align-left d-block" v-b-modal.todo-modal>
        Добавить задачу
      </button>

      <h4>
        Выполненные задачи: {{ true_count }}, всего задач: {{ true_count + false_count }}
      </h4>

      <table class="table table-dark table-stripped table-hover">
        <thead class="thead-light">
          <tr>
            <th>Uid</th>
            <th>Описание</th>
            <th>Выполнена?</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(todo, index) in todos" :key="index">
            <td class="todo-uid">{{ todo.uid }}</td>
            <td>{{ todo.description }}</td>
            <td>
              <span v-if="todo.is_completed">Выполнено</span>
              <span v-else>Не выполнено</span>
            </td>
            <td>
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-secondary btn-sm">Обновить</button>
                &nbsp;
                <button type="button" class="btn btn-danger btn-sm">X</button>
              </div>
            </td>
          </tr>
        </tbody>

      </table>
      <b-modal ref="addTodoModal"
         id="todo-modal"
         title="Добавить задачу"
         hide-footer>
      <b-form @submit="onSubmit" @reset="onReset" class="w-100">
      <b-form-group id="form-description-group"
                    label="Описание:"
                    label-for="form-description-input">
        <b-form-input id="form-description-input"
                      type="text"
                      v-model="addTodoForm.description"
                      required
                      placeholder="Завести задачу">
        </b-form-input>
      </b-form-group>
      <b-form-group id="form-complete-group">
        <b-form-checkbox-group v-model="addTodoForm.is_completed" id="form-checks">
          <b-form-checkbox value="true">Задача выполнена?</b-form-checkbox>
        </b-form-checkbox-group>
        </b-form-group>
        <b-button type="submit" variant="primary">Добавить</b-button>
        <b-button type="reset" variant="danger">Сброс</b-button>
      </b-form>
    </b-modal>
    <button type="button"
        class="btn btn-danger btn-sm"
        @click="deleteTodo(todo)">
      X
    </button>
    </div>
  </div>
</template>

<style>
button#task-add {
  margin-top: 20px;
  margin-bottom: 20px;
}
h1, td {
  text-align: left;
}
.todo-uid {
  text-align: right;
}
</style>

<script>
import axios from 'axios';
import { fakeAxios } from '../utils';
import Confirmation from './Confirmation.vue';

const dataURL = 'http://localhost:8080/api/tasks/';

export default {
  name: 'Todo',
  data() {
    return {
      todos: [],
      connection: false,
      addTodoForm: {
        description: '',
        is_completed: [],
      },
      updateTodoForm: {
        uid: 0,
        description: '',
        is_completed: [],
      },
      confirmationMessage: '',
      showConfirmation: false,
      true_count: 'Нет выполненных задач',
      false_count: '',
      true_arr: [],
      false_arr: [],
    };
  },
  methods: {
    getTodos() {
      if (this.connection === false) {
        this.todos = [];
        fakeAxios.entries.forEach((item) => {
          this.todos.push(
            JSON.parse(
              fakeAxios.get(item, () => {
                this.getCountTrue(item);
                this.getCountFalse(item);
              }),
            ),
          );
        });
      } else {
        axios
          .then((response) => {
            this.todos = response.data.tasks;
          });
        // .catch(error => {
        this.connection = false;
        console.log('Ошибка! Отсутствует соединение с БД');
      }
    },
  },
  resetForm() {
    this.addTodoForm.description = '';
    this.addTodoForm.is_completed = [];
    this.updateTodoForm.description = '';
    this.updateTodoForm.is_completed = [];
  },
  onSubmit(event) {
    event.preventDefault();
    this.$refs.addTodoModal.hide();
    const requestData = {
      description: this.addTodoForm.description,
      is_completed: this.addTodoForm.is_completed[0],
    };

    fakeAxios.post(fakeAxios.count, JSON.stringify(requestData), () => {
      this.getTodos();
      this.confirmationMessage = 'Задача "$(request.Data.description)" добавлена';
      this.showConfirmation = true;
    });
    this.resetForm();
  },
  onReset(event) {
    event.preventDefault();
    this.$refs.addTodoModal.hide();
    this.resetForm();
  },
  updateTodo(todo) {
    this.updateTodoForm = todo;
  },
  onUpdateSubmit(event) {
    event.preventDefault();
    this.$refs.updateTodoModal.hide();
    const requestData = {
      description: this.updateTodoForm.description,
      is_completed: this.updateTodoForm.is_completed[0],
    };
    const todoURL = dataURL + this.updateTodoForm.uid;
    axios.put(todoURL, requestData).then(() => {
      this.getTodos();
      this.confirmationMessage = 'Задача обновлена';
      this.showConfirmation = true;
    });
  },
  onUpdateReset(event) {
    event.preventDefault();
    this.$refs.updateTodoModal.hide();
    this.resetForm();
  },
  deleteTodo(todo) {
    const todoURL = dataURL + todo.uid;
    axios.delete(todoURL)
      .then(() => {
        this.getTodos();
        this.confirmationMessage = 'Задача удалена из списка';
        this.showConfirmation = true;
      });
  },
  getCountTrue() {
    fakeAxios.values();
    this.true_count = fakeAxios.countTrue;
  },
  getCountFalse() {
    fakeAxios.values();
    this.false_count = fakeAxios.countFalse;
  },
  components: {
    confirmation: Confirmation,
  },

  created() {
    this.getTodos();
    this.getCountTrue();
    this.getCountFalse();
  },
};
</script>
