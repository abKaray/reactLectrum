// Core
import React, { Component } from 'react';

// Components
import Spinner from '../Spinner';
import Task from '../Task';
import Checkbox from '../../theme/assets/Checkbox';
import { api } from '../../REST/api';

// Instruments
import Styles from './styles.m.css';
import { sortTasksByGroup } from '../../instruments/helpers';

export default class Scheduler extends Component {

    state = {
        tasks:          [],
        tasksFilter:    '',
        isSpinning:     false,
        newTaskMessage: '',
    };

    componentDidMount () {
        this._fetchTasksAsync();
    }

    shouldComponentUpdate () {
        return true;
    }

    _setTasksFetchingState = (bool) => {
        this.setState({
            isSpinning: bool,
        });
    };

    _fetchTasksAsync = async () => {
        try {
            this._setTasksFetchingState(true);
            const tasks = await api.fetchTasks();

            this.setState({ tasks });
        } catch ({ message }) {
            console.log(message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _typingTest = (e) => {
        const target = e.target.value;

        this.setState({
            newTaskMessage: target,
        });
    };

    _createTaskAsync = async (e) => {
        const { newTaskMessage } = this.state;

        e.preventDefault();
        if (newTaskMessage) {
            try {
                this._setTasksFetchingState(true);

                const task = await api.createTask(newTaskMessage);

                this.setState((prevState) => ({
                    tasks:          [task, ...prevState.tasks],
                    newTaskMessage: '',
                }));

            } catch ({ message }) {
                console.log(message);
            } finally {
                this._setTasksFetchingState(false);
            }
        }
    };

    _updateTaskAsync = async (taskParams) => {
        try {
            this._setTasksFetchingState(true);
            const favoriteTask = await api.updateTask(taskParams);

            this.setState(({ tasks }) => ({
                tasks: tasks.map(
                    (task) => task.id === favoriteTask.id ? favoriteTask : task
                ),
            }));

        } catch ({ error }) {
            console.log(error);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _removeTaskAsync = async (id) => {
        const { tasks } = this.state;

        try {
            this._setTasksFetchingState(true);
            const deleteTask = tasks.filter((elem) => {
                return elem.id !== id;
            });

            await api.removeTask(id);
            this.setState({ tasks: deleteTask });
        } catch ({ message }) {
            console.log(message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _updateTasksFilter = (event) => {
        const tasksFilter = event.target.value.toLocaleLowerCase();

        this.setState({ tasksFilter });
    };

    _filterTaskByFavorite = (tasks, filter) => {
        return filter ? tasks.filter((task) => task.message.includes(filter)) : tasks;
    };

    _completeAllTasksAsync = async () => {
        const { tasks } = this.state;
        const incompleteTasks = tasks.filter((task) => !task.completed);

        if (incompleteTasks.length === 0) {
            return null;
        }

        try {
            this._setTasksFetchingState(true);
            await api.completeAllTasks(incompleteTasks);

            this.setState({
                tasks: tasks.map((task) => ({ ...task, completed: true })),
            });
        } catch ({ message }) {
            console.error(message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _getAllCompleted = () => {
        const { tasks } = this.state;


        return tasks.every((task) => task.completed);
    };

    render () {
        const { tasks: userTasks, tasksFilter, isSpinning, newTaskMessage } = this.state;

        const sortedTasks = sortTasksByGroup(userTasks);
        const filteredTasks = this._filterTaskByFavorite(sortedTasks, tasksFilter);

        const task = filteredTasks.map((elem) => (
            <Task del = { this._removeTaskAsync } key = { elem.id } update = { this._updateTaskAsync } { ...elem } />
        ));

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <Spinner isSpinning = { isSpinning } />
                    <header>
                        <h1>Планировщик задач</h1>
                        <input placeholder = 'Поиск' type = 'search' onChange = { this._updateTasksFilter } value = { tasksFilter } />
                    </header>
                    <section>
                        <form>
                            <input maxLength = '50' onChange = { this._typingTest } placeholder = 'Описание моей новой задачи' type = 'text' value = { newTaskMessage } />
                            <button onClick = { this._createTaskAsync }>Добавить задачу</button>
                        </form>
                        <div className = 'overlay'>
                            {task}
                        </div>
                    </section>
                    <footer>
                        <Checkbox inlineBlock color1 = '#363636' color2 = '#fff' onClick = { this._completeAllTasksAsync } checked = { this._getAllCompleted() } />
                        <span className = { Styles.completeAllTasks }>Все задачи выполнены</span>
                    </footer>
                </main>
            </section>
        );
    }
}
