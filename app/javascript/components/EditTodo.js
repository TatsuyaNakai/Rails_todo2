import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { valid } from "semver";

const InputName = styled.input`
	font-size: 20px;
	width: 100%;
	height: 40px;
	padding: 2px 7px;
	margin: 12px 0;
`;

const CurrentStatus = styled.div`
	font-size: 19px;
	margin: 8px 0 12px 0;
	font-weight: bold;
`;

const IsCompeletedButton = styled.button`
	color: #fff;
	font-weight: 500;
	font-size: 17px;
	padding: 5px 10px;
	background: #f2a115;
	border: none;
	border-radius: 3px;
	cursor: pointer;
`;

const EditButton = styled.button`
	color: white;
	font-weight: 500;
	font-size: 17px;
	padding: 5px 10px;
	margin: 0 10px;
	background: #0ac620;
	border-radius: 3px;
	border: none;
`;

const DeleteButton = styled.button`
	color: #fff;
	font-size: 17px;
	font-weight: 500;
	padding: 5px 10px;
	background: #f54242;
	border: none;
	border-radius: 3px;
	cursor: pointer;
`;

toast.configure();

function EditTodo(props) {
	const initialTodoState = {
		id: null,
		name: "",
		is_completed: false,
	};

	const [currentTodo, setCurrentTodo] = useState(initialTodoState);

	const notify = () => {
		toast.success("Todo successfully updated!", {
			position: "bottom-center",
			hideProgressBar: true,
		});
	};

	const getTodo = (id) => {
		axios
			.get(`/api/v1/todos/${id}`)
			.then((res) => {
				setCurrentTodo(res.data);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	useEffect(() => {
		getTodo(props.match.params.id);
		// URIの:idの部分を取得することができる。
	}, [props.match.params.id]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setCurrentTodo({ ...currentTodo, [name]: value });
		// []を外すと、nameの参照じゃなくて、単純にnameって書いたキーになる。
		// 参照にしてあげるなら、ブラケットで囲む。
		// 分割代入やから、そもそも名前が違うと格納できないから外しても同じなんやけど、、
	};

	const updateIsCompleted = (val) => {
		let hoge = {
			id: val.id,
			name: val.name,
			is_completed: !val.is_completed,
		};
		axios.patch(`/api/v1/todos/${hoge.id}`, hoge).then((res) => {
			setCurrentTodo(res.data);
		});
	};

	const updateTodo = () => {
		axios
			.patch(`/api/v1/todos/${currentTodo.id}`, currentTodo)
			.then(() => {
				notify();
				props.history.push("/todos");
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const deleteTodo = () => {
		const sure = window.confirm("Are you sure?");
		if (sure) {
			axios
				.delete(`/api/v1/todos/${currentTodo.id}`)
				.then(() => {
					props.history.push("/todos");
				})
				.catch((e) => {
					console.log(e);
				});
		}
	};

	return (
		<>
			<h1>Editing Todo</h1>
			<div>
				<div>
					<label htmlFor="name">Current Name</label>
					<InputName
						type="text"
						name="name"
						value={currentTodo.name}
						onChange={handleInputChange}
					/>
					<div>
						<span>Current Status</span>
						<br />
						<CurrentStatus>
							{currentTodo.is_completed ? "Completed" : "Uncompleted"}
						</CurrentStatus>
					</div>
				</div>
				{currentTodo.is_completed ? (
					<IsCompeletedButton onClick={() => updateIsCompleted(currentTodo)}>
						Uncompleted
					</IsCompeletedButton>
				) : (
					<IsCompeletedButton onClick={() => updateIsCompleted(currentTodo)}>
						Completed
					</IsCompeletedButton>
				)}
				<EditButton onClick={updateTodo}>Update</EditButton>
				<DeleteButton onClick={deleteTodo}>Delete</DeleteButton>
			</div>
		</>
	);
}

export default EditTodo;
