// Core
import React, { PureComponent } from 'react';

// Components

// Instruments
import Styles from './styles.m.css';
import Checkbox from "../../theme/assets/Checkbox";
import Star from "../../theme/assets/Star";
import Edit from "../../theme/assets/Edit";
import Remove from "../../theme/assets/Remove";

export default class Task extends PureComponent {
    state = {
        disableInp:     true,
        isTaskEditing:  false,
        newTaskMessage: this.props.message,
        isFav:          false,
    };

    taskInput = React.createRef();

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    _updateTask = async () => {
        const { id, completed, favorite, message, update } = this.props;

        await update(message, id, completed, !favorite);
    };

    _removeTask = async () => {
        const { id, del } = this.props;

        await del(id);
    };

    _toggleTaskFavoriteState = async () => {
        const { favorite, update } = this.props;

        const completedTask = this._getTaskShape({ favorite: !favorite });

        await update(completedTask);
    };

    _setTaskEditingState = (value) => {

        const { isTaskEditing } = this.state;

        if (!isTaskEditing && value) {
            this.taskInput.current.disabled = !value;
            this.taskInput.current.focus();
        }

        this.setState({ isTaskEditing: value });
    };

    _updateNewTaskMessage = (e) => {
        const { value: newTaskMessage } = e.target;

        this.setState({ newTaskMessage });
    };

    _updateMSG = async () => {
        this._setTaskEditingState(false);
        const { newTaskMessage } = this.state;
        const { message, update } = this.props;

        if (newTaskMessage === message) {
            return null;
        }

        const newMsg = this._getTaskShape({ message: newTaskMessage });

        await update(newMsg);
    };

    _updateNewTaskMessage = (e) => {
        const target = e.target.value;

        this.setState(() => ({
            newTaskMessage: target,
        }));
    };

    _updateTaskMessageOnKeyDown = (e) => {
        const { newTaskMessage } = this.state;
        const { key: eventKey } = e;

        if (!newTaskMessage) {
            return null;
        }

        if (eventKey === "Enter") {
            this._updateMSG();

            return;
        }
        if (eventKey === "Escape") {
            this._cancelUpdatingTaskMessage();
        }
    };

    _cancelUpdatingTaskMessage = () => {
        const { message } = this.props;

        this.setState(() => ({
            newTaskMessage: message,
            isTaskEditing:  false,
        }));
    };

    _updateTaskMessageOnClick = () => {
        const { isTaskEditing } = this.state;

        if (isTaskEditing) {
            this._updateMSG();

            return null;
        }

        this._setTaskEditingState(true);
    };

    _toggleTaskCompletedState = async () => {
        const { completed, update } = this.props;

        const completedTask = this._getTaskShape({ completed: !completed });

        await update(completedTask);
    };

    render () {
        const { isTaskEditing, newTaskMessage } = this.state;
        const { completed, favorite } = this.props;


        return (
            <li className = { Styles.task }>
                <div className = { Styles.content }>
                    <Checkbox checked = { completed } inlineBlock className = { Styles.toggleTaskCompletedState } color1 = '#3B8EF3' color2 = '#fff' onClick = { this._toggleTaskCompletedState } />
                    <input disabled = { !isTaskEditing } maxLength = '50' onChange = { this._updateNewTaskMessage } onKeyDown = { this._updateTaskMessageOnKeyDown } ref = { this.taskInput } type = 'text' value = { newTaskMessage } />
                </div>
                <div className = { Styles.actions }>
                    <Star checked = { favorite } className = { Styles.toggleTaskFavoriteState } color1 = '#3B8EF3' color2 = '#000' inlineBlock onClick = { this._toggleTaskFavoriteState } />
                    <Edit inlineBlock className = { Styles.toggleTaskFavoriteState } color1 = '#3B8EF3' color2 = '#000' onClick = { this._updateTaskMessageOnClick } />
                    <Remove inlineBlock color1 = '#3B8EF3' color2 = '#000' onClick = { this._removeTask } />
                </div>
            </li>
        );
    }
}
