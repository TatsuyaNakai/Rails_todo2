import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { AiFillEdit } from "react-icons/ai";

const SearchAndButtton = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const SearchForm = styled.input`
	font-size: 20px;
	width: 100%;
	height: 40px;
	margin: 10px 0;
	padding: 10px;
`;

const RemoveAllButton = styled.button`
	width: 16%;
	height: 40px;
	background: #f54242;
	border: none;
	font-weight: 500;
	margin-left: 10px;
	padding: 5px 10px;
	border-radius: 3px;
	color: #fff;
	cursor: pointer;
`;

const TodoName = styled.span`
	font-size: 27px;
	${({ is_completed }) =>
		is_completed &&
		`
    opacity: 0.4;
  `}
`;
// JSの形式で書いてるから{}がついてる。
// &&やから、is_completedがtrueなら、opacityが0.4になる。

const Row = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 7px auto;
	padding: 10px;
	font-size: 25px;
`;

const CheckedBox = styled.div`
	display: flex;
	align-items: center;
	margin: 0 7px;
	color: green;
	cursor: pointer;
`;

const UncheckedBox = styled.div`
	display: flex;
	align-items: center;
	margin: 0 7px;
	cursor: pointer;
`;

const EditButton = styled.span`
	display: flex;
	align-items: center;
	margin: 0 7px;
`;

function TodoList() {
	const [todos, setTodos] = useState([]);
	const [searchName, setSearchName] = useState("");

	useEffect(() => {
		axios
			.get("/api/v1/todos")
			// このURIに該当するアクションを探して、実行して返ってくる。
			// todos#indexアクションをしてtodosをJSON 形式で持って帰ってくる。
			.then((res) => {
				setTodos(res.data);
			})
			.catch((e) => {
				console.log(e);
			});
	}, []);

	const removeAllTodos = () => {
		const sure = window.confirm("Are you sure?");
		if (sure) {
			axios
				.delete("/api/v1/todos/destroy_all")
				// routes.rbでHTTPメソッドをdeleteで書いてるから、deleteになってる。
				// todos#destroy_allを実行してくる。何も返ってこない。
				.then((res) => {
					setTodos([]);
					// todosの配列もなくしておく。
				})
				.catch((e) => {
					console.log(e);
				});
		}
	};

	const updateIsCompleted = (val, index) => {
		let hoge = {
			id: val.id,
			name: val.name,
			is_completed: !val.is_completed,
		};
		// is_completedだけ反転したtodoをhogeに格納した！

		axios.patch(`/api/v1/todos/${val.id}`, hoge).then((res) => {
			// 上のis_completedだけ変更したtodoをtodo#updateに渡してる。
			// それがdbに保存されてから、JSON形式になったものが返ってくる。
			const newTodos = [...todos];
			// 今までの設定してたtodosの配列を展開して格納する。
			newTodos[index].is_completed = res.data.is_completed;
			// 指定された番手のis_completedに返ってきたものを、渡してあげる。
			setTodos(newTodos);
		});
	};

	return (
		<>
			<h1>Todo List</h1>
			<SearchAndButtton>
				<SearchForm
					type="text"
					placeholder="Search todo..."
					onChange={(event) => {
						setSearchName(event.target.value);
					}}
				/>
				<RemoveAllButton onClick={removeAllTodos}>Remove All</RemoveAllButton>
			</SearchAndButtton>
			<div>
				{todos
					.filter((val) => {
						// 一つ一つ条件に合えば再配列化される。適合しないと落選する。
						if (searchName === "") {
							return val;
						} else if (
							val.name.toLowerCase().includes(searchName.toLowerCase())
						) {
							return val;
						}
					})
					.map((val, key) => {
						// 配列の要素にそれぞれこんなことを行なっていく。
						return (
							<Row key={key}>
								{val.is_completed ? (
									// 三項演算子でtrueなら、こっち、falseならそっちでやってる。
									<CheckedBox>
										<ImCheckboxChecked
											onClick={() => updateIsCompleted(val, key)}
											// クリックすると処理が走るように関数が組まれてる。
										/>
									</CheckedBox>
								) : (
									<UncheckedBox>
										<ImCheckboxUnchecked
											onClick={() => updateIsCompleted(val, key)}
										/>
									</UncheckedBox>
								)}
								<TodoName is_completed={val.is_completed}>{val.name}</TodoName>
								<Link to={"/todos/" + val.id + "/edit"}>
									<EditButton>
										<AiFillEdit />
									</EditButton>
								</Link>
							</Row>
						);
					})}
			</div>
		</>
	);
}

export default TodoList;
